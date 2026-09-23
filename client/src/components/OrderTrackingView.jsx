import React from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function OrderTrackingView() {
  const { activeOrder, setActiveView, isAuthenticated, openAuthModal } = useCraveStore();

  // If user is not authenticated or has no active order, render an elegant empty state
  if (!isAuthenticated || !activeOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center select-none">
        <div className="w-20 h-20 rounded-full bg-crave-flameLight flex items-center justify-center text-crave-flame mb-4 shadow-sm border border-crave-flame/20">
          <span className="material-symbols-outlined text-[40px]">two_wheeler</span>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-bold text-crave-espresso mb-2">
          No Active Orders Right Now
        </h2>

        <p className="font-body text-xs md:text-sm text-crave-sand max-w-md mb-6 leading-relaxed">
          {!isAuthenticated
            ? 'Please sign in to view your active order live tracking and past royal dining history.'
            : 'Explore our artisanal kitchens, select your favorite Awadhi or Tandoori delicacies, and place your order to track live kitchen preparation!'}
        </p>

        {!isAuthenticated ? (
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 h-12 rounded-xl bg-crave-flame text-white font-body text-xs font-bold hover:bg-crave-flameDark transition-all shadow-lg flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>Sign In to Track Orders</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveView('explore')}
            className="px-6 h-12 rounded-xl bg-crave-flame text-white font-body text-xs font-bold hover:bg-crave-flameDark transition-all shadow-lg flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            <span>Explore Royal Kitchens</span>
          </button>
        )}
      </div>
    );
  }

  const order = activeOrder;

  const steps = [
    { id: 1, title: 'Order Confirmed', time: '8:14 PM', note: 'Restaurant has accepted your order', done: true },
    { id: 2, title: 'Preparing Food', time: 'Cooking Now', note: 'Chef is preparing your hot meal', active: true },
    { id: 3, title: 'Rider Assigned', time: 'Assigned', note: `${order.valet?.name || 'Rider'} (${order.valet?.rating || '4.9'}★) waiting at restaurant`, done: false },
    { id: 4, title: 'Food Delivered', time: `Est. ${order.expectedTime || '30 mins'}`, note: 'At your selected address', done: false }
  ];

  return (
    <div className="flex flex-col w-full relative pt-4 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full space-y-6">
        
        {/* Top Red Banner Box */}
        <div className="rounded-3xl bg-crave-flame text-white p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md font-mono text-xs font-bold text-white">
                ✓ Confirmed & In-Kitchen
              </span>
              <span className="font-mono text-xs text-white/90">Order #{order.id}</span>
            </div>

            <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-white">
              Order Placed Successfully! 🎉
            </h1>

            <p className="font-body text-xs md:text-sm text-white/90">
              {order.restaurantName || 'Grand Maratha Pavilion'} is preparing your delicious order.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/30 text-center shrink-0 w-full sm:w-auto">
            <div className="font-mono text-[11px] uppercase tracking-widest text-white font-extrabold">ESTIMATED DELIVERY TIME</div>
            <div className="font-serif text-3xl text-white font-extrabold my-0.5">{order.eta || '25-30 mins'}</div>
            <div className="font-mono text-xs text-white/90">Expected at {order.expectedTime || '8:45 PM'}</div>
          </div>
        </div>

        {/* Live Preparation & Journey Timeline */}
        <div className="p-5 rounded-2xl bg-white border border-crave-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-crave-border pb-2">
            <h2 className="font-serif text-lg font-bold text-crave-espresso">Live Order Tracking</h2>
            <div className="flex items-center gap-1 font-mono text-xs text-crave-wasabi font-bold">
              <span className="w-2 h-2 rounded-full bg-crave-wasabi animate-ping"></span>
              <span>Live Status</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition-all ${
                  s.active
                    ? 'bg-crave-flameLight border-crave-flame ring-1 ring-crave-flame/30 shadow-sm'
                    : s.done
                    ? 'bg-white border-crave-wasabi/40'
                    : 'bg-white border-crave-border opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    s.done
                      ? 'bg-crave-wasabi text-white'
                      : s.active
                      ? 'bg-crave-flame text-white'
                      : 'bg-crave-creamLow text-crave-sand'
                  }`}>
                    {s.done ? '✓' : s.id}
                  </div>
                  <span className={`font-mono text-[11px] font-semibold ${s.active ? 'text-crave-flame' : 'text-crave-sand'}`}>
                    {s.time}
                  </span>
                </div>

                <h3 className="font-serif text-sm font-bold text-crave-espresso">
                  {s.title}
                </h3>
                <p className="font-body text-xs text-crave-sand mt-0.5">
                  {s.note}
                </p>
              </div>
            ))}
          </div>

          {/* Valet Card & Live Map Component */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Valet Details Card */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-crave-creamLow border border-crave-border space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt={order.valet?.name || 'Rider'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-crave-flame"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-sm font-bold text-crave-espresso">{order.valet?.name || 'Rajesh Kumar'}</span>
                    <span className="px-1.5 py-0.5 rounded bg-crave-wasabiBg text-crave-wasabi font-mono text-[10px] font-bold">
                      ★ {order.valet?.rating || 4.9}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-crave-sand">{order.valet?.deliveries || '2,420+ safe deliveries'}</p>
                  <div className="flex items-center gap-1 text-crave-wasabi font-mono text-[10px] pt-0.5">
                    <span className="material-symbols-outlined text-[12px]">thermostat</span>
                    <span>{order.valet?.tempCheck || '98.4°F Checked'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 font-body text-xs">
                <a
                  href={`tel:${order.valet?.phone || '+919876543210'}`}
                  className="h-9 rounded-xl bg-white border border-crave-border flex items-center justify-center gap-1 font-bold text-crave-espresso hover:bg-crave-creamLow transition-colors"
                >
                  <span className="material-symbols-outlined text-crave-flame text-[16px]">call</span>
                  <span>Call Rider</span>
                </a>
                <button
                  type="button"
                  className="h-9 rounded-xl bg-white border border-crave-border flex items-center justify-center gap-1 font-bold text-crave-espresso hover:bg-crave-creamLow transition-colors"
                >
                  <span className="material-symbols-outlined text-crave-flame text-[16px]">chat</span>
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Map Visual Component */}
            <div className="md:col-span-7 h-44 rounded-2xl bg-crave-creamLow relative overflow-hidden border border-crave-border shadow-inner flex flex-col justify-between p-3">
              {/* Map Canvas Background Mock */}
              <div
                className="absolute inset-0 opacity-40 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.6387,12.9716,14,0/600x200?access_token=pk.mock')`,
                  backgroundColor: '#e6ded6'
                }}
              />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md font-mono text-xs font-bold text-crave-espresso shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-crave-flame animate-pulse"></span>
                  Rider is 0.4 km away from the restaurant
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-crave-espresso text-white font-mono text-[10px]">
                  Live GPS Tracking On
                </span>
              </div>

              <div className="relative z-10 flex justify-end">
                <button
                  onClick={() => setActiveView('explore')}
                  className="px-4 h-8 rounded-xl bg-crave-flame text-white font-body text-xs font-bold hover:bg-crave-flameDark shadow-md transition-colors"
                >
                  Back to Food Feed
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Concierge Support Banner */}
        <div className="p-4 rounded-2xl bg-crave-creamLow border border-crave-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-crave-sand font-body text-xs">
            <span className="material-symbols-outlined text-crave-flame text-[18px]">support_agent</span>
            <span>Need help with your order or want to talk to customer care?</span>
          </div>

          <button className="font-body text-xs text-crave-flame hover:underline font-bold flex items-center gap-1 shrink-0">
            <span>Customer Support</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

      </div>
    </div>
  );
}
