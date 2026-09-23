import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  image: { type: String, required: true },
  coverImage: { type: String, required: true },
  cuisines: [{ type: String, required: true }],
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 1240 },
  deliveryTimeMin: { type: Number, default: 30 },
  costForTwo: { type: Number, default: 450 },
  pureVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  fssai: { type: String, default: 'FSSAI License #11223004000891' },
  establishmentType: {
    type: String,
    enum: ['Hotels & Fine Dine', 'Street Stalls & Thelas', 'Fast Food & Addas', 'Udupi & Tiffin Centers', 'Highway Dhabas', 'Mithai & Sweet Shops'],
    default: 'Hotels & Fine Dine'
  },
  priceTier: {
    type: String,
    enum: ['Affordable (₹100-200)', 'Mid-Range (₹300-500)', 'Premium (₹800+)'],
    default: 'Mid-Range (₹300-500)'
  },
  distanceKm: { type: Number, default: 2.5 },
  offerTag: { type: String },
  isPromoted: { type: Boolean, default: false },
  address: { type: String, default: 'Indiranagar, Bengaluru' }
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
