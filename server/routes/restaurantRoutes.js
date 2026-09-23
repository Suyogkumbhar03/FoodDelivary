import express from 'express';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

/**
 * @route   GET /api/restaurants
 * @desc    Public route to browse restaurants with search, veg, and rating filters
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, vegOnly, minRating } = req.query;

    let query = { isAvailable: true };

    if (vegOnly === 'true') {
      query.pureVeg = true;
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { cuisines: searchRegex }
      ];
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });

    res.json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    console.error('Fetch Restaurants Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching restaurants.' });
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Public route to get single restaurant details and menu grouped by category
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let restaurant;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      restaurant = await Restaurant.findById(id);
    } else {
      restaurant = await Restaurant.findOne({ slug: id.toLowerCase() });
    }

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    // Group menu items by category
    const categorizedMenu = menuItems.reduce((acc, item) => {
      const cat = item.category || 'Specialties';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      restaurant,
      menuCount: menuItems.length,
      menu: categorizedMenu,
      menuItems
    });
  } catch (error) {
    console.error('Fetch Single Restaurant Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching restaurant details.' });
  }
});

export default router;
