import express from 'express';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireAddressMiddleware } from '../middleware/requireAddressMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/orders/checkout-preview
 * @desc    Protected. Takes cart items, calculates Indian taxes & charges
 * @access  Protected
 */
router.post('/checkout-preview', authMiddleware, async (req, res) => {
  try {
    const { items, restaurantId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required for checkout preview.' });
    }

    let itemTotal = 0;
    const validatedItems = [];

    for (const cartItem of items) {
      const price = cartItem.price || 200;
      const qty = cartItem.qty || cartItem.quantity || 1;
      itemTotal += price * qty;

      validatedItems.push({
        name: cartItem.name,
        price,
        quantity: qty,
        isVeg: cartItem.veg !== undefined ? cartItem.veg : cartItem.isVeg
      });
    }

    const packagingCharge = 25;
    const deliveryFee = itemTotal > 500 ? 0 : 30;
    const gst = Math.round(itemTotal * 0.05); // 5% GST & Culinary Cess
    const discount = itemTotal > 400 ? 138 : 0;
    const grandTotal = Math.max(0, itemTotal + packagingCharge + deliveryFee + gst - discount);

    res.json({
      success: true,
      billSummary: {
        itemTotal,
        packagingCharge,
        deliveryFee,
        gst,
        discount,
        grandTotal
      },
      validatedItems
    });
  } catch (error) {
    console.error('Checkout Preview Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating checkout preview.' });
  }
});

/**
 * @route   POST /api/orders/create
 * @desc    Protected (Requires Auth + Address Verification). Places order
 * @access  Protected (Auth + Address Required)
 */
router.post('/create', [authMiddleware, requireAddressMiddleware], async (req, res) => {
  try {
    const { restaurantId, items, paymentMode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required to place an order.' });
    }

    // Select default or primary address from user profile
    const userAddresses = req.user.addresses;
    const defaultAddress = userAddresses.find(a => a.isDefault) || userAddresses[0];

    let itemTotal = 0;
    const orderItems = items.map(item => {
      const price = item.price || 250;
      const qty = item.qty || item.quantity || 1;
      itemTotal += price * qty;

      return {
        name: item.name,
        price,
        quantity: qty,
        isVeg: item.veg !== undefined ? item.veg : item.isVeg,
        customization: item.customization || ''
      };
    });

    const packagingCharge = 25;
    const deliveryFee = itemTotal > 500 ? 0 : 30;
    const gst = Math.round(itemTotal * 0.05);
    const discount = itemTotal > 400 ? 138 : 0;
    const grandTotal = Math.max(0, itemTotal + packagingCharge + deliveryFee + gst - discount);

    let restId = restaurantId;
    if (!restId || !restId.match(/^[0-9a-fA-F]{24}$/)) {
      const defaultRest = await Restaurant.findOne();
      restId = defaultRest ? defaultRest._id : null;
    }

    const order = new Order({
      user: req.user._id,
      restaurant: restId,
      items: orderItems,
      deliveryAddress: {
        flat: defaultAddress.flat,
        street: defaultAddress.street,
        area: defaultAddress.area,
        city: defaultAddress.city,
        pincode: defaultAddress.pincode,
        phone: req.user.phone,
        landmark: defaultAddress.landmark || ''
      },
      paymentMode: paymentMode || 'UPI',
      paymentStatus: 'COMPLETED',
      orderStatus: 'ORDER_PLACED',
      billSummary: {
        itemTotal,
        gst,
        packagingCharge,
        deliveryFee,
        discount,
        grandTotal
      },
      estimatedDeliveryMinutes: 30,
      valetDetails: {
        name: 'Rajesh Kumar',
        rating: 4.9,
        phone: '+91 98765 43210',
        tempCheck: '98.4°F Checked',
        deliveries: '2,420+ safe deliveries'
      }
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Royal Order placed successfully!',
      orderId: order._id,
      orderNumber: `UCRV-${order._id.toString().slice(-5).toUpperCase()}`,
      order
    });
  } catch (error) {
    console.error('Order Create Error:', error);
    res.status(500).json({ success: false, message: 'Server error placing order.' });
  }
});

/**
 * @route   GET /api/orders/my-orders
 * @desc    Protected. Get logged-in user's past orders
 * @access  Protected
 */
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image cuisines')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Fetch My Orders Error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user orders.' });
  }
});

/**
 * @route   GET /api/orders/:id/track
 * @desc    Protected. Get real-time status and live tracking info for an order
 * @access  Protected
 */
router.get('/:id/track', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('restaurant', 'name image cuisines');
    } else {
      order = await Order.findOne({ user: req.user._id }).sort({ createdAt: -1 }).populate('restaurant', 'name image cuisines');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order tracking details not found.' });
    }

    const timeline = [
      { id: 1, title: 'Order Confirmed', time: '8:14 PM', done: true, note: 'Recipe logged to master Bawarchi' },
      { id: 2, title: 'Kitchen Preparing', time: 'Cooking Now', active: order.orderStatus === 'ORDER_PLACED' || order.orderStatus === 'KITCHEN_PREPARING', note: 'Chef is cooking Dum Biryani' },
      { id: 3, title: 'Valet Assigned', time: 'Assigned', done: order.orderStatus === 'OUT_FOR_DELIVERY' || order.orderStatus === 'DELIVERED', note: `${order.valetDetails.name} waiting at kitchen` },
      { id: 4, title: 'Food Delivered', time: `Est. ${order.estimatedDeliveryMinutes} mins`, done: order.orderStatus === 'DELIVERED', note: `At ${order.deliveryAddress.flat}, ${order.deliveryAddress.area}` }
    ];

    res.json({
      success: true,
      tracking: {
        orderId: order._id,
        orderNumber: `UCRV-${order._id.toString().slice(-5).toUpperCase()}`,
        status: order.orderStatus,
        restaurantName: order.restaurant ? order.restaurant.name : 'Dastarkhwan Awadhi Kitchen',
        eta: `${order.estimatedDeliveryMinutes} mins`,
        valet: order.valetDetails,
        deliveryAddress: order.deliveryAddress,
        timeline,
        grandTotal: order.billSummary.grandTotal
      }
    });
  } catch (error) {
    console.error('Order Track Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving live tracking.' });
  }
});

export default router;
