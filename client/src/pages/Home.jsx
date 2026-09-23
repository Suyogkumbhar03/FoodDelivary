import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ChevronDown,
  Search,
  Star,
  Clock,
  Sparkles,
  Percent,
  SlidersHorizontal,
  Flame,
  Check,
  Zap,
  Leaf
} from 'lucide-react';
import { getRestaurants } from '../services/api';

// Realistic Fallback Data if API server is disconnected
const MOCK_RESTAURANTS = [
  {
    _id: 'dastarkhwan-royale',
    name: 'Dastarkhwan Royale',
    slug: 'dastarkhwan-royale',
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80',
    cuisines: ['Awadhi Biryani', 'Mughlai', 'Tandoor', 'Kebabs'],
    rating: 4.8,
    ratingCount: '5.8k+ ratings',
    deliveryTimeRange: '25-30 min',
    distanceKm: '2.4 km',
    costForTwo: '₹600 for two',
    pureVeg: false,
    isPromoted: true,
    offerTag: 'FLAT ₹120 OFF USE CRUSH120',
    address: { locality: 'Nizamuddin West', city: 'New Delhi' }
  },
  {
    _id: 'sagar-ratna-express',
    name: 'Sagar Ratna Express',
    slug: 'sagar-ratna-express',
    logo: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&q=80',
    cuisines: ['South Indian', 'Filter Coffee', 'Dosas'],
    rating: 4.7,
    ratingCount: '8.4k+ ratings',
    deliveryTimeRange: '20-25 min',
    distanceKm: '1.8 km',
    costForTwo: '₹350 for two',
    pureVeg: true,
    isPromoted: false,
    offerTag: '₹50 OFF on orders above ₹299',
    address: { locality: 'Connaught Place', city: 'New Delhi' }
  },
  {
    _id: 'punjab-grill-co',
    name: 'Punjab Grill & Co.',
    slug: 'punjab-grill-co',
    logo: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&q=80',
    cuisines: ['North Indian', 'Dal Makhani', 'Butter Chicken', 'Tandoori Breads'],
    rating: 4.9,
    ratingCount: '12k+ ratings',
    deliveryTimeRange: '30-35 min',
    distanceKm: '4.1 km',
    costForTwo: '₹750 for two',
    pureVeg: false,
    isPromoted: true,
    offerTag: 'EVERYTHING @ ₹199 OFF',
    address: { locality: 'Rajouri Garden', city: 'New Delhi' }
  },
  {
    _id: 'old-delhi-chaat-bazaar',
    name: 'Old Delhi Chaat Bazaar',
    slug: 'old-delhi-chaat-bazaar',
    logo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80',
    cuisines: ['Street Food', 'Chaat', 'Chole Bhature', 'Snacks'],
    rating: 4.6,
    ratingCount: '4.1k+ ratings',
    deliveryTimeRange: '15-20 min',
    distanceKm: '1.2 km',
    costForTwo: '₹250 for two',
    pureVeg: true,
    isPromoted: false,
    offerTag: 'FREE Delivery on First 3 Orders',
    address: { locality: 'Chandni Chowk', city: 'New Delhi' }
  },
  {
    _id: 'mithai-mawa-lab',
    name: 'Mithai & Mawa Lab',
    slug: 'mithai-mawa-lab',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=1200&q=80',
    cuisines: ['Indian Sweets', 'Mithai', 'Kulfi', 'Desserts'],
    rating: 4.9,
    ratingCount: '3.6k+ ratings',
    deliveryTimeRange: '15-20 min',
    distanceKm: '2.0 km',
    costForTwo: '₹300 for two',
    pureVeg: true,
    isPromoted: false,
    offerTag: 'Complimentary Gulab Jamun on ₹499+',
    address: { locality: 'Greater Kailash 1', city: 'New Delhi' }
  }
];

const CULINARY_CATEGORIES = [
  { id: 'All', name: 'All Concepts', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80' },
  { id: 'Biryani', name: 'Biryani Pots', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80' },
  { id: 'North Indian', name: 'North Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80' },
  { id: 'South Indian', name: 'South Indian', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200&q=80' },
  { id: 'Street Food', name: 'Chaat & Snacks', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&q=80' },
  { id: 'Desserts', name: 'Mithai & Sweets', image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=200&q=80' },
  { id: 'Tandoor', name: 'Kebabs & Tandoor', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&q=80' }
];

const SAVED_LOCATIONS = [
  { id: 'loc1', label: 'Home', address: 'Flat 402, Green Park, New Delhi - 110016' },
  { id: 'loc2', label: 'Office', address: 'Tower B, Cyber City, Gurugram - 122002' },
  { id: 'loc3', label: 'Partner Residence', address: 'M-12, Greater Kailash 1, New Delhi - 110048' }
];

export default function Home({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  // Location Dropdown State
  const [currentLocation, setCurrentLocation] = useState(SAVED_LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getRestaurants({
          search: searchTerm || undefined,
          vegOnly: vegOnly || undefined,
          minRating: ratingFilter ? 4.0 : undefined,
          sortBy: sortBy === 'deliveryTime' ? 'deliveryTime' : undefined
        });

        if (res && res.data && res.data.length > 0) {
          setRestaurants(res.data);
        } else {
          setRestaurants(MOCK_RESTAURANTS);
        }
      } catch (err) {
        console.warn('API error, using mock fallback:', err);
        setRestaurants(MOCK_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchTerm, vegOnly, ratingFilter, sortBy]);

  // Frontend Filter logic
  const filteredRestaurants = restaurants.filter((r) => {
    // Category match
    if (selectedCategory !== 'All') {
      const matchCuisine = r.cuisines?.some((c) =>
        c.toLowerCase().includes(selectedCategory.toLowerCase())
      );
      if (!matchCuisine) return false;
    }

    // Fast delivery (<30 min)
    if (fastDelivery) {
      const timeNum = parseInt(r.deliveryTimeRange || '30', 10);
      if (timeNum > 25) return false;
    }

    // Offers filter
    if (offersOnly && !r.offerTag) return false;

    // Search query match
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = r.name.toLowerCase().includes(term);
      const matchCuisine = r.cuisines?.some((c) => c.toLowerCase().includes(term));
      if (!matchName && !matchCuisine) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#11100F] text-[#F7F4EE] selection:bg-[#E44A1E] selection:text-white pb-24">
      {/* 1. HEADER & LOCATION BAR */}
      <header className="bg-[#1A1816] border-b border-[#2E2A24] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Location Selector Dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-3 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#E44A1E]/15 border border-[#E44A1E]/30 flex items-center justify-center text-[#E44A1E] flex-shrink-0">
                <MapPin className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#9E9689] uppercase tracking-widest block flex items-center gap-1">
                  Deliver to Sanctuary <ChevronDown className="w-3 h-3 text-[#E44A1E]" />
                </span>
                <strong className="text-xs sm:text-sm font-mono text-[#F7F4EE] group-hover:text-[#E44A1E] transition-colors line-clamp-1">
                  {currentLocation.label} — {currentLocation.address}
                </strong>
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isLocationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-14 left-0 w-80 bg-[#1A1816] border border-[#2E2A24] rounded-2xl shadow-2xl p-3 z-50 text-xs font-mono"
                >
                  <span className="text-[10px] text-[#9E9689] uppercase tracking-wider block mb-2 px-2">
                    Select Delivery Address
                  </span>
                  {SAVED_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setCurrentLocation(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-colors flex items-center justify-between mb-1 ${
                        currentLocation.id === loc.id
                          ? 'bg-[#E44A1E]/10 border border-[#E44A1E]/40 text-[#E44A1E]'
                          : 'hover:bg-[#24211D] text-[#F7F4EE]/80'
                      }`}
                    >
                      <div>
                        <strong className="block text-xs">{loc.label}</strong>
                        <span className="text-[10px] text-[#9E9689] line-clamp-1">{loc.address}</span>
                      </div>
                      {currentLocation.id === loc.id && <Check className="w-4 h-4 text-[#E44A1E]" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9689]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for 'Biryani', 'Dal Makhani', or 'Punjab Grill'..."
              className="w-full bg-[#11100F] border border-[#2E2A24] pl-10 pr-4 py-2.5 rounded-full text-xs font-mono text-[#F7F4EE] placeholder-[#9E9689]/50 focus:outline-none focus:border-[#E44A1E] transition-colors"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-10">
        {/* HERO TITLE BANNER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2E2A24] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E44A1E]/10 border border-[#E44A1E]/30 text-[#E44A1E] text-[10px] font-mono uppercase font-bold tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5" /> High-Octane Culinary Delivery
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-[#F7F4EE] tracking-tight">
              MASALA <span className="text-[#E44A1E] italic font-serif">CRUSH.</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#9E9689] mt-2">
              Awadhi Dum Biryanis, Slow-Cooked Dal Makhanis, & Charcoal Tandoori Delicacies.
            </p>
          </div>
        </div>

        {/* 2. CULINARY MOODS MARQUEE */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#9E9689]">
            Explore Culinary Moods
          </h2>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {CULINARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 group flex-shrink-0 transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all p-0.5 relative ${
                      isSelected
                        ? 'border-[#E44A1E] shadow-[0_0_20px_rgba(228,74,30,0.5)]'
                        : 'border-[#2E2A24] group-hover:border-[#9E9689]'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <span
                    className={`text-xs font-mono font-medium transition-colors ${
                      isSelected ? 'text-[#E44A1E] font-bold' : 'text-[#9E9689] group-hover:text-[#F7F4EE]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. QUICK FILTER STICKY BAR */}
        <div className="sticky top-[73px] z-20 bg-[#11100F]/90 backdrop-blur-md py-3 border-y border-[#2E2A24]">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Pure Veg Toggle */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  vegOnly
                    ? 'bg-[#248243]/15 border-[#248243] text-[#248243] font-bold shadow-[0_0_15px_rgba(36,130,67,0.3)]'
                    : 'bg-[#1A1816] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-[#248243]" />
                <span>Pure Veg</span>
              </button>

              {/* Fast Delivery Toggle */}
              <button
                onClick={() => setFastDelivery(!fastDelivery)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  fastDelivery
                    ? 'bg-[#E44A1E]/15 border-[#E44A1E] text-[#E44A1E] font-bold shadow-[0_0_15px_rgba(228,74,30,0.3)]'
                    : 'bg-[#1A1816] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#E44A1E]" />
                <span>Fast Delivery (&lt;25m)</span>
              </button>

              {/* Rating 4.0+ Toggle */}
              <button
                onClick={() => setRatingFilter(!ratingFilter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  ratingFilter
                    ? 'bg-amber-500/15 border-amber-500 text-amber-400 font-bold'
                    : 'bg-[#1A1816] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rating 4.0+</span>
              </button>

              {/* Offers Only */}
              <button
                onClick={() => setOffersOnly(!offersOnly)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border ${
                  offersOnly
                    ? 'bg-[#C99E42]/15 border-[#C99E42] text-[#C99E42] font-bold'
                    : 'bg-[#1A1816] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-[#C99E42]" />
                <span>Offers &amp; Discounts</span>
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#9E9689] flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1A1816] border border-[#2E2A24] rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#E44A1E]"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="deliveryTime">Sort: Fast Delivery</option>
                <option value="rating">Sort: Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. RESTAURANT GRID CATALOG */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-2xl text-[#F7F4EE] tracking-tight">
              Culinary Concepts ({filteredRestaurants.length})
            </h2>
          </div>

          {loading ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-[#1A1816] border border-[#2E2A24] rounded-3xl overflow-hidden animate-pulse h-80" />
              ))}
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="bg-[#1A1816] border border-[#2E2A24] rounded-3xl p-12 text-center text-xs font-mono space-y-3">
              <Flame className="w-8 h-8 text-[#E44A1E] mx-auto" />
              <h3 className="font-display font-bold text-lg text-[#F7F4EE]">No Concepts Found</h3>
              <p className="text-[#9E9689]">Try clearing your active filters or changing your search terms.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setVegOnly(false);
                  setFastDelivery(false);
                  setRatingFilter(false);
                  setOffersOnly(false);
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-full bg-[#E44A1E] text-white text-xs font-mono uppercase font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Zomato-Inspired Restaurant Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => {
                const restId = restaurant._id || restaurant.slug;
                return (
                  <motion.div
                    key={restId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onSelectRestaurant && onSelectRestaurant(restId)}
                    className="bg-[#1A1816] border border-[#2E2A24] rounded-3xl overflow-hidden hover:border-[#E44A1E]/60 transition-all cursor-pointer group shadow-xl relative flex flex-col justify-between"
                  >
                    {/* Hero Image Container */}
                    <div className="relative h-56 overflow-hidden bg-[#24211D]">
                      <img
                        src={restaurant.coverImage}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        {restaurant.pureVeg ? (
                          <span className="bg-[#248243] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Leaf className="w-3 h-3" /> PURE VEG
                          </span>
                        ) : (
                          <span className="bg-[#1A1816]/80 backdrop-blur-md text-[#F7F4EE] text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                            AUTHENTIC KITCHEN
                          </span>
                        )}

                        {/* Delivery Time Badge */}
                        <span className="bg-[#11100F]/90 backdrop-blur-md text-[#F7F4EE] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-[#2E2A24] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#E44A1E]" />
                          {restaurant.deliveryTimeRange}
                        </span>
                      </div>

                      {/* Bottom Offer Tag Overlay */}
                      {restaurant.offerTag && (
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1 bg-[#E44A1E] text-white font-mono text-[10px] font-extrabold uppercase px-3 py-1 rounded-lg shadow-lg">
                            <Percent className="w-3 h-3" />
                            {restaurant.offerTag}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-extrabold text-xl text-[#F7F4EE] group-hover:text-[#E44A1E] transition-colors leading-tight">
                          {restaurant.name}
                        </h3>

                        {/* Cardamom Green Rating Pill */}
                        <span className="bg-[#248243] text-white text-xs font-mono font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0 shadow-md">
                          ★ {restaurant.rating?.toFixed(1)}
                        </span>
                      </div>

                      {/* Cuisines */}
                      <p className="text-xs font-mono text-[#9E9689] line-clamp-1">
                        {restaurant.cuisines?.join(' • ')}
                      </p>

                      {/* Address & Cost For Two */}
                      <div className="pt-3 border-t border-[#2E2A24] flex items-center justify-between text-xs font-mono text-[#9E9689]">
                        <span>{restaurant.costForTwo}</span>
                        <span className="text-[#F7F4EE]">{restaurant.distanceKm}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
