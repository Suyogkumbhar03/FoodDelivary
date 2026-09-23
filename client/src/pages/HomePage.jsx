import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Star,
  Clock,
  Flame,
  ArrowRight,
  SlidersHorizontal,
  UtensilsCrossed,
  X,
  Award,
  ChevronRight
} from 'lucide-react';
import { getRestaurants } from '../services/api';
import RestaurantSkeleton from '../components/RestaurantSkeleton';

const CATEGORIES = [
  'All',
  'Japanese Omakase',
  'Neapolitan Pizza',
  'Plant Architecture',
  'Korean BBQ',
  'Craft Bowls',
  'Botanical Tonics'
];

export default function HomePage({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(false);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch restaurants from backend API
  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedCategory && selectedCategory !== 'All') {
        // Map category titles to backend cuisine keywords
        if (selectedCategory.includes('Japanese')) params.cuisine = 'Japanese';
        else if (selectedCategory.includes('Pizza')) params.cuisine = 'Italian';
        else if (selectedCategory.includes('Plant')) params.cuisine = 'Plant-Based';
        else if (selectedCategory.includes('Korean')) params.cuisine = 'Korean';
        else params.search = selectedCategory;
      }

      if (selectedPrice) params.priceLevel = selectedPrice;
      if (sortBy) params.sortBy = sortBy;

      const response = await getRestaurants(params);
      let data = response.data || [];

      // Apply client-side refinements if required
      if (minRating) {
        data = data.filter((r) => r.rating >= 4.8);
      }
      if (fastDelivery) {
        data = data.filter((r) => r.deliveryTimeMinutes <= 25);
      }

      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory, minRating, fastDelivery, selectedPrice, sortBy]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] selection:bg-[#E25B32] selection:text-white relative overflow-hidden">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#E25B32]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[450px] h-[450px] bg-[#9EB878]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. HERO SECTION (Split Editorial Magazine Vibe) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Giant Typography & Live Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#161513] border border-[#2A2724] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#E25B32] animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#9EB878]">
                Editorial Epicurean Edition 2026
              </span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.04] text-[#EDE8DF]">
              CUISINE CRAFTED <br />
              FOR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDE8DF] via-[#E25B32] to-[#E25B32] italic font-serif">Senses.</span>
            </h1>

            <p className="text-[#EDE8DF]/70 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Immerse yourself in a curated digital dining journal featuring Michelin-caliber concept kitchens, artisanal wood-fired doughs, and botanical elixirs.
            </p>

            {/* Instant Search Bar Input */}
            <div className="w-full max-w-lg relative mt-2 group">
              <div className="relative flex items-center bg-[#161513] border border-[#2A2724] rounded-2xl p-1.5 focus-within:border-[#E25B32] transition-all shadow-xl">
                <Search className="w-5 h-5 text-[#EDE8DF]/40 ml-3.5 group-focus-within:text-[#E25B32] transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search kitchens, omakase, truffle burrata..."
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-[#EDE8DF] placeholder-[#EDE8DF]/40 focus:outline-none font-body"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-[#EDE8DF]/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button className="px-5 py-2.5 rounded-xl bg-[#E25B32] text-white text-xs font-mono font-medium hover:bg-[#E25B32]/90 transition-all shadow-[0_0_20px_rgba(226,91,50,0.3)] flex items-center gap-1.5 flex-shrink-0">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#EDE8DF]/60">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#9EB878]" /> Curated Concept Kitchens
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E25B32]" /> 20-35 Min Delivery
              </span>
            </div>
          </div>

          {/* Right Column: Asymmetric Multi-Layer Floating Card Stack */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Background Layer Card */}
            <div className="absolute -top-4 -left-4 w-72 h-80 rounded-3xl bg-[#161513] border border-[#2A2724] opacity-50 rotate-[-6deg] hidden sm:block pointer-events-none" />

            {/* Primary Chef Special Showcase Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-sm bg-[#161513] border border-[#2A2724] rounded-3xl p-4 shadow-2xl group hover:rotate-0 transition-all duration-500"
            >
              {/* Image Container with Vignette */}
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&q=80"
                  alt="A5 Wagyu & Black Truffle Nigiri"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161513] via-transparent to-black/30" />

                {/* Floating Rotating Badges */}
                <span className="absolute top-3 left-3 bg-[#0E0D0C]/85 backdrop-blur-md text-[#9EB878] font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#2A2724] flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#9EB878]" /> Michelin Recommended
                </span>

                <span className="absolute bottom-3 right-3 bg-[#0E0D0C]/85 backdrop-blur-md text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full border border-[#2A2724] flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 Rating
                </span>
              </div>

              {/* Dish Info */}
              <div className="p-2 space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E25B32]">
                      Today's #1 Chef Special
                    </span>
                    <h3 className="font-display font-bold text-lg text-[#EDE8DF] leading-tight">
                      A5 Wagyu & Black Truffle Nigiri
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-lg text-[#E25B32]">$38</span>
                </div>
                <p className="text-xs text-[#EDE8DF]/60 font-light italic">
                  Torched at 900°C with Japanese white oak charcoal.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY MARQUEE / PILL FILTER */}
      <section className="border-y border-[#2A2724] bg-[#161513]/60 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono transition-colors flex-shrink-0 flex items-center gap-2 ${
                    isActive ? 'text-white font-bold' : 'text-[#EDE8DF]/60 hover:text-[#EDE8DF]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[#E25B32] rounded-full shadow-[0_0_15px_rgba(226,91,50,0.4)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SEARCH & MULTI-FILTER CONTROL BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2724]">
          {/* Live Result Counter */}
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#EDE8DF] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E25B32]" />
              Curated Concept Kitchens
            </h2>
            <p className="text-xs font-mono text-[#9EB878] mt-0.5">
              Showing <strong className="text-white">{restaurants.length}</strong> active culinary destinations
            </p>
          </div>

          {/* Filter Action Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 4.5+ Rating Toggle */}
            <button
              onClick={() => setMinRating(!minRating)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                minRating
                  ? 'bg-[#E25B32]/20 border-[#E25B32] text-[#E25B32]'
                  : 'bg-[#161513] border-[#2A2724] text-[#EDE8DF]/70 hover:border-[#2A2724]/80'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>4.8+ Top Rated</span>
            </button>

            {/* Fast Delivery Toggle */}
            <button
              onClick={() => setFastDelivery(!fastDelivery)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                fastDelivery
                  ? 'bg-[#9EB878]/20 border-[#9EB878] text-[#9EB878]'
                  : 'bg-[#161513] border-[#2A2724] text-[#EDE8DF]/70 hover:border-[#2A2724]/80'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Under 25 mins</span>
            </button>

            {/* Price Bracket Selector */}
            <div className="flex items-center bg-[#161513] border border-[#2A2724] rounded-lg p-0.5">
              {['', '$', '$$', '$$$'].map((price) => (
                <button
                  key={price || 'all-price'}
                  onClick={() => setSelectedPrice(price)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    selectedPrice === price
                      ? 'bg-[#E25B32] text-white font-bold'
                      : 'text-[#EDE8DF]/50 hover:text-white'
                  }`}
                >
                  {price || 'All'}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1 bg-[#161513] border border-[#2A2724] rounded-lg px-2.5 py-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#EDE8DF]/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-mono text-[#EDE8DF] focus:outline-none cursor-pointer"
              >
                <option value="rating" className="bg-[#161513] text-[#EDE8DF]">Sort: Rating</option>
                <option value="deliveryTimeMinutes" className="bg-[#161513] text-[#EDE8DF]">Sort: Delivery Speed</option>
                <option value="minOrder" className="bg-[#161513] text-[#EDE8DF]">Sort: Min Order</option>
                <option value="name" className="bg-[#161513] text-[#EDE8DF]">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESTAURANT CARD GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RestaurantSkeleton count={4} />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20 px-4">
            <UtensilsCrossed className="w-12 h-12 text-[#EDE8DF]/30 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl text-[#EDE8DF] mb-2">
              No Kitchens Found
            </h3>
            <p className="text-xs font-mono text-[#EDE8DF]/50 max-w-sm mx-auto mb-6">
              No concept restaurants matched your current search filters. Try clearing your search query or price filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMinRating(false);
                setFastDelivery(false);
                setSelectedPrice('');
              }}
              className="px-5 py-2 rounded-full bg-[#E25B32] text-white text-xs font-mono hover:bg-[#E25B32]/90 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {restaurants.map((restaurant) => (
              <motion.div
                key={restaurant._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                onClick={() => onSelectRestaurant && onSelectRestaurant(restaurant._id || restaurant.slug)}
                className="bg-[#161513] border border-[#2A2724] rounded-2xl overflow-hidden hover:border-[#E25B32]/60 transition-all duration-300 group flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {/* Image Banner Container with Vignette Overlay */}
                <div className="relative h-48 overflow-hidden bg-[#2A2724]">
                  {restaurant.heroBannerImage ? (
                    <img
                      src={restaurant.heroBannerImage}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#EDE8DF]/30">
                      <UtensilsCrossed className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#161513] via-transparent to-black/30" />

                  {/* Overlaid Badges */}
                  <span className="absolute top-3 left-3 bg-[#0E0D0C]/80 backdrop-blur-md text-[#EDE8DF] font-mono text-xs font-medium px-2.5 py-1 rounded-md border border-[#2A2724] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#E25B32]" />
                    {restaurant.deliveryTimeMinutes} mins
                  </span>

                  <span className="absolute top-3 right-3 bg-[#0E0D0C]/80 backdrop-blur-md text-white font-mono text-xs font-bold px-2.5 py-1 rounded-md border border-[#2A2724] flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                </div>

                {/* Lower Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-[#EDE8DF] group-hover:text-[#E25B32] transition-colors leading-tight">
                      {restaurant.name}
                    </h3>

                    {/* Cuisine list separated by warm bullets */}
                    <p className="text-xs font-mono text-[#9EB878] mt-1 truncate">
                      {restaurant.cuisineType ? restaurant.cuisineType.join(' • ') : 'Artisanal Cuisine'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#2A2724]/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#EDE8DF]/60">
                      <span className="font-bold text-[#EDE8DF]">{restaurant.priceLevel || '$$'}</span>
                      <span>•</span>
                      <span>Min ${restaurant.minOrder || 20}</span>
                    </div>

                    <button className="px-3 py-1.5 rounded-lg bg-[#2A2724]/60 text-xs font-mono text-[#EDE8DF] group-hover:bg-[#E25B32] group-hover:text-white transition-all flex items-center gap-1 shadow-sm">
                      <span>View Kitchen</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
