import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Create a new customer order
 * @route   POST /api/orders
 * @access  Public
 */
export const createOrder = async (req, res, next) => {
  try {
    const { customer, items, paymentMethod, deliveryFee, tax, specialInstructions } = req.body;

    // Validation checks
    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.deliveryAddress) {
      return sendError(res, 400, 'Customer information (name, email, phone, delivery address) is required');
    }

    const { street, city, postalCode } = customer.deliveryAddress;
    if (!street || !city || !postalCode) {
      return sendError(res, 400, 'Delivery address must include street, city, and postal code');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, 'Order must contain at least one item');
    }

    const validPaymentMethods = ['Card', 'UPI', 'COD'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return sendError(res, 400, `Payment method must be one of: ${validPaymentMethods.join(', ')}`);
    }

    // Verify items and calculate subtotal securely from server prices if possible or calculate subtotal
    let processedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      if (!item.menuItem || !item.quantity || item.quantity < 1) {
        return sendError(res, 400, 'Each item must have a valid menuItem ID and quantity >= 1');
      }

      const menuItemDoc = await MenuItem.findById(item.menuItem);
      if (!menuItemDoc) {
        return sendError(res, 404, `Menu item with ID ${item.menuItem} not found`);
      }

      const itemPrice = item.price !== undefined ? Number(item.price) : menuItemDoc.price;
      const itemSubtotal = itemPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      processedItems.push({
        menuItem: menuItemDoc._id,
        name: menuItemDoc.name,
        price: itemPrice,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || specialInstructions || ''
      });
    }

    // Calculate fees
    const finalSubtotal = Number(calculatedSubtotal.toFixed(2));
    const finalDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : (finalSubtotal >= 50 ? 0 : 4.99);
    const calculatedTax = tax !== undefined ? Number(tax) : Number((finalSubtotal * 0.08).toFixed(2)); // 8% tax
    const finalTotal = Number((finalSubtotal + finalDeliveryFee + calculatedTax).toFixed(2));

    const newOrder = await Order.create({
      customer,
      items: processedItems,
      paymentMethod,
      subtotal: finalSubtotal,
      deliveryFee: finalDeliveryFee,
      tax: calculatedTax,
      total: finalTotal,
      status: 'Order Placed'
    });

    const populatedOrder = await Order.findById(newOrder._id).populate('items.menuItem', 'name category image price');

    return sendSuccess(res, 201, 'Order placed successfully', populatedOrder, {
      orderId: newOrder._id,
      estimatedDeliveryMinutes: 30
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order details by order ID
 * @route   GET /api/orders/:id
 * @access  Public
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return sendError(res, 400, 'Invalid Order ID format');
    }

    const order = await Order.findById(id).populate({
      path: 'items.menuItem',
      populate: { path: 'restaurant', select: 'name logo heroBannerImage address' }
    });

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    return sendSuccess(res, 200, 'Order details retrieved successfully', order);
  } catch (error) {
    next(error);
  }
};
