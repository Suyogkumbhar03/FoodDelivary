import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  flat: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v); // 10-digit Indian phone validation
      },
      message: props => `${props.value} is not a valid 10-digit Indian phone number!`
    }
  },
  password: { type: String, required: true },
  addresses: [addressSchema],
  hasCompletedAddress: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
