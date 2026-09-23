import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, required: true },
  isBestseller: { type: Boolean, default: false },
  spiceLevel: { type: Number, default: 1 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  customization: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
