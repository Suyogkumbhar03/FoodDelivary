import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Flame, Sparkles, Utensils, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

// Sample mock data for quick modal search before API integration
const SEARCH_SAMPLE_ITEMS = [
  {
    id: 's1',
    name: 'A5 Wagyu & Black Truffle Nigiri',
    category: 'Signature Cuts',
    restaurant: 'Umami Lab',
    price: 38,
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&q=80',
    tags: ['Wagyu', 'Truffle', 'Japanese', 'Omakase']
  },
  {
    id: 's2',
    name: 'Truffle Burrata & Wild Mushroom Pizza',
    category: 'Artisan Dough',
    restaurant: 'Fire & Flour Neapolitan',
    price: 28,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80',
    tags: ['Pizza', 'Burrata', 'Truffle', 'Italian']
  },
  {
    id: 's3',
    name: 'Golden Harvest Macadamia & Avocado Bowl',
    category: 'Craft Bowls',
    restaurant: 'Verdant Botanical Bar',
    price: 22,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80',
    tags: ['Vegan', 'Avocado', 'Quinoa', 'Organic']
  },
  {
    id: 's4',
    name: 'Prime Galbi Short Rib Ribbons',
    category: 'Signature Cuts',
    restaurant: 'Neon Seoul BBQ',
    price: 36,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&q=80',
    tags: ['Korean', 'BBQ', 'Galbi', 'Prime Beef']
  }
];

export default function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { addItem, openCart } = useCartStore();

  // ⌘K / Ctrl+K Global Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search triggers parent
          window.dispatchEvent(new CustomEvent('crave-open-search'));
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = SEARCH_SAMPLE_ITEMS.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.restaurant.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-xl bg-[#161513] border border-[#2A2724] rounded-2xl shadow-2xl overflow-hidden relative z-10 text-[#EDE8DF]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-[#2A2724] flex items-center gap-3">
              <Search className="w-5 h-5 text-[#E25B32]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search gourmet dishes, ingredients, concept kitchens..."
                autoFocus
                className="w-full bg-transparent text-sm text-[#EDE8DF] placeholder-[#EDE8DF]/40 focus:outline-none font-body"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-[#EDE8DF]/40 hover:text-white px-1.5"
                >
                  Clear
                </button>
              )}
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-[#9EB878] bg-[#0E0D0C] border border-[#2A2724] px-2 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results Container */}
            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#EDE8DF]/50 font-mono">
                  No epicurean matches found for "{searchTerm}".
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#0E0D0C] border border-[#2A2724] flex items-center justify-between gap-4 hover:border-[#E25B32]/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#2A2724]"
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#EDE8DF] group-hover:text-[#E25B32] transition-colors">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-[#9EB878] bg-[#9EB878]/10 px-1.5 py-0.2 rounded">
                            {item.restaurant}
                          </span>
                          <span className="text-[10px] font-mono text-[#EDE8DF]/50">
                            • {item.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#E25B32]">
                        ${item.price}
                      </span>
                      <button
                        onClick={() => {
                          addItem(item, 1);
                          onClose();
                          openCart();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#E25B32] text-white text-xs font-mono font-medium hover:bg-[#E25B32]/90 transition-all flex items-center gap-1 shadow-sm"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer tips */}
            <div className="p-3 bg-[#0E0D0C] border-t border-[#2A2724] text-[11px] font-mono text-[#EDE8DF]/40 flex items-center justify-between px-4">
              <span>Press <kbd className="text-[#9EB878]">⌘K</kbd> anytime to open search</span>
              <span className="text-[#E25B32]">CRAVE Epicurean Search</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
