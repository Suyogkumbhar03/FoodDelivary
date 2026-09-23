import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      lastAddedTimestamp: null,

      // Cart Drawer Toggle Actions
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      // Cart Items Management
      addItem: (product, quantity = 1, specialInstructions = '') => {
        const id = product._id || product.id;
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(item => (item._id || item.id) === id);

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const existingItem = updatedItems[existingItemIndex];
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
            specialInstructions: specialInstructions || existingItem.specialInstructions
          };
          set({
            items: updatedItems,
            lastAddedTimestamp: Date.now()
          });
        } else {
          set({
            items: [
              ...currentItems,
              {
                ...product,
                _id: id,
                id,
                quantity,
                specialInstructions: specialInstructions || ''
              }
            ],
            lastAddedTimestamp: Date.now()
          });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => (item._id || item.id) !== id)
        }));
      },

      updateQuantity: (id, delta) => {
        const currentItems = get().items;
        const updatedItems = currentItems
          .map(item => {
            const itemId = item._id || item.id;
            if (itemId === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);

        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      // Dynamic Calculations
      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (get().items.length === 0) return 0;
        // Free delivery over $50 threshold
        return subtotal >= 50 ? 0 : 4.99;
      },

      getPlatformFee: () => {
        return get().items.length > 0 ? 1.99 : 0;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        return Number((subtotal * 0.08).toFixed(2)); // 8% estimated tax
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const delivery = get().getDeliveryFee();
        const platformFee = get().getPlatformFee();
        const tax = get().getTax();
        return Number((subtotal + delivery + platformFee + tax).toFixed(2));
      }
    }),
    {
      name: 'crave-epicurean-cart', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }) // persist only items
    }
  )
);

export default useCartStore;
