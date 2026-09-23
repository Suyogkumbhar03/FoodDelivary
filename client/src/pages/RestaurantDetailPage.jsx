import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingBag,
  Truck,
  Sparkles,
  MapPin,
  Utensils,
  Plus,
  Minus,
  Check,
  Flame,
  Maximize2
} from 'lucide-react';
import { getRestaurantById } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import ImagePreviewModal from '../components/ImagePreviewModal';

// Mock fallback restaurant data if API server is booting or seeding
const MOCK_RESTAURANT = {
  _id: 'umami-lab',
  name: 'Umami Lab',
  slug: 'umami-lab',
  heroBannerImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80',
  logo: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&q=80',
  cuisineType: ['Japanese Omakase', 'Raw Bar', 'Truffle'],
  rating: 4.9,
  reviewsCount: 184,
  deliveryTimeMinutes: 30,
  minOrder: 25,
  priceLevel: '$$$',
  address: '450 Omotesando Avenue, District 1',
  isAvailable: true,
  operatingHours: '12:00 PM - 10:30 PM',
  menuItems: [
    {
      _id: 'dish_1',
      name: 'A5 Wagyu & Black Truffle Nigiri',
      category: 'Signature Cuts',
      price: 38,
      calories: 420,
      rating: 4.9,
      spicyLevel: 0,
      dietaryFlags: ['Keto'],
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&q=80',
      chefNote: 'Torched at 900°C with Japanese white oak charcoal.',
      ingredients: ['Miyazaki A5 Wagyu', 'Perigord Black Truffle', 'Koshihikari Rice', 'Aged Soy']
    },
    {
      _id: 'dish_2',
      name: 'Hokkaido Scallop Crudo',
      category: 'Signature Cuts',
      price: 29,
      calories: 280,
      rating: 4.8,
      spicyLevel: 0,
      dietaryFlags: ['Gluten-Free', 'Organic'],
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80',
      chefNote: 'Wild-caught scallops dressed with Yuzu & Pink Peppercorn.',
      ingredients: ['Hokkaido Scallops', 'Yuzu Kosho', 'Finger Lime', 'Micro Basil']
    },
    {
      _id: 'dish_3',
      name: 'Charcoal Smoked Bluefin Toro',
      category: 'Signature Cuts',
      price: 42,
      calories: 390,
      rating: 5.0,
      spicyLevel: 0,
      dietaryFlags: ['Gluten-Free'],
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
      chefNote: 'Smoked over cherrywood chips with caviar pearls.',
      ingredients: ['Bluefin Toro', 'Osetra Caviar', 'Wasabi Root']
    },
    {
      _id: 'dish_4',
      name: 'Smoked Miso Char Siu Glazed Salmon',
      category: 'Craft Bowls',
      price: 32,
      calories: 560,
      rating: 4.9,
      spicyLevel: 1,
      dietaryFlags: ['Organic'],
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
      chefNote: 'Glazed with 3-year aged white miso.',
      ingredients: ['King Salmon', 'White Miso', 'Charred Bok Choy', 'Edamame']
    },
    {
      _id: 'dish_5',
      name: 'Matcha Fondant with Gold Leaf',
      category: 'Guilty Desserts',
      price: 18,
      calories: 410,
      rating: 4.9,
      spicyLevel: 0,
      dietaryFlags: ['Organic'],
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
      chefNote: 'Warm molten matcha cake with 24k gold leaf.',
      ingredients: ['Uji Matcha', 'Valrhona White Chocolate', 'Gold Leaf']
    },
    {
      _id: 'dish_6',
      name: 'Yuzu Botanical Elixir',
      category: 'Botanical Tonics',
      price: 14,
      calories: 90,
      rating: 4.8,
      spicyLevel: 0,
      dietaryFlags: ['Vegan', 'Gluten-Free', 'Organic'],
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80',
      chefNote: 'Cold-pressed Yuzu, Sparkling Alpine Water, Elderflower.',
      ingredients: ['Yuzu Juice', 'Elderflower Tonic', 'Shiso Leaf']
    }
  ]
};

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [previewItem, setPreviewItem] = useState(null);
  const [floatingParticles, setFloatingParticles] = useState([]);

  const { items, addItem, updateQuantity, getItemQuantity } = useCartStore();

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setLoading(true);
        if (id) {
          const res = await getRestaurantById(id);
          if (res && res.data) {
            setRestaurant(res.data);
          } else {
            setRestaurant(MOCK_RESTAURANT);
          }
        } else {
          setRestaurant(MOCK_RESTAURANT);
        }
      } catch (err) {
        console.warn('Using mock restaurant fallback:', err);
        setRestaurant(MOCK_RESTAURANT);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [id]);

  // Group menu items by category
  const menuCategories = restaurant?.menuItems
    ? Array.from(new Set(restaurant.menuItems.map((item) => item.category)))
    : [];

  useEffect(() => {
    if (menuCategories.length > 0 && !activeCategory) {
      setActiveCategory(menuCategories[0]);
    }
  }, [menuCategories, activeCategory]);

  // Scroll smooth handler for sticky sub-navbar
  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const element = document.getElementById(`category-${cat}`);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Micro-interaction: Spawn floating "+1" particle animation
  const handleAddItemWithParticle = (dish, e) => {
    addItem(dish, 1);

    // Get click position for particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticle = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    };

    setFloatingParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#E25B32] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#9EB878]">Preparing Kitchen Canvas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] selection:bg-[#E25B32] selection:text-white pb-24 relative">
      {/* Floating Particle Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: p.y, x: p.x, scale: 1 }}
              animate={{ opacity: 0, y: p.y - 80, x: p.x + 15, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute font-mono font-bold text-xs text-[#E25B32] bg-[#161513] border border-[#E25B32]/40 px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(226,91,50,0.6)]"
            >
              +1 CRAVE
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. HEADER SHOWCASE (Cinematic Wide Banner) */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-[#161513]">
        {/* Banner Image */}
        <img
          src={restaurant?.heroBannerImage || MOCK_RESTAURANT.heroBannerImage}
          alt={restaurant?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0C] via-[#0E0D0C]/70 to-black/40" />

        {/* Top Back Navigation Bar */}
        <div className="absolute top-6 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E0D0C]/80 backdrop-blur-md border border-[#2A2724] text-xs font-mono text-[#EDE8DF] hover:border-[#E25B32] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kitchens</span>
          </button>
        </div>

        {/* Banner Content Details */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 z-10">
          <div className="flex items-start sm:items-center gap-4">
            {/* Restaurant Logo Thumbnail */}
            {restaurant?.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#2A2724] shadow-2xl flex-shrink-0"
              />
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {/* Operating Hours Status Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Open Now ({restaurant?.operatingHours || '12:00 PM - 10:30 PM'})
                </span>

                {/* Cuisine Tags */}
                {restaurant?.cuisineType?.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-mono text-[#9EB878] bg-[#9EB878]/10 border border-[#9EB878]/30 px-2 py-0.5 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#EDE8DF] tracking-tight">
                {restaurant?.name}
              </h1>

              <div className="flex items-center gap-2 text-xs font-mono text-[#EDE8DF]/60 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E25B32]" />
                <span>{restaurant?.address || 'District 1, Epicurean Avenue'}</span>
              </div>
            </div>
          </div>

          {/* Delivery Metrics Bar */}
          <div className="flex items-center gap-4 bg-[#161513]/80 backdrop-blur-md border border-[#2A2724] px-4 py-2.5 rounded-2xl text-xs font-mono shadow-xl">
            <div className="flex items-center gap-1.5 border-r border-[#2A2724] pr-4">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div>
                <strong className="text-white block leading-tight">{restaurant?.rating?.toFixed(1)}</strong>
                <span className="text-[10px] text-[#EDE8DF]/50">{restaurant?.reviewsCount || 120}+ reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-r border-[#2A2724] pr-4">
              <Clock className="w-4 h-4 text-[#E25B32]" />
              <div>
                <strong className="text-white block leading-tight">{restaurant?.deliveryTimeMinutes} mins</strong>
                <span className="text-[10px] text-[#EDE8DF]/50">Delivery</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#9EB878]" />
              <div>
                <strong className="text-white block leading-tight">${restaurant?.minOrder}</strong>
                <span className="text-[10px] text-[#EDE8DF]/50">Min order</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY IN-PAGE CATEGORY NAV */}
      <nav className="sticky top-[61px] z-30 bg-[#0E0D0C]/90 backdrop-blur-md border-b border-[#2A2724] py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3">
            {menuCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-[#E25B32] text-white font-bold shadow-[0_0_15px_rgba(226,91,50,0.4)]'
                      : 'bg-[#161513] text-[#EDE8DF]/60 hover:text-white border border-[#2A2724]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. MENU ITEMS DISPLAY (Grouped by Category) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
        {menuCategories.map((category) => {
          const itemsInCat = restaurant?.menuItems?.filter((item) => item.category === category) || [];
          return (
            <section key={category} id={`category-${category}`} className="space-y-6 scroll-mt-36">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2724]">
                <h2 className="font-display font-extrabold text-2xl text-[#EDE8DF] tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E25B32]" />
                  {category}
                </h2>
                <span className="text-xs font-mono text-[#9EB878]">
                  {itemsInCat.length} selections
                </span>
              </div>

              {/* 2-Column Responsive Item Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {itemsInCat.map((item) => {
                  const itemId = item._id || item.id;
                  const qty = getItemQuantity(itemId);

                  return (
                    <div
                      key={itemId}
                      className="bg-[#161513] border border-[#2A2724] rounded-2xl p-4 flex gap-4 hover:border-[#E25B32]/50 transition-all group relative shadow-lg"
                    >
                      {/* Image Thumbnail with Preview Modal Trigger */}
                      <div
                        onClick={() => setPreviewItem(item)}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#2A2724] flex-shrink-0 cursor-pointer group/img"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3
                              onClick={() => setPreviewItem(item)}
                              className="font-display font-bold text-base text-[#EDE8DF] hover:text-[#E25B32] transition-colors cursor-pointer leading-snug"
                            >
                              {item.name}
                            </h3>
                          </div>

                          {/* Dietary Badges & Spicy Rating */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {item.dietaryFlags?.map((flag) => (
                              <span
                                key={flag}
                                className="text-[9px] font-mono text-[#9EB878] bg-[#9EB878]/10 px-1.5 py-0.2 rounded"
                              >
                                {flag}
                              </span>
                            ))}
                            {item.spicyLevel > 0 && (
                              <span className="text-[9px] font-mono text-[#E25B32] bg-[#E25B32]/10 px-1.5 py-0.2 rounded">
                                🌶️
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#EDE8DF]/60 font-light mt-1.5 line-clamp-2 italic">
                            "{item.chefNote || item.ingredients?.join(', ')}"
                          </p>
                        </div>

                        {/* Price Display & Morphing Quantity Incrementer Button */}
                        <div className="mt-3 pt-2 border-t border-[#2A2724]/40 flex items-center justify-between">
                          <span className="font-mono text-base font-bold text-[#E25B32]">
                            ${item.price.toFixed(2)}
                          </span>

                          {qty === 0 ? (
                            /* Initial 'Add to Order' state */
                            <motion.button
                              whileTap={{ scale: 0.94 }}
                              onClick={(e) => handleAddItemWithParticle(item, e)}
                              className="px-4 py-2 rounded-xl bg-[#E25B32] text-white text-xs font-mono font-medium hover:bg-[#E25B32]/90 transition-all shadow-[0_0_15px_rgba(226,91,50,0.3)] flex items-center gap-1.5 min-h-[44px]"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Order</span>
                            </motion.button>
                          ) : (
                            /* Morphed [ - quantity + ] Incrementer state */
                            <div className="flex items-center gap-2 bg-[#0E0D0C] border border-[#E25B32]/60 rounded-xl p-1 shadow-md min-h-[44px]">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => updateQuantity(itemId, -1)}
                                className="w-8 h-8 rounded-lg bg-[#2A2724] flex items-center justify-center text-[#EDE8DF] hover:bg-[#E25B32] transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                              <span className="w-6 text-center font-mono font-bold text-sm text-[#EDE8DF]">
                                {qty}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => handleAddItemWithParticle(item, e)}
                                className="w-8 h-8 rounded-lg bg-[#E25B32] flex items-center justify-center text-white hover:bg-[#E25B32]/90 transition-colors shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        item={previewItem}
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}
