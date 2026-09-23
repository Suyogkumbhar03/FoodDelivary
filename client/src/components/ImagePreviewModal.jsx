import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, Plus, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function ImagePreviewModal({ item, isOpen, onClose }) {
  const { addItem, getItemQuantity, openCart } = useCartStore();

  if (!item) return null;

  const quantity = getItemQuantity(item._id || item.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="w-full max-w-2xl bg-[#161513] border border-[#2A2724] rounded-3xl overflow-hidden shadow-2xl relative z-10 text-[#EDE8DF]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Res Image Header */}
            <div className="relative h-72 sm:h-80 overflow-hidden bg-[#2A2724]">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161513] via-transparent to-transparent" />

              {/* Category Badge */}
              <span className="absolute top-4 left-4 bg-[#0E0D0C]/80 backdrop-blur-md text-[#9EB878] font-mono text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-[#2A2724]">
                {item.category || 'Gourmet Selection'}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2A2724] pb-4">
                <div>
                  <h3 className="font-display font-extrabold text-2xl text-[#EDE8DF] leading-tight">
                    {item.name}
                  </h3>
                  {item.rating && (
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-amber-400">
                      <span>★ {item.rating} Rating</span>
                      {item.calories && <span className="text-[#EDE8DF]/40">• {item.calories} kcal</span>}
                    </div>
                  )}
                </div>
                <span className="font-mono text-2xl font-bold text-[#E25B32]">
                  ${item.price?.toFixed(2)}
                </span>
              </div>

              {/* Dietary Flags & Spicy Rating */}
              <div className="flex flex-wrap items-center gap-2">
                {item.dietaryFlags?.map((flag) => (
                  <span
                    key={flag}
                    className="text-[10px] font-mono uppercase tracking-wider bg-[#9EB878]/10 text-[#9EB878] border border-[#9EB878]/30 px-2.5 py-0.5 rounded-full"
                  >
                    {flag}
                  </span>
                ))}
                {item.spicyLevel > 0 && (
                  <span className="text-[10px] font-mono text-[#E25B32] bg-[#E25B32]/10 border border-[#E25B32]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    🌶️ {'Spicy '.repeat(item.spicyLevel)}
                  </span>
                )}
              </div>

              {/* Chef Notes & Ingredients */}
              {item.chefNote && (
                <div className="p-3.5 rounded-xl bg-[#0E0D0C] border border-[#2A2724] text-xs font-light italic text-[#EDE8DF]/80">
                  <strong className="text-[#E25B32] not-italic font-mono block mb-1">Chef's Note:</strong>
                  "{item.chefNote}"
                </div>
              )}

              {item.ingredients?.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#EDE8DF]/50 mb-1.5">Artisanal Ingredients</h4>
                  <p className="text-xs text-[#EDE8DF]/80 leading-relaxed">
                    {item.ingredients.join(', ')}
                  </p>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A2724]">
                <button
                  onClick={() => {
                    addItem(item, 1);
                    onClose();
                    openCart();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E25B32] text-white text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#E25B32]/90 transition-all shadow-[0_0_20px_rgba(226,91,50,0.4)] flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Order ({quantity > 0 ? `${quantity} in Basket` : `$${item.price?.toFixed(2)}`})</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
