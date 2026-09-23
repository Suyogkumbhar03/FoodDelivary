import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { createOrder } from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    getSubtotal,
    getDeliveryFee,
    getPlatformFee,
    getTax,
    clearCart
  } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const platformFee = getPlatformFee();
  const tax = getTax();

  // Tip Selector State
  const [tip, setTip] = useState(5);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: 'New York',
    postalCode: '10001',
    notes: '',
    paymentMethod: 'UPI'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const grandTotal = subtotal + deliveryFee + platformFee + tax + tip;

  // Validation Handler
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.street.trim()) newErrors.street = 'Delivery street address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    if (items.length === 0) {
      setServerError('Your basket is empty. Please add items before checking out.');
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          deliveryAddress: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            notes: formData.notes
          }
        },
        items: items.map((item) => ({
          menuItem: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || ''
        })),
        paymentMethod: formData.paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        tip,
        total: grandTotal
      };

      const response = await createOrder(orderPayload);
      const createdOrder = response.data;
      const orderId = createdOrder._id || createdOrder.id;

      // Clear Zustand Cart Store
      clearCart();

      // Navigate to Order Confirmation digital ticket
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Order submission error:', err);
      setServerError(
        err.response?.data?.message || 'Failed to process order. Please verify details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#161513] border border-[#2A2724] flex items-center justify-center text-[#E25B32] mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-display font-extrabold text-2xl mb-2">Your Basket is Empty</h2>
        <p className="text-xs font-mono text-[#EDE8DF]/60 max-w-sm mb-6">
          Add gourmet dishes from our concept kitchens before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-full bg-[#E25B32] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#E25B32]/90 transition-all shadow-md"
        >
          Explore Kitchens
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] selection:bg-[#E25B32] selection:text-white pb-24">
      {/* Top Header */}
      <div className="border-b border-[#2A2724] bg-[#161513]/60 backdrop-blur-md sticky top-[61px] z-20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-mono text-[#EDE8DF]/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Menu</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-[#9EB878]">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit Encrypted Epicurean Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#EDE8DF] mb-2 tracking-tight">
          Checkout & Delivery Dispatch
        </h1>
        <p className="text-xs font-mono text-[#EDE8DF]/60 mb-8">
          Complete your delivery details below to transmit your order to our master chefs.
        </p>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Two-Column Responsive Layout */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Delivery Details & Payment Selection */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-[#161513] border border-[#2A2724] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="font-display font-bold text-lg text-[#EDE8DF] border-b border-[#2A2724] pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-[#E25B32]" />
                Customer Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">
                    Full Name <span className="text-[#E25B32]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Alexander Vance"
                    className={`w-full bg-[#0E0D0C] border px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500' : 'border-[#2A2724] focus:border-[#E25B32]'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">
                    Phone Number <span className="text-[#E25B32]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="E.g. 555-019-2834"
                    className={`w-full bg-[#0E0D0C] border px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-[#2A2724] focus:border-[#E25B32]'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">
                  Email Address <span className="text-[#E25B32]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alexander.vance@epicurean.com"
                  className={`w-full bg-[#0E0D0C] border px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500' : 'border-[#2A2724] focus:border-[#E25B32]'
                  }`}
                />
                {errors.email && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-[#161513] border border-[#2A2724] rounded-2xl p-6 space-y-5 shadow-lg">
              <h2 className="font-display font-bold text-lg text-[#EDE8DF] border-b border-[#2A2724] pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#9EB878]" />
                Delivery Sanctuary Address
              </h2>

              <div>
                <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">
                  Street Address & Building <span className="text-[#E25B32]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="E.g. 742 Evergreen Terrace, Penthouse B"
                  className={`w-full bg-[#0E0D0C] border px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none transition-colors ${
                    errors.street ? 'border-red-500' : 'border-[#2A2724] focus:border-[#E25B32]'
                  }`}
                />
                {errors.street && <p className="text-[10px] text-red-400 font-mono mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#0E0D0C] border border-[#2A2724] px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-[#0E0D0C] border border-[#2A2724] px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-1">
                  Driver Delivery Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="E.g. Ring doorbell at gate, leave package on concierge desk..."
                  className="w-full bg-[#0E0D0C] border border-[#2A2724] px-3.5 py-2.5 rounded-xl text-xs text-[#EDE8DF] placeholder-[#EDE8DF]/30 focus:outline-none focus:border-[#E25B32] transition-colors resize-none"
                />
              </div>
            </div>

            {/* 3. Payment Method Selection (Segmented Control) */}
            <div className="bg-[#161513] border border-[#2A2724] rounded-2xl p-6 space-y-4 shadow-lg">
              <h2 className="font-display font-bold text-lg text-[#EDE8DF] border-b border-[#2A2724] pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E25B32]" />
                Payment Method Selection
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / Instant Pay', icon: QrCode, desc: 'Instant QR & VPA Transfer' },
                  { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, Amex' },
                  { id: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay Courier on Arrival' }
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                        isSelected
                          ? 'bg-[#E25B32]/10 border-[#E25B32] shadow-[0_0_15px_rgba(226,91,50,0.2)]'
                          : 'bg-[#0E0D0C] border-[#2A2724] hover:border-[#2A2724]/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#E25B32]' : 'text-[#EDE8DF]/40'}`} />
                        {isSelected && <Check className="w-4 h-4 text-[#E25B32]" />}
                      </div>
                      <div>
                        <span className="block text-xs font-mono font-bold text-[#EDE8DF]">{method.label}</span>
                        <span className="text-[10px] font-mono text-[#EDE8DF]/50">{method.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Review & Transmit Action */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-[#161513] border border-[#2A2724] rounded-2xl p-6 shadow-2xl space-y-5">
              <h2 className="font-display font-bold text-lg text-[#EDE8DF] border-b border-[#2A2724] pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-mono text-[#9EB878]">({items.length} items)</span>
              </h2>

              {/* Itemized Thumbnails List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item._id || item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#2A2724]"
                      />
                      <div>
                        <h4 className="font-display font-bold text-[#EDE8DF] line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-mono text-[#EDE8DF]/50">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#E25B32]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Courier Tip Selection */}
              <div className="pt-3 border-t border-[#2A2724]/60">
                <label className="block text-xs font-mono text-[#EDE8DF]/70 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Courier Gratitude Tip
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 3, 5, 10].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                        tip === amount
                          ? 'bg-[#9EB878] text-[#0E0D0C] font-bold border-[#9EB878]'
                          : 'bg-[#0E0D0C] border-[#2A2724] text-[#EDE8DF]/70 hover:text-white'
                      }`}
                    >
                      {amount === 0 ? 'None' : `$${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#2A2724] text-xs font-mono">
                <div className="flex justify-between text-[#EDE8DF]/70">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#EDE8DF]/70">
                  <span>Courier Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-[#9EB878]">FREE</strong> : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-[#EDE8DF]/70">
                  <span>Service Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#EDE8DF]/70">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {tip > 0 && (
                  <div className="flex justify-between text-[#9EB878]">
                    <span>Courier Tip</span>
                    <span>${tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#EDE8DF] pt-3 border-t border-[#2A2724]">
                  <span>Grand Total</span>
                  <span className="text-[#E25B32] font-mono text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E25B32] to-[#c74c26] text-white font-mono font-bold text-sm uppercase tracking-wider shadow-[0_4px_25px_rgba(226,91,50,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Order...</span>
                  </>
                ) : (
                  <span>Confirm & Transmit Order • ${grandTotal.toFixed(2)}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
