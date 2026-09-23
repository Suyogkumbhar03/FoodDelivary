import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Compass, Sparkles, ShoppingBag, Search, Clock } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Navbar({ onOpenSearch }) {
  const { openCart, getCartCount, lastAddedTimestamp } = useCartStore();
  const cartCount = getCartCount();
  const [isBouncing, setIsBouncing] = useState(false);

  // Trigger tactile bounce effect whenever items are added to cart
  useEffect(() => {
    if (lastAddedTimestamp) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp, cartCount]);

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3.5 backdrop-blur-md bg-[#0E0D0C]/80 border-b border-[#2A2724] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo with Typographic Ligature Treatment */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-[#E25B32]/15 border border-[#E25B32]/30 flex items-center justify-center text-[#E25B32] shadow-[0_0_20px_rgba(226,91,50,0.2)] group-hover:scale-105 group-hover:border-[#E25B32] transition-all">
            <Flame className="w-5 h-5 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#EDE8DF] via-[#EDE8DF] to-[#E25B32] leading-none">
              CRAVE
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#9EB878] font-mono mt-0.5">
              Editorial Epicurean
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#EDE8DF]/70">
          <a
            href="#restaurants"
            className="hover:text-[#EDE8DF] transition-colors flex items-center gap-2 group py-1"
          >
            <Compass className="w-4 h-4 text-[#9EB878] group-hover:rotate-45 transition-transform" />
            <span>Explore Restaurants</span>
          </a>
          <a
            href="#dishes"
            className="hover:text-[#EDE8DF] transition-colors flex items-center gap-2 group py-1"
          >
            <Sparkles className="w-4 h-4 text-[#E25B32] group-hover:scale-110 transition-transform" />
            <span>Signature Dishes</span>
          </a>
          <a
            href="#orders"
            className="hover:text-[#EDE8DF] transition-colors flex items-center gap-2 group py-1"
          >
            <Clock className="w-4 h-4 text-[#EDE8DF]/60 group-hover:text-[#EDE8DF] transition-colors" />
            <span>Track Order</span>
          </a>
        </nav>

        {/* Actions (Search Trigger & Animated Cart Trigger) */}
        <div className="flex items-center gap-3">
          {/* Search Trigger Button with ⌘K Badge */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 px-3.5 py-2 rounded-full bg-[#161513] border border-[#2A2724] text-[#EDE8DF]/70 hover:text-[#EDE8DF] hover:border-[#E25B32]/40 transition-all text-xs font-medium shadow-sm group"
            title="Search dishes & restaurants (⌘K)"
          >
            <Search className="w-4 h-4 text-[#EDE8DF]/60 group-hover:text-[#E25B32] transition-colors" />
            <span className="hidden sm:inline text-xs">Search gourmet...</span>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-[#2A2724]/80 text-[10px] font-mono text-[#9EB878] border border-[#2A2724]">
              ⌘K
            </kbd>
          </button>

          {/* Interactive Cart Button featuring Animated Framer Motion Bounce Badge */}
          <motion.button
            onClick={openCart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#161513] border border-[#2A2724] text-[#EDE8DF] hover:border-[#E25B32] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)] group"
          >
            <ShoppingBag className="w-4 h-4 text-[#E25B32] group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-mono font-bold tracking-wider">CART</span>

            {/* Bounce Count Badge */}
            <motion.span
              key={cartCount}
              animate={isBouncing ? { scale: [1, 1.4, 0.9, 1.15, 1], rotate: [0, -10, 10, -5, 0] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-mono font-bold transition-colors ${
                cartCount > 0
                  ? 'bg-[#E25B32] text-white shadow-[0_0_12px_rgba(226,91,50,0.6)]'
                  : 'bg-[#2A2724] text-[#EDE8DF]/50'
              }`}
            >
              {cartCount}
            </motion.span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
