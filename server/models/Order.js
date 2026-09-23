import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  customization: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    flat: String,
    street: String,
    area: String,
    city: String,
    pincode: String,
    phone: String,
    landmark: String
  },
  paymentMode: {
    type: String,
    enum: ['UPI', 'CARDS', 'COD', 'NETBANKING'],
    default: 'UPI'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  },
  orderStatus: {
    type: String,
    enum: ['ORDER_PLACED', 'KITCHEN_PREPARING', 'RIDER_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'],
    default: 'ORDER_PLACED'
  },
  billSummary: {
    itemTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    packagingCharge: { type: Number, default: 25 },
    deliveryFee: { type: Number, default: 30 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true }
  },
  estimatedDeliveryMinutes: { type: Number, default: 30 },
  valetDetails: {
    name: { type: String, default: 'Rajesh Kumar' },
    rating: { type: Number, default: 4.9 },
    phone: { type: String, default: '+91 98765 43210' },
    tempCheck: { type: String, default: '98.4°F Checked' },
    deliveries: { type: String, default: '2,420+ safe deliveries' }
  }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
