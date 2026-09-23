import React, { useState } from 'react';
import { useCraveStore } from '../store/useCraveStore';
import { DISHES } from '../data/mockData';

export default function RestaurantDetailView() {
  const {
    currentRestaurant,
    cart,
    addToCart,
    updateCartQty,
    getCartCount,
    getCartTotal,
    toggleCartDrawer,
    vegOnly,
    toggleVegOnly
  } = useCraveStore();

  const [activeCategory, setActiveCategory] = useState('Recommended');
  const [menuSearch, setMenuSearch] = useState('');

  const restaurant = currentRestaurant || {
    name: 'Dastarkhwan Awadhi Kitchen',
    rating: 4.6,
    reviewsCount: '1,848+',
    cuisines: ['Awadhi', 'Mughlai', 'Dum Biryani', 'Charcoal Kebabs'],
    address: '100ft Road, Near 12th Main Junction, Indiranagar, Bengaluru',
    promoCode: 'CRUSH100',
    fssaiLic: '#11223344005566 (Hygiene Gold)',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdu_CyM3yycFcnw3uh1AEh8EG-VhnWQ3y94J9uFHSwKpdsISSnLbQ2xzu705jXoAS3fX9R7tnWnAnmtOFyT406hUthdvTtdOEuOKT-K-jBALjUzSPGpA95YNjD6_Lq4zvUqmQUwkL_h_S336OaWJEpDNlpR-T-o_otI5Ni6VvU_L-N88u6vFoEaJuASS3nVqHl3VtzVu4Fj5Qk9Z8p9tYPyfHVKWC4dVjVvw9Q37ZM8TVKbq03ZUQG'
  };

  const categories = [
    { name: 'Recommended', icon: 'star', count: 6 },
    { name: 'Clay Oven Starters', icon: 'local_fire_department', count: 8 },
    { name: 'Royal Handi Gravies', icon: 'soup_kitchen', count: 12 },
    { name: 'Tandoori Breads', icon: 'bakery_dining', count: 5 }
  ];

  const filteredDishes = DISHES.filter((dish) => {
    if (vegOnly && !dish.veg) return false;
    if (menuSearch && !dish.name.toLowerCase().includes(menuSearch.toLowerCase())) return false;
    return true;
  });

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const getItemQty = (dishId) => {
    const item = cart.find((i) => i.id === dishId);
    return item ? item.qty : 0;
  };

  return (
    <div className="flex flex-col w-full relative pb-28">
      {/* Top Banner Cover Photo */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-crave-espresso">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-black/30 to-black/20" />
      </div>

      {/* Main Container */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 -mt-32 md:-mt-40 relative z-10 w-full">
        
        {/* Restaurant Header Details Card */}
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-crave-border space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            
            {/* Title & Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold text-crave-espresso">
                  {restaurant.name}
                </h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-crave-wasabi text-white font-mono text-xs font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {restaurant.rating} ({restaurant.reviewsCount})
                </span>
              </div>

              <p className="font-body text-xs font-semibold text-crave-flame">
                {restaurant.cuisines?.join(' • ')}
              </p>

              <div className="flex items-center gap-1 font-body text-xs text-crave-sand pt-0.5">
                <span className="material-symbols-outlined text-[16px] text-crave-sand">location_on</span>
                <span>{restaurant.address}</span>
              </div>
            </div>

            {/* Quick Stats Right Box */}
            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-crave-creamLow border border-crave-border">
                <span className="material-symbols-outlined text-crave-flame text-[20px]">timer</span>
                <div>
                  <div className="font-mono text-xs font-bold text-crave-espresso">25-30 mins</div>
                  <div className="font-body text-[10px] text-crave-sand">Live Dum Prep</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-crave-creamLow border border-crave-border">
                <span className="material-symbols-outlined text-crave-wasabi text-[20px]">payments</span>
                <div>
                  <div className="font-mono text-xs font-bold text-crave-espresso">₹450 for two</div>
                  <div className="font-body text-[10px] text-crave-sand">Average Spend</div>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Strip */}
          <div className="pt-3 border-t border-crave-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-body">
            <div className="flex items-center gap-2 text-crave-flame font-medium">
              <span className="material-symbols-outlined text-[16px]">local_offer</span>
              <span>Use code <strong className="font-mono text-crave-flame font-bold">{restaurant.promoCode}</strong> for ₹100 off on royal orders above ₹399</span>
            </div>

            <div className="flex items-center gap-1 text-crave-sand font-mono text-[11px]">
              <span className="material-symbols-outlined text-crave-wasabi text-[16px]">verified</span>
              <span>FSSAI Lic. {restaurant.fssaiLic}</span>
            </div>
          </div>
        </div>

        {/* Sticky Category Tabs Bar */}
        <div className="sticky top-28 z-30 my-6 py-2 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-crave-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full font-body text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-crave-flame text-white font-bold shadow-md'
                      : 'bg-white text-crave-espresso hover:bg-crave-creamLow border border-crave-border'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span>{cat.name} ({cat.count})</span>
                </button>
              );
            })}
          </div>

          {/* Menu Search & Veg Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 md:w-56">
              <span className="material-symbols-outlined absolute left-3 top-2 text-crave-sand text-[16px]">search</span>
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search in menu..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-white text-crave-espresso text-xs placeholder:text-crave-sand border border-crave-border focus:outline-none focus:ring-2 focus:ring-crave-flame/30"
              />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-crave-creamLow border border-crave-border shrink-0">
              <span className="font-body text-xs font-semibold text-crave-espresso">Veg Only</span>
              <button
                type="button"
                onClick={toggleVegOnly}
                className={`w-6 h-3.5 rounded-full relative p-0.5 transition-colors ${
                  vegOnly ? 'bg-crave-wasabi' : 'bg-crave-sand/40'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    vegOnly ? 'translate-x-2.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Dish Grid Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-crave-border/50 pb-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-crave-flame font-bold">
                CUSTOMER BESTSELLERS
              </span>
              <h2 className="font-serif text-xl font-bold text-crave-espresso">
                {activeCategory} Specials
              </h2>
            </div>
            <span className="font-mono text-xs text-crave-sand">
              {filteredDishes.length} Items Available
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredDishes.map((dish) => {
              const qty = getItemQty(dish.id);
              return (
                <div
                  key={dish.id}
                  className="rounded-2xl bg-white p-4 border border-crave-border shadow-sm hover:shadow-md transition-shadow flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {/* Veg / Non Veg Marker */}
                      <div className={`w-3.5 h-3.5 rounded-[2px] border-2 flex items-center justify-center p-[2px] ${dish.veg ? 'border-crave-wasabi' : 'border-crave-flame'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${dish.veg ? 'bg-crave-wasabi' : 'bg-crave-flame'}`} />
                      </div>

                      {dish.tag && (
                        <span className="px-2 py-0.5 rounded-md bg-crave-flameLight text-crave-flame font-mono text-[9px] font-bold uppercase tracking-wider">
                          {dish.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-base font-bold text-crave-espresso">
                      {dish.name}
                    </h3>

                    <div className="font-mono text-sm font-bold text-crave-espresso">
                      ₹{dish.price}
                    </div>

                    <p className="font-body text-xs text-crave-sand line-clamp-2">
                      {dish.description}
                    </p>
                  </div>

                  {/* Dish Image & Add Quantity Controller */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover shadow-inner"
                    />

                    <div className="absolute -bottom-3 flex flex-col items-center">
                      {qty > 0 ? (
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-crave-flame text-white font-mono text-xs font-bold shadow-md">
                          <button
                            onClick={() => updateCartQty(dish.id, -1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-crave-flameDark rounded text-sm"
                          >
                            -
                          </button>
                          <span>{qty}</span>
                          <button
                            onClick={() => updateCartQty(dish.id, 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-crave-flameDark rounded text-sm"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(dish)}
                          className="px-5 py-1.5 rounded-xl bg-white border-2 border-crave-flame text-crave-flame font-body text-xs font-extrabold shadow-md hover:bg-crave-flame hover:text-white transition-colors flex items-center gap-1"
                        >
                          <span>+ ADD</span>
                        </button>
                      )}
                      <span className="font-body text-[9px] text-crave-sand mt-1">Customizable</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[92%] max-w-[1240px]">
          <div className="rounded-2xl bg-crave-espresso text-white p-4 shadow-2xl flex items-center justify-between border border-crave-borderDark">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-crave-wasabi flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-crave-wasabiBg">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in your bag • ₹{cartTotal}
                </div>
                <div className="font-body text-xs text-crave-sand">
                  From: {restaurant.name}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleCartDrawer(true)}
              className="px-6 h-11 rounded-xl bg-crave-flame text-white font-body text-xs font-bold hover:bg-crave-flameDark transition-all shadow-lg flex items-center gap-2 active:scale-95"
            >
              <span>View Bill & Pay →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
