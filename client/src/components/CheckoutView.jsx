import React, { useState } from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function CheckoutView() {
  const {
    selectedAddress,
    toggleAddressModal,
    cart,
    getCartTotal,
    currentRestaurant,
    placeOrder,
    isAuthenticated,
    openAuthModal
  } = useCraveStore();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [upiId, setUpiId] = useState('praya@okhdfcbank');

  const rawTotal = getCartTotal();
  const packaging = 25;
  const tip = 30;
  const gst = 34;
  const discount = 138;
  const totalToPay = Math.max(0, rawTotal + packaging + tip + gst - discount);

  const handlePayAndPlace = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    placeOrder(paymentMethod.toUpperCase());
  };

  return (
    <div className="flex flex-col w-full relative pt-4 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full space-y-6">
        
        {/* Top Header & Encryption Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-crave-border pb-3">
          <div className="font-mono text-xs text-crave-sand flex items-center gap-2">
            <span>Cart</span>
            <span>/</span>
            <span>{currentRestaurant?.name || 'Dastarkhwan Awadhi Kitchen'}</span>
            <span>/</span>
            <span className="text-crave-flame font-bold">Secure Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[11px] font-bold self-start sm:self-auto">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>End-to-End 256-Bit Encrypted Dining Checkout</span>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Delivery & Receiver Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Restaurant Summary */}
            <div className="p-4 rounded-2xl bg-white border border-crave-border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-crave-creamLow shrink-0">
                  <img src={currentRestaurant?.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80'} alt="Restaurant" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-crave-flame"></span>
                    <span className="font-mono text-[10px] font-bold text-crave-flame uppercase tracking-wider">AWADHI ROYAL KITCHEN</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-crave-espresso">{currentRestaurant?.name || 'Dastarkhwan Awadhi Kitchen'}</h3>
                  <p className="font-mono text-xs text-crave-sand">{cart.length || 2} handcrafted portions in order</p>
                </div>
              </div>
            </div>

            {/* Home Delivery Address */}
            <div className="p-4 rounded-2xl bg-white border border-crave-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-crave-flame text-[20px]">home</span>
                  <span className="font-serif text-sm font-bold text-crave-espresso">Home Delivery</span>
                  <span className="px-2 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[10px] font-bold">• Default</span>
                </div>
                <button
                  onClick={() => toggleAddressModal(true)}
                  className="font-body text-xs text-crave-flame hover:underline font-bold"
                >
                  Change Address
                </button>
              </div>

              <p className="font-body text-xs text-crave-sand leading-relaxed pt-1">
                {selectedAddress?.address || 'No delivery address selected. Please add an address.'}
              </p>
              <div className="font-mono text-[11px] text-crave-sand flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-crave-flame">flag</span>
                <span>Landmark: Opposite BDA Complex, 100ft Road Junction</span>
              </div>
            </div>

            {/* Receiver & Contact */}
            <div className="p-4 rounded-2xl bg-white border border-crave-border shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-crave-flame text-[20px]">person</span>
                  <span className="font-serif text-sm font-bold text-crave-espresso">Receiver & Verification</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[10px] font-bold">✓ OTP Verified</span>
              </div>
              <div className="font-body text-sm font-bold text-crave-espresso">
                Priya Sharma <span className="font-mono text-xs text-crave-sand font-normal">+91 98765 43210</span>
              </div>
              <p className="font-mono text-[11px] text-crave-sand">
                SMS order updates and contact-free handoff codes will be transmitted to this verified mobile number.
              </p>
            </div>

            {/* Delivery Instructions */}
            <div className="p-4 rounded-2xl bg-white border border-crave-border shadow-sm space-y-2">
              <div className="flex items-center gap-2 font-serif text-sm font-bold text-crave-espresso">
                <span className="material-symbols-outlined text-crave-flame text-[20px]">sports_motorsports</span>
                <span>Delivery Instructions for Rider</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-body text-xs">
                <div className="p-2.5 rounded-xl bg-crave-creamLow border border-crave-border">
                  <div className="font-bold text-crave-espresso">🔕 Don't ring bell</div>
                  <div className="text-[10px] text-crave-sand">Silent delivery</div>
                </div>
                <div className="p-2.5 rounded-xl bg-crave-creamLow border border-crave-border">
                  <div className="font-bold text-crave-espresso">🚪 Leave with security</div>
                  <div className="text-[10px] text-crave-sand">At gate kiosk / door</div>
                </div>
                <div className="p-2.5 rounded-xl bg-crave-creamLow border border-crave-border">
                  <div className="font-bold text-crave-espresso">📞 Call before coming</div>
                  <div className="text-[10px] text-crave-sand">Rider will call</div>
                </div>
                <div className="p-2.5 rounded-xl bg-crave-creamLow border border-crave-border">
                  <div className="font-bold text-crave-espresso">🐾 Pet in house</div>
                  <div className="text-[10px] text-crave-sand">Knock gently</div>
                </div>
              </div>
            </div>

            {/* Hygiene Guarantee */}
            <div className="p-4 rounded-2xl bg-crave-flameLight border border-crave-flame/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-crave-flame text-[32px]">verified</span>
              <div>
                <div className="font-serif text-sm font-bold text-crave-espresso">100% Hygienic & Sealed Packaging</div>
                <div className="font-body text-xs text-crave-sand">
                  Food is prepared with strict hygiene checks and safety seals intact.
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Payment Method & Bill Breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Step Header */}
            <div className="p-5 rounded-2xl bg-white border border-crave-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-crave-border pb-3">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-crave-flame font-bold">STEP 2 OF 2</span>
                  <h2 className="font-serif text-xl font-bold text-crave-espresso">Select Payment Method</h2>
                </div>
                <span className="font-mono text-xs text-crave-wasabi font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span> 100% Safe Payments
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                {/* UPI Option */}
                <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'upi' ? 'bg-crave-creamLow border-crave-flame ring-1 ring-crave-flame/20' : 'bg-white border-crave-border'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="w-4 h-4 text-crave-flame focus:ring-crave-flame"
                      />
                      <div>
                        <span className="font-serif text-sm font-bold text-crave-espresso flex items-center gap-2">
                          UPI (GPay / PhonePe / Paytm / Any UPI ID)
                          <span className="px-2 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[9px] font-bold">FASTEST</span>
                        </span>
                        <span className="font-body text-xs text-crave-sand block">Pay directly using any UPI App</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-crave-sand">
                      <span className="px-1.5 py-0.5 bg-white rounded border border-crave-border">GPay</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border border-crave-border">PhonePe</span>
                      <span className="px-1.5 py-0.5 bg-white rounded border border-crave-border">Paytm</span>
                    </div>
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-4 border-t border-crave-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      {/* QR Code */}
                      <div className="p-4 rounded-2xl bg-white border border-crave-border flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=praya@okhdfcbank&pn=CRAVE&am=639&cu=INR"
                          alt="Scan UPI QR"
                          className="w-32 h-32 object-contain"
                        />
                        <span className="font-mono text-xs text-crave-espresso font-bold">Scan to pay • Instant Confirmation</span>
                      </div>

                      {/* VPA Input */}
                      <div className="space-y-3">
                        <label className="font-mono text-[10px] text-crave-sand uppercase font-bold">ENTER UPI ID (e.g. mobile@upi)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full h-10 pl-3 pr-24 rounded-xl bg-white text-crave-espresso font-mono text-xs border border-crave-border focus:outline-none focus:ring-2 focus:ring-crave-flame/30"
                          />
                          <button
                            onClick={handlePayAndPlace}
                            className="absolute right-1 top-1 h-8 px-3 rounded-lg bg-crave-flame text-white font-body text-xs font-bold hover:bg-crave-flameDark transition-colors"
                          >
                            Verify & Pay
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cards */}
                <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-crave-creamLow border-crave-flame' : 'bg-white border-crave-border'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 text-crave-flame focus:ring-crave-flame"
                      />
                      <div>
                        <span className="font-serif text-sm font-bold text-crave-espresso">ATM / Debit / Credit Cards</span>
                        <span className="font-body text-xs text-crave-sand block">Visa, MasterCard, RuPay & Maestro Cards</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-crave-sand">
                      <span className="px-1.5 py-0.5 bg-crave-creamLow rounded">RuPay</span>
                      <span className="px-1.5 py-0.5 bg-crave-creamLow rounded">VISA</span>
                      <span className="px-1.5 py-0.5 bg-crave-creamLow rounded">Master</span>
                    </div>
                  </label>
                </div>

                {/* Cash on Delivery */}
                <div className={`p-4 rounded-2xl border transition-all ${paymentMethod === 'cod' ? 'bg-crave-creamLow border-crave-flame' : 'bg-white border-crave-border'}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 text-crave-flame focus:ring-crave-flame"
                      />
                      <div>
                        <span className="font-serif text-sm font-bold text-crave-espresso">Cash on Delivery (Pay cash when food arrives)</span>
                        <span className="font-body text-xs text-crave-sand block">Pay cash or scan QR code when rider arrives</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bill Breakdown Card */}
            <div className="p-5 rounded-2xl bg-white border border-crave-border shadow-sm space-y-3 font-body text-xs">
              <div className="flex items-center justify-between border-b border-crave-border pb-2">
                <span className="font-serif text-base font-bold text-crave-espresso">Your Food Bill</span>
                <span className="font-mono text-xs text-crave-wasabi font-bold">Coupon Applied!</span>
              </div>

              <div className="space-y-1.5 text-crave-sand">
                <div className="flex justify-between">
                  <span>Food Total</span>
                  <span className="font-mono text-crave-espresso font-bold">₹{rawTotal || 688}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hotel Packaging Charges</span>
                  <span className="font-mono text-crave-espresso">₹{packaging}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Partner Tip</span>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded bg-crave-creamLow border border-crave-border font-mono text-[10px] text-crave-espresso">₹20</span>
                    <span className="px-2 py-0.5 rounded bg-crave-flameLight border border-crave-flame/30 font-mono text-[10px] text-crave-flame font-bold">₹30</span>
                    <span className="px-2 py-0.5 rounded bg-crave-creamLow border border-crave-border font-mono text-[10px] text-crave-espresso">₹50</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Govt GST (5%)</span>
                  <span className="font-mono text-crave-espresso">₹{gst}</span>
                </div>
                <div className="flex justify-between text-crave-wasabi font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">local_offer</span> Offer Coupon Discount
                  </span>
                  <span className="font-mono">-₹{discount}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-crave-border flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-crave-sand uppercase font-bold">TOTAL TO PAY VIA {paymentMethod.toUpperCase()}</div>
                  <div className="font-serif text-2xl font-bold text-crave-flame">₹{totalToPay}</div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-xs text-crave-wasabi font-bold">Total Savings ₹{discount}</div>
                  <div className="font-body text-[10px] text-crave-sand">Includes all taxes and delivery</div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handlePayAndPlace}
                className="w-full h-13 rounded-2xl bg-crave-flame text-white font-body text-base font-bold hover:bg-crave-flameDark transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Pay ₹{totalToPay} & Place Order</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <p className="font-body text-[10px] text-center text-crave-sand">
                By placing this culinary order, you agree to Crave's Terms of Royal Hospitality and Kitchen Cancellation Policies.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
