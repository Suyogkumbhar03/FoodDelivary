import MenuItem from '../models/MenuItem.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * @desc    Get featured/top-rated menu items across all restaurants
 * @route   GET /api/menu/featured
 * @access  Public
 */
export const getFeaturedMenuItems = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 8;

    const featuredItems = await MenuItem.find({ isAvailable: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .populate('restaurant', 'name slug logo cuisineType rating priceLevel');

    return sendSuccess(res, 200, 'Featured menu items retrieved successfully', featuredItems, {
      count: featuredItems.length
    });
  } catch (error) {
    next(error);
  }
};
