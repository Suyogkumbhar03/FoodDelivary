import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Leaf,
  Info,
  Sparkles
} from 'lucide-react';
import { getRestaurantById } from '../services/api';
import useCartStore from '../store/useCartStore';

// Mock detailed restaurant menu data fallback
const MOCK_RESTAURANT_DETAIL = {
  restaurant: {
    _id: 'dastarkhwan-royale',
    name: 'Dastarkhwan Royale',
    slug: 'dastarkhwan-royale',
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&q=80',
    cuisines: ['Awadhi Biryani', 'Mughlai', 'Tandoor', 'Kebabs'],
    rating: 4.8,
    ratingCount: '5.8k+ ratings',
    diningRating: 4.9,
    deliveryTimeRange: '25-30 min',
    distanceKm: '2.4 km',
    costForTwo: '₹600 for two',
    pureVeg: false,
    address: { locality: 'Nizamuddin West', city: 'New Delhi', landmark: 'Near Dargah Gate' }
  },
  groupedMenu: {
    'Biryani Pots': [
      {
        _id: 'item-1',
        name: 'Dum Handi Mutton Biryani',
        category: 'Biryani Pots',
        isVeg: false,
        isBestseller: true,
        spiceLevel: 2,
        price: 450,
        description: 'Slow-cooked layered Sella Basmati rice with succulent tender mutton marinated in Awadhi saffron & spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
        customizable: true
      },
      {
        _id: 'item-2',
        name: 'Hyderabadi Veg Dum Biryani',
        category: 'Biryani Pots',
        isVeg: true,
        isBestseller: true,
        spiceLevel: 1,
        price: 320,
        description: 'Fragrant basmati rice layered with spiced garden vegetables, fried onions, and fresh mint leaves.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
        customizable: true
      }
    ],
    'Clay Oven Tandoor': [
      {
        _id: 'item-3',
        name: 'Royal Galouti Kebab (4 Pcs)',
        category: 'Clay Oven Tandoor',
        isVeg: false,
        isBestseller: true,
        spiceLevel: 1,
        price: 380,
        description: 'Melt-in-mouth minced lamb kebabs infused with 160 secret aromatic spices served with Ulte Tawe ka Paratha.',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
        customizable: false
      },
      {
        _id: 'item-4',
        name: 'Paneer Tikka Sunheri',
        category: 'Clay Oven Tandoor',
        isVeg: true,
        isBestseller: false,
        spiceLevel: 2,
        price: 340,
        description: 'Cottage cheese cubes marinated in yellow mustard, hung curd, and roasted garlic grilled in clay oven.',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
        customizable: false
      }
    ],
    'Curries & Gravies': [
      {
        _id: 'item-5',
        name: 'Grandmother Butter Chicken',
        category: 'Curries & Gravies',
        isVeg: false,
        isBestseller: true,
        spiceLevel: 1,
        price: 420,
        description: 'Tandoori char-grilled chicken tikka simmered in a velvety plum tomato butter gravy with kasuri methi.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80',
        customizable: true
      },
      {
        _id: 'item-6',
        name: '24-Hour Slow Cooked Dal Makhani',
        category: 'Curries & Gravies',
        isVeg: true,
        isBestseller: true,
        spiceLevel: 1,
        price: 340,
        description: 'Black lentils braised overnight on low tandoor embers with white butter & farm cream.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
        customizable: false
      }
    ],
    'Breads & Naan': [
      {
        _id: 'item-7',
        name: 'Butter Garlic Naan',
        category: 'Breads & Naan',
        isVeg: true,
        isBestseller: true,
        spiceLevel: 0,
        price: 70,
        description: 'Clay oven baked refined flour bread brushed with minced garlic and melted amul butter.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
        customizable: false
      },
      {
        _id: 'item-8',
        name: 'Amritsari Stuffed Kulcha',
        category: 'Breads & Naan',
        isVeg: true,
        isBestseller: false,
        spiceLevel: 1,
        price: 95,
        description: 'Crispy layered flatbread stuffed with spiced potatoes & pomegranate seeds.',
        image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
        customizable: false
      }
    ],
    'Desserts': [
      {
        _id: 'item-9',
        name: 'Hot Kesari Gulab Jamun (2 Pcs)',
        category: 'Desserts',
        isVeg: true,
        isBestseller: true,
        spiceLevel: 0,
        price: 120,
        description: 'Soft evaporated milk solid dumplings soaked in green cardamom and rose sugar syrup.',
        image: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=600&q=80',
        customizable: false
      }
    ]
  }
};

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [vegOnly, setVegOnly] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Cart Zustand Store
  const { items: cartItems, addItem, updateQuantity, openCart, cartCount, subtotal } = useCartStore();

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setLoading(true);
        const res = await getRestaurantById(id);
        if (res && res.data) {
          setData(res.data);
          const categories = Object.keys(res.data.groupedMenu || {});
          if (categories.length > 0) setActiveCategory(categories[0]);
        } else {
          setData(MOCK_RESTAURANT_DETAIL);
          setActiveCategory('Biryani Pots');
        }
      } catch (err) {
        console.warn('API error fetching restaurant detail, using fallback:', err);
        setData(MOCK_RESTAURANT_DETAIL);
        setActiveCategory('Biryani Pots');
      } finally {
        setLoading(false);
      }
    }
    loadRestaurant();
  }, [id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#11100F] text-[#F7F4EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Flame className="w-10 h-10 text-[#E44A1E] animate-bounce" />
          <span className="text-xs font-mono text-[#9E9689] uppercase tracking-widest">
            Loading Culinary Concept...
          </span>
        </div>
      </div>
    );
  }

  const { restaurant, groupedMenu } = data;
  const categories = Object.keys(groupedMenu || {});

  const getItemQuantity = (itemId) => {
    const found = cartItems.find((i) => (i._id || i.id) === itemId);
    return found ? found.quantity : 0;
  };

  const handleScrollToCategory = (cat) => {
    setActiveCategory(cat);
    const element = document.getElementById(`category-${cat}`);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#11100F] text-[#F7F4EE] selection:bg-[#E44A1E] selection:text-white pb-32">
      {/* Back Navigation Bar */}
      <div className="bg-[#1A1816] border-b border-[#2E2A24] px-4 sm:px-8 py-3 sticky top-0 z-30 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-mono text-[#9E9689] hover:text-[#F7F4EE] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#E44A1E]" />
          <span>Back to All Concepts</span>
        </button>

        <span className="text-xs font-mono text-[#E44A1E] font-bold uppercase tracking-wider hidden sm:inline">
          {restaurant.name}
        </span>
      </div>

      {/* 1. RESTAURANT INFO HEADER SHOWCASE */}
      <div className="relative bg-[#1A1816] border-b border-[#2E2A24]">
        <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-[#24211D]">
          <img
            src={restaurant.coverImage}
            alt={restaurant.name}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-[#1A1816]/40 to-transparent" />
        </div>

        {/* Info Overlay Box */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-24 relative z-10 pb-8">
          <div className="bg-[#1A1816] border border-[#2E2A24] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2E2A24] pb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#248243]/15 border border-[#248243]/40 text-[#248243] text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#248243] animate-ping" /> OPEN NOW • 11:00 AM - 11:30 PM
                  </span>
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F7F4EE] tracking-tight">
                  {restaurant.name}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#9E9689] mt-2">
                  {restaurant.cuisines?.join(' • ')}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-[#9E9689] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E44A1E]" />
                  <span>{restaurant.address?.locality}, {restaurant.address?.city}</span>
                </div>
              </div>

              {/* Dual Rating Breakdown & Hygiene Badge */}
              <div className="flex flex-row md:flex-col items-end gap-3 flex-shrink-0">
                <div className="flex items-center gap-3 bg-[#24211D] border border-[#2E2A24] px-4 py-2 rounded-2xl">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#9E9689] uppercase block">Delivery Rating</span>
                    <strong className="text-xs font-mono text-[#F7F4EE]">{restaurant.ratingCount}</strong>
                  </div>
                  <span className="bg-[#248243] text-white text-sm font-mono font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                    ★ {restaurant.rating}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#248243] bg-[#248243]/10 px-3 py-1 rounded-full border border-[#248243]/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Safety Verified Kitchen</span>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-[#9E9689]">
              <div>
                <span className="text-[10px] uppercase block text-[#9E9689]">Delivery Time</span>
                <strong className="text-sm text-[#F7F4EE] flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#E44A1E]" /> {restaurant.deliveryTimeRange}
                </strong>
              </div>
              <div>
                <span className="text-[10px] uppercase block text-[#9E9689]">Distance</span>
                <strong className="text-sm text-[#F7F4EE] mt-0.5 block">{restaurant.distanceKm}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase block text-[#9E9689]">Cost for Two</span>
                <strong className="text-sm text-[#F7F4EE] mt-0.5 block">{restaurant.costForTwo}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase block text-[#9E9689]">Special Offer</span>
                <strong className="text-sm text-[#E44A1E] font-bold mt-0.5 block">FLAT ₹120 OFF</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. IN-MENU SEARCH & VEG-ONLY CONTROL BAR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-8">
        <div className="bg-[#1A1816] border border-[#2E2A24] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Authentic Veg Only Switch */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
              vegOnly
                ? 'bg-[#248243]/15 border-[#248243] text-[#248243] shadow-[0_0_15px_rgba(36,130,67,0.3)]'
                : 'bg-[#24211D] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
            }`}
          >
            {/* Iconic Green Veg Box */}
            <div className="w-5 h-5 border-2 border-[#248243] rounded flex items-center justify-center p-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#248243]" />
            </div>
            <span>VEG ONLY FILTER</span>
            <span
              className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors ${
                vegOnly ? 'bg-[#248243] justify-end' : 'bg-[#2E2A24] justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
            </span>
          </button>

          {/* In-Menu Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9689]" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search dishes inside menu..."
              className="w-full bg-[#11100F] border border-[#2E2A24] pl-9 pr-4 py-2 rounded-xl text-xs font-mono text-[#F7F4EE] placeholder-[#9E9689]/60 focus:outline-none focus:border-[#E44A1E]"
            />
          </div>
        </div>
      </div>

      {/* 3. STICKY CATEGORY NAVIGATION TAB BAR */}
      <div className="sticky top-[57px] z-20 bg-[#11100F]/90 backdrop-blur-md border-y border-[#2E2A24] my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center gap-3 overflow-x-auto no-scrollbar py-3">
          {categories.map((cat) => {
            const itemsInCat = groupedMenu[cat] || [];
            const isCurrent = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleScrollToCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-[#E44A1E] text-white border-[#E44A1E] font-bold shadow-[0_0_15px_rgba(228,74,30,0.4)]'
                    : 'bg-[#1A1816] border-[#2E2A24] text-[#9E9689] hover:text-[#F7F4EE]'
                }`}
              >
                <span>{cat}</span>
                <span className="opacity-70 text-[10px]">({itemsInCat.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. DISH CATEGORIES & AUTHENTIC DISH CARDS LAYOUT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        {categories.map((cat) => {
          let items = groupedMenu[cat] || [];

          // Apply Veg filter
          if (vegOnly) {
            items = items.filter((item) => item.isVeg);
          }

          // Apply menu search
          if (menuSearch.trim()) {
            const query = menuSearch.toLowerCase();
            items = items.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query))
            );
          }

          if (items.length === 0) return null;

          return (
            <section id={`category-${cat}`} key={cat} className="space-y-6 scroll-mt-36">
              <div className="flex items-center gap-3 border-b border-[#2E2A24] pb-3">
                <h2 className="font-display font-extrabold text-2xl text-[#F7F4EE] tracking-tight">
                  {cat}
                </h2>
                <span className="text-xs font-mono text-[#9E9689]">({items.length} Items)</span>
              </div>

              {/* Dish Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {items.map((dish) => {
                    const dishId = dish._id || dish.id || dish.name;
                    const qty = getItemQuantity(dishId);

                    return (
                      <motion.div
                        key={dishId}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[#1A1816] border border-[#2E2A24] rounded-3xl p-5 flex items-start justify-between gap-4 hover:border-[#E44A1E]/50 transition-all shadow-lg group relative"
                      >
                        {/* LEFT COLUMN: Metadata & Description */}
                        <div className="space-y-2 flex-1">
                          {/* Veg/Non-Veg Icon & Badges */}
                          <div className="flex items-center gap-2">
                            {dish.isVeg ? (
                              /* Veg Icon: Green square with green dot */
                              <div className="w-4 h-4 border-2 border-[#248243] rounded flex items-center justify-center p-0.5 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-[#248243]" />
                              </div>
                            ) : (
                              /* Non-Veg Icon: Dark red square with red dot */
                              <div className="w-4 h-4 border-2 border-[#D32F2F] rounded flex items-center justify-center p-0.5 flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
                              </div>
                            )}

                            {dish.isBestseller && (
                              <span className="bg-[#C99E42]/15 border border-[#C99E42]/40 text-[#C99E42] text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> BESTSELLER
                              </span>
                            )}

                            {dish.spiceLevel > 0 && (
                              <span className="text-[10px] text-[#E44A1E] font-mono flex items-center">
                                {'🌶️'.repeat(dish.spiceLevel)}
                              </span>
                            )}
                          </div>

                          {/* Dish Name */}
                          <h3 className="font-display font-bold text-lg text-[#F7F4EE] group-hover:text-[#E44A1E] transition-colors leading-tight">
                            {dish.name}
                          </h3>

                          {/* Price in INR */}
                          <div className="text-base font-mono font-bold text-[#F7F4EE]">
                            ₹{dish.price}
                          </div>

                          {/* Description */}
                          <p className="text-xs font-mono text-[#9E9689] line-clamp-2 leading-relaxed">
                            {dish.description}
                          </p>
                        </div>

                        {/* RIGHT COLUMN: Thumbnail & Morphing ADD Button */}
                        <div className="flex flex-col items-center flex-shrink-0 relative">
                          <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#24211D] border border-[#2E2A24]">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Morphing Floating Action Button */}
                          <div className="-mt-4 z-10">
                            {qty === 0 ? (
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => addItem(dish)}
                                className="px-5 py-1.5 rounded-xl bg-[#1A1816] border-2 border-[#E44A1E] text-[#E44A1E] font-mono font-bold text-xs uppercase shadow-xl hover:bg-[#E44A1E] hover:text-white transition-all flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> ADD
                              </motion.button>
                            ) : (
                              /* Interactive Counter [ - qty + ] */
                              <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-[#E44A1E] text-white px-3 py-1 rounded-xl flex items-center gap-3 font-mono font-bold text-xs shadow-xl border border-white/20"
                              >
                                <button
                                  onClick={() => updateQuantity(dish._id || dish.id, -1)}
                                  className="hover:scale-125 transition-transform"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span>{qty}</span>
                                <button
                                  onClick={() => addItem(dish)}
                                  className="hover:scale-125 transition-transform"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
      </main>

      {/* 5. FLOATING MINI-CART BAR */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-50"
          >
            <button
              onClick={openCart}
              className="w-full bg-[#E44A1E] hover:bg-[#CB3C14] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between font-mono border border-white/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase block tracking-wider opacity-80">
                    {cartCount} {cartCount === 1 ? 'Item' : 'Items'} Added
                  </span>
                  <strong className="text-sm font-extrabold">₹{subtotal.toFixed(2)}</strong>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                <span>View Cart</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
