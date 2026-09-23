import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get all restaurants (with search, cuisine/diet filtering, and sorting)
 * @route   GET /api/restaurants
 * @access  Public
 */
export const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, diet, sortBy, priceLevel } = req.query;

    let query = { isAvailable: true };

    // Search filter across name and cuisineType
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisineType: { $regex: search, $options: 'i' } }
      ];
    }

    // Cuisine filter
    if (cuisine) {
      const cuisineList = cuisine.split(',').map(c => c.trim());
      query.cuisineType = { $in: cuisineList.map(c => new RegExp(c, 'i')) };
    }

    // Price level filter
    if (priceLevel) {
      query.priceLevel = priceLevel;
    }

    // Dietary filter (filter restaurants that have menu items matching dietaryFlags)
    if (diet) {
      const dietFlags = diet.split(',').map(d => d.trim());
      const matchingMenuItems = await MenuItem.find({
        dietaryFlags: { $in: dietFlags.map(d => new RegExp(d, 'i')) }
      }).select('restaurant');

      const restaurantIds = [...new Set(matchingMenuItems.map(item => item.restaurant.toString()))];
      
      if (query._id) {
        query._id = { $in: restaurantIds };
      } else {
        query._id = { $in: restaurantIds };
      }
    }

    // Sorting option
    let sortOptions = {};
    if (sortBy === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sortBy === 'deliveryTime' || sortBy === 'deliveryTimeMinutes') {
      sortOptions = { deliveryTimeMinutes: 1 };
    } else if (sortBy === 'minOrder') {
      sortOptions = { minOrder: 1 };
    } else if (sortBy === 'name') {
      sortOptions = { name: 1 };
    } else {
      // Default: featured first, then rating
      sortOptions = { isFeatured: -1, rating: -1 };
    }

    const restaurants = await Restaurant.find(query).sort(sortOptions);

    return sendSuccess(res, 200, 'Restaurants retrieved successfully', restaurants, {
      count: restaurants.length
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single restaurant details by ID or Slug with full populated menu grouped by category
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Support finding by ObjectId or Slug
    let restaurant;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      restaurant = await Restaurant.findById(id);
    } else {
      restaurant = await Restaurant.findOne({ slug: id });
    }

    if (!restaurant) {
      return sendError(res, 404, 'Restaurant not found');
    }

    // Fetch all menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).sort({ category: 1, price: 1 });

    // Group menu items by category
    const categories = ['Signature Cuts', 'Artisan Dough', 'Craft Bowls', 'Guilty Desserts', 'Botanical Tonics'];
    
    const menuByCategory = categories.reduce((acc, category) => {
      const items = menuItems.filter(item => item.category === category);
      if (items.length > 0) {
        acc[category] = items;
      }
      return acc;
    }, {});

    const responseData = {
      restaurant,
      menuItems,
      menuByCategory
    };

    return sendSuccess(res, 200, 'Restaurant details retrieved successfully', responseData);
  } catch (error) {
    next(error);
  }
};
