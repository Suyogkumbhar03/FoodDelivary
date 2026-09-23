import React from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function CartDrawer() {
  const {
    isCartDrawerOpen,
    toggleCartDrawer,
    cart,
    updateCartQty,
    clearCart,
    getCartTotal,
    currentRestaurant,
    setActiveView,
    addToCart,
    isAuthenticated,
    openAuthModal
  } = useCraveStore();

  if (!isCartDrawerOpen) return null;

  const rawTotal = getCartTotal();
  const packaging = 25;
  const tip = 30;
  const gst = 34;
  const discount = 138;
  const finalTotal = Math.max(0, rawTotal + packaging + tip + gst - discount);

  const handleProceedToCheckout = () => {
    toggleCartDrawer(false);
    if (!isAuthenticated) {
      openAuthModal('login', () => setActiveView('checkout'));
      return;
    }
    setActiveView('checkout');
  };

  const addOns = [
    { id: 'addon-1', name: 'Artisan Butter Garlic Naan', price: 65, veg: true },
    { id: 'addon-2', name: 'Mint & Burani Chutney', price: 35, veg: true }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-crave-espresso/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-crave-border animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-crave-border bg-crave-flameLight flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-crave-espresso">Your Food Bill</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-xs font-bold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="font-body text-xs text-crave-sand mt-0.5">
              🏪 {currentRestaurant?.name || 'Grand Maratha Pavilion'} • ⏱️ Delivering in 30-35 mins
            </p>
          </div>

          <button
            onClick={() => toggleCartDrawer(false)}
            className="w-8 h-8 rounded-full bg-white hover:bg-crave-creamLow flex items-center justify-center text-crave-espresso border border-crave-border transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Selected Specialties Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-crave-flame font-bold">
                ORDERED ITEMS
              </span>
              <button
                onClick={clearCart}
                className="font-body text-xs text-crave-sand hover:text-crave-flame underline"
              >
                Clear all
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <span className="material-symbols-outlined text-4xl text-crave-sand">shopping_basket</span>
                <p className="font-serif text-sm font-bold text-crave-espresso">Your food bag is currently empty.</p>
                <p className="font-body text-xs text-crave-sand">Add delicious items from the menu to proceed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-crave-creamLow border border-crave-border space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded-[2px] border-2 flex items-center justify-center p-[2px] ${item.veg ? 'border-crave-wasabi' : 'border-crave-flame'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.veg ? 'bg-crave-wasabi' : 'bg-crave-flame'}`} />
                        </div>
                        <h4 className="font-serif text-sm font-bold text-crave-espresso">
                          {item.name}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-crave-espresso">
                        ₹{item.price * item.qty}
                      </span>
                    </div>

                    {item.customization && (
                      <p className="font-body text-[11px] text-crave-flame font-medium bg-crave-flameLight px-2 py-1 rounded-lg">
                        🌶️ {item.customization}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1 font-body text-xs text-crave-sand">
                      <span>Quantity</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-crave-border font-mono text-xs font-bold shadow-sm">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-4 h-4 flex items-center justify-center text-crave-espresso hover:text-crave-flame"
                        >
                          -
                        </button>
                        <span className="text-crave-espresso">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-4 h-4 flex items-center justify-center text-crave-espresso hover:text-crave-flame"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Frequently Ordered Together */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-crave-sand font-bold">
              FREQUENTLY ORDERED TOGETHER
            </span>

            <div className="space-y-2">
              {addOns.map((addon) => (
                <div
                  key={addon.id}
                  className="p-3 rounded-2xl bg-white border border-crave-border flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-[2px] border border-crave-wasabi flex items-center justify-center p-[2px]">
                      <div className="w-1 h-1 rounded-full bg-crave-wasabi" />
                    </div>
                    <div>
                      <div className="font-serif text-xs font-bold text-crave-espresso">{addon.name}</div>
                      <div className="font-mono text-[11px] text-crave-sand">₹{addon.price}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart({ ...addon, description: 'Fresh addon' })}
                    className="px-3 py-1 rounded-xl bg-crave-flameLight text-crave-flame font-body text-xs font-bold hover:bg-crave-flame hover:text-white transition-colors"
                  >
                    + ADD
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          {cart.length > 0 && (
            <div className="p-4 rounded-2xl bg-crave-creamLow border border-crave-border space-y-2 font-body text-xs text-crave-sand">
              <div className="flex justify-between">
                <span>Food Total</span>
                <span className="font-mono text-crave-espresso">₹{rawTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Hotel Packaging Charges</span>
                <span className="font-mono text-crave-espresso">₹{packaging}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Partner Tip</span>
                <span className="font-mono text-crave-espresso">₹{tip}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Govt GST (5%)</span>
                <span className="font-mono text-crave-espresso">₹{gst}</span>
              </div>
              <div className="flex justify-between text-crave-wasabi font-bold">
                <span>Special Coupon (CRUSH100)</span>
                <span className="font-mono">-₹{discount}</span>
              </div>

              <div className="pt-2 border-t border-crave-border flex justify-between font-serif text-base font-bold text-crave-espresso">
                <span>Total to Pay</span>
                <span className="font-mono text-crave-flame">₹{finalTotal}</span>
              </div>
            </div>
          )}

        </div>

        {/* Drawer Footer CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-crave-border bg-white space-y-2">
            <button
              onClick={handleProceedToCheckout}
              className="w-full h-13 rounded-2xl bg-crave-flame text-white font-body text-sm font-bold hover:bg-crave-flameDark transition-all shadow-xl flex items-center justify-between px-5 py-3 active:scale-95"
            >
              <div className="flex flex-col text-left">
                <span>Proceed to Pay • ₹{finalTotal}</span>
                <span className="font-mono text-[10px] font-normal opacity-90">Estimated arrival in 30-35 mins</span>
              </div>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-1 font-mono text-[10px] text-crave-sand">
              <span className="material-symbols-outlined text-crave-wasabi text-[14px]">verified</span>
              <span>100% Safe Payments & FSSAI Assured Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
