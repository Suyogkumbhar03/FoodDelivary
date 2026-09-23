import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'crave_secret_key_2026';

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user & return JWT token
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty().trim(),
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('phone', 'Valid 10-digit Indian phone number is required').matches(/^[6-9]\d{9}$/),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        addresses: [],
        hasCompletedAddress: false
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
          hasCompletedAddress: user.hasCompletedAddress
        }
      });
    } catch (error) {
      console.error('Register Error:', error);
      res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials.' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          addresses: user.addresses,
          hasCompletedAddress: user.hasCompletedAddress || (user.addresses && user.addresses.length > 0)
        }
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile & addresses
 * @access  Protected
 */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        addresses: req.user.addresses,
        hasCompletedAddress: req.user.hasCompletedAddress || (req.user.addresses && req.user.addresses.length > 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
});

/**
 * @route   POST /api/auth/address
 * @desc    Add or update user delivery address
 * @access  Protected
 */
router.post(
  '/address',
  [
    authMiddleware,
    body('flat', 'Flat/Door No is required').notEmpty(),
    body('street', 'Street is required').notEmpty(),
    body('area', 'Area is required').notEmpty(),
    body('city', 'City is required').notEmpty(),
    body('pincode', 'Pincode is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { flat, street, area, city, pincode, landmark, isDefault } = req.body;

    try {
      const user = await User.findById(req.user._id);

      const newAddress = {
        flat,
        street,
        area,
        city,
        pincode,
        landmark: landmark || '',
        isDefault: isDefault || user.addresses.length === 0
      };

      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }

      user.addresses.push(newAddress);
      user.hasCompletedAddress = true;

      await user.save();

      res.status(201).json({
        success: true,
        message: 'Delivery address added successfully.',
        addresses: user.addresses,
        hasCompletedAddress: true
      });
    } catch (error) {
      console.error('Address Add Error:', error);
      res.status(500).json({ success: false, message: 'Server error adding address.' });
    }
  }
);

export default router;
