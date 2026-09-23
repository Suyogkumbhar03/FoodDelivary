import express from 'express';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const router = express.Router();

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants with search, vegOnly filter, minRating filter, and sorting
 * @access  Public
 */
router.get('/restaurants', async (req, res, next) => {
  try {
    const { search, vegOnly, minRating, sortBy } = req.query;

    let query = {};

    // 1. Search Filter (by restaurant name or cuisine)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisines: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Pure Veg Filter
    if (vegOnly === 'true' || vegOnly === true) {
      query.pureVeg = true;
    }

    // 3. Minimum Rating Filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    let mongoQuery = Restaurant.find(query);

    // 4. Sorting logic
    if (sortBy === 'deliveryTime') {
      mongoQuery = mongoQuery.sort({ deliveryTimeRange: 1 });
    } else if (sortBy === 'rating') {
      mongoQuery = mongoQuery.sort({ rating: -1 });
    } else {
      mongoQuery = mongoQuery.sort({ isPromoted: -1, createdAt: -1 });
    }

    const restaurants = await mongoQuery;

    return sendSuccess(res, 200, 'Restaurants fetched successfully', restaurants, {
      count: restaurants.length
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant profile and menu items grouped by category
 * @access  Public
 */
router.get('/restaurants/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find by ObjectId or slug
    let restaurant;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      restaurant = await Restaurant.findById(id);
    } else {
      restaurant = await Restaurant.findOne({ slug: id });
    }

    if (!restaurant) {
      return sendError(res, 404, 'Restaurant not found');
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id }).sort({ isBestseller: -1, price: 1 });

    // Group menu items by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      const cat = item.category || 'Bestsellers';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return sendSuccess(res, 200, 'Restaurant details retrieved successfully', {
      restaurant,
      menuItems,
      groupedMenu
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new customer food order with GST & Platform fee breakdown
 * @access  Public
 */
router.post('/orders', async (req, res, next) => {
  try {
    const { customer, items, paymentMode } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.email || !customer.address) {
      return sendError(res, 400, 'Customer details (name, phone, email, address) are required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Order must contain at least one item');
    }

    // Validate and process items
    let processedItems = [];
    let calculatedItemTotal = 0;

    for (const item of items) {
      const itemId = item.menuItemId || item._id || item.id;
      if (!itemId) continue;

      const menuItemDoc = await MenuItem.findById(itemId);
      const price = menuItemDoc ? menuItemDoc.price : (item.price || 100);
      const name = menuItemDoc ? menuItemDoc.name : (item.name || 'Gourmet Dish');
      const isVeg = menuItemDoc ? menuItemDoc.isVeg : (item.isVeg ?? true);
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;

      const lineTotal = price * qty;
      calculatedItemTotal += lineTotal;

      processedItems.push({
        menuItemId: menuItemDoc ? menuItemDoc._id : itemId,
        name,
        price,
        quantity: qty,
        isVeg
      });
    }

    // Calculate taxes & fees
    const itemTotal = Number(calculatedItemTotal.toFixed(2));
    const gst = Number((itemTotal * 0.05).toFixed(2)); // 5% GST
    const deliveryFee = itemTotal >= 500 ? 0 : 40; // ₹40 delivery fee, free over ₹500
    const platformFee = 30; // ₹30 platform fee
    const discount = 0;
    const grandTotal = Number((itemTotal + gst + deliveryFee + platformFee - discount).toFixed(2));

    const newOrder = await Order.create({
      customer,
      items: processedItems,
      billBreakdown: {
        itemTotal,
        gst,
        deliveryFee,
        platformFee,
        discount,
        grandTotal
      },
      paymentMode: paymentMode || 'UPI',
      status: 'Order Confirmed'
    });

    return sendSuccess(res, 201, 'MASALA CRUSH Order created successfully', newOrder);
  } catch (error) {
    next(error);
  }
});

export default router;
