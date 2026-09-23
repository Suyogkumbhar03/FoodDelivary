import React, { useState, useRef } from 'react';
import { useCraveStore } from '../store/useCraveStore';
import { CUISINES, RESTAURANTS, OUTLET_TYPES } from '../data/mockData';

export default function ExploreFeedView() {
  const [selectedOutletType, setSelectedOutletType] = useState('all');
  const {
    activeView,
    vegOnly,
    toggleVegOnly,
    searchQuery,
    selectedCuisine,
    setSelectedCuisine,
    setActiveView,
    setCurrentRestaurant
  } = useCraveStore();

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setActiveView('restaurant-detail');
  };

  const filteredRestaurants = RESTAURANTS.filter((r) => {
    if (vegOnly && !r.veg) return false;
    if (selectedOutletType !== 'all' && r.establishmentType !== selectedOutletType) return false;
    if (activeView === 'gourmet' && !r.cuisines.some((c) => c.toLowerCase().includes('awadhi') || c.toLowerCase().includes('mughlai') || c.toLowerCase().includes('handi'))) {
      return false;
    }
    if (selectedCuisine && !r.cuisines.some((c) => c.toLowerCase().includes(selectedCuisine.toLowerCase()))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisines.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchCuisine) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full relative pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full">
        
        {/* Editorial Hero Header */}
        <section className="pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-crave-flame"></span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-crave-flame font-bold">
                  {activeView === 'gourmet' ? 'ROYAL HANDI & DUM SPECIALS' : 'FAMOUS INDIAN EATERIES'}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-crave-espresso tracking-tight">
                {activeView === 'gourmet' ? 'Royal Handi & Gourmet Dining' : 'Explore Top Indian Restaurants & Outlets'}
              </h1>
              <p className="font-body text-sm md:text-base text-crave-sand max-w-2xl mt-1.5">
                Authentic Biryani, Tandoori Kebabs, South Indian Dosa & Fresh Sweets delivered hot to your doorstep.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-crave-espresso bg-crave-creamLow px-4 py-2 rounded-full border border-crave-border shrink-0 self-start md:self-auto shadow-sm">
              <span className="material-symbols-outlined text-crave-wasabi text-[18px]">verified</span>
              <span>{filteredRestaurants.length} Outlets Available</span>
            </div>
          </div>
        </section>

        {/* Signature Cuisines Carousel */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-crave-espresso">
                Top Food Moods
              </h2>
              <span className="font-mono text-[11px] text-crave-sand px-2.5 py-0.5 rounded-full bg-crave-creamLow border border-crave-border">
                Explore by Dish
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full bg-white border border-crave-border hover:bg-crave-creamLow flex items-center justify-center text-crave-espresso transition-colors"
                aria-label="Previous categories"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full bg-white border border-crave-border hover:bg-crave-creamLow flex items-center justify-center text-crave-espresso transition-colors"
                aria-label="Next categories"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-3 scroll-smooth no-scrollbar"
          >
            {CUISINES.map((cat) => {
              const isSelected = selectedCuisine === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCuisine(isSelected ? null : cat.id)}
                  className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none text-left select-none"
                >
                  <div
                    className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 transition-all duration-300 shadow-sm ${
                      isSelected
                        ? 'bg-crave-flame scale-105 shadow-md ring-4 ring-crave-flame/20'
                        : 'bg-white border border-crave-border group-hover:border-crave-flame group-hover:scale-105'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className={`font-serif text-xs font-bold text-center transition-colors ${
                    isSelected ? 'text-crave-flame' : 'text-crave-espresso group-hover:text-crave-flame'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Filter Chips Row */}
        <section className="py-3 space-y-2">
          {/* Outlet Type Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="font-mono text-[10px] uppercase font-bold text-crave-sand shrink-0 mr-1">
              What are you craving?:
            </span>
            {OUTLET_TYPES.map((type) => {
              const isActive = selectedOutletType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedOutletType(type.id)}
                  className={`shrink-0 px-3 py-1 rounded-full font-body text-xs font-semibold transition-all border select-none ${
                    isActive
                      ? 'bg-crave-flame text-white border-crave-flame font-bold shadow-sm'
                      : 'bg-white text-crave-espresso hover:bg-crave-creamLow border-crave-border'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {/* Pure Veg Filter */}
            <button
              onClick={toggleVegOnly}
              className={`shrink-0 flex items-center gap-2 px-4 h-9 rounded-full font-body text-xs font-semibold transition-all border select-none ${
                vegOnly
                  ? 'bg-crave-wasabiBg text-crave-wasabi border-crave-wasabi font-bold shadow-sm'
                  : 'bg-white text-crave-espresso hover:bg-crave-creamLow border-crave-border'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-[2px] border border-crave-wasabi flex items-center justify-center p-[2px]">
                <div className="w-1.5 h-1.5 rounded-full bg-crave-wasabi"></div>
              </div>
              <span>Pure Veg Only</span>
            </button>

            {/* Fast Delivery */}
            <button className="shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full bg-white hover:bg-crave-creamLow text-crave-espresso border border-crave-border transition-all text-xs font-body font-semibold select-none">
              <span className="material-symbols-outlined text-crave-flame text-[16px]">bolt</span>
              <span>Fast Delivery (&lt;30m)</span>
              <span className="font-mono text-[10px] text-crave-sand ml-0.5">18</span>
            </button>

            {/* Rating 4.0+ */}
            <button className="shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full bg-crave-flameLight text-crave-flame border border-crave-flame/30 font-body text-xs font-bold transition-all select-none">
              <span className="material-symbols-outlined text-crave-flame text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>Rating 4.0+</span>
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>

            {/* Offers */}
            <button className="shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full bg-white hover:bg-crave-creamLow text-crave-espresso border border-crave-border transition-all text-xs font-body font-semibold select-none">
              <span className="material-symbols-outlined text-crave-flame text-[16px]">local_offer</span>
              <span>Offers (Up to 50% OFF)</span>
            </button>
          </div>
        </section>

        {/* Popular Food Spots & Restaurants Section */}
        <section className="py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-crave-espresso">
                Top Food Spots & Restaurants
              </h2>
              <p className="font-body text-xs text-crave-sand mt-0.5">
                Top rated hotels, dhabas, and sweet shops delivered fresh & hot
              </p>
            </div>

            <div className="flex items-center gap-1 bg-crave-creamLow p-1 rounded-xl border border-crave-border shrink-0 self-start sm:self-auto">
              <button className="px-3 py-1 rounded-lg bg-white shadow-sm font-mono text-xs font-bold text-crave-flame flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">grid_view</span> Grid
              </button>
              <button className="px-3 py-1 rounded-lg hover:bg-crave-border/40 font-mono text-xs text-crave-sand flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">view_agenda</span> Compact
              </button>
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-crave-border select-none"
              >
                <div className="relative w-full h-52 overflow-hidden bg-crave-creamLow">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Top Discount Tag & Establishment Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-crave-flame text-white font-mono text-[10px] font-bold shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">local_offer</span>
                      {restaurant.offer}
                    </span>
                    {restaurant.establishmentType && (
                      <span className="px-2.5 py-1 rounded-full bg-crave-espresso/90 text-crave-creamLow backdrop-blur-md font-mono text-[10px] font-bold shadow-md">
                        {restaurant.establishmentType}
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Favorite"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-crave-espresso hover:text-crave-flame transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                  </div>

                  {/* Bottom Badges */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-crave-espresso font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-crave-flame text-[14px]">schedule</span>
                      {restaurant.time}
                    </span>
                    {restaurant.fssai && (
                      <span className="px-2 py-0.5 rounded-full bg-crave-wasabiBg text-crave-wasabi font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[12px]">verified</span>
                        {restaurant.fssai}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-serif text-base font-bold text-crave-espresso group-hover:text-crave-flame transition-colors leading-snug">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-crave-wasabi text-white font-mono text-[11px] font-bold shrink-0 shadow-sm">
                        <span>{restaurant.rating}</span>
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      </div>
                    </div>
                    <p className="font-body text-xs text-crave-sand truncate font-medium">
                      {restaurant.cuisines.join(' • ')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-crave-border/40 flex items-center justify-between font-mono text-[11px] text-crave-sand">
                    <div className="flex items-center gap-1.5">
                      <span className="text-crave-espresso font-semibold">{restaurant.costForTwo}</span>
                      <span>•</span>
                      <span>{restaurant.distance}</span>
                    </div>
                    <span className="text-crave-espresso font-medium">({restaurant.reviewsCount} ratings)</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
