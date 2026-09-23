import { create } from 'zustand';
import { SAVED_ADDRESSES, INITIAL_CART, RESTAURANTS } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Retrieve initial auth state from localStorage with 15-minute session expiration check
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('petpooja_token');
    const user = localStorage.getItem('petpooja_user');
    const loginTimestamp = localStorage.getItem('petpooja_login_timestamp');

    if (token && loginTimestamp) {
      const elapsed = Date.now() - parseInt(loginTimestamp, 10);
      const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
      
      // If 15 minutes have passed since login/session start, expire the session
      if (elapsed > FIFTEEN_MINUTES_MS) {
        localStorage.removeItem('petpooja_token');
        localStorage.removeItem('petpooja_user');
        localStorage.removeItem('petpooja_login_timestamp');
        return { token: null, user: null };
      }
    }

    return {
      token: token || null,
      user: user ? JSON.parse(user) : null
    };
  } catch (e) {
    return { token: null, user: null };
  }
};

const initialAuth = getStoredAuth();

export const useCraveStore = create((set, get) => ({
  // Auth & Session State
  token: initialAuth.token,
  user: initialAuth.user,
  isAuthenticated: Boolean(initialAuth.token && initialAuth.user),
  isAuthModalOpen: false,
  authModalState: 'login', // 'login' | 'signup' | 'address'
  pendingAction: null,
  authError: null,
  authLoading: false,

  openAuthModal: (mode = 'login', pendingAction = null) => set({
    isAuthModalOpen: true,
    authModalState: mode,
    pendingAction: pendingAction || get().pendingAction,
    authError: null
  }),

  closeAuthModal: () => set({
    isAuthModalOpen: false,
    authError: null
  }),

  setAuthModalState: (mode) => set({ authModalState: mode, authError: null }),

  logoutUser: () => {
    localStorage.removeItem('petpooja_token');
    localStorage.removeItem('petpooja_user');
    localStorage.removeItem('petpooja_login_timestamp');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      activeView: 'explore',
      isAuthModalOpen: false
    });
  },

  // Auth API Handlers
  loginUser: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      localStorage.setItem('petpooja_token', data.token);
      localStorage.setItem('petpooja_user', JSON.stringify(data.user));
      localStorage.setItem('petpooja_login_timestamp', Date.now().toString());

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null
      });

      // Check if user has completed address
      if (!data.user.hasCompletedAddress) {
        set({ authModalState: 'address' });
      } else {
        set({ isAuthModalOpen: false });
        const pending = get().pendingAction;
        if (pending) {
          pending();
          set({ pendingAction: null });
        }
      }
      return { success: true, user: data.user };
    } catch (error) {
      set({ authLoading: false, authError: error.message });
      return { success: false, error: error.message };
    }
  },

  registerUser: async (name, email, phone, password) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.errors ? data.errors.map(e => e.msg).join(', ') : data.message;
        throw new Error(errorMsg || 'Registration failed.');
      }

      localStorage.setItem('petpooja_token', data.token);
      localStorage.setItem('petpooja_user', JSON.stringify(data.user));
      localStorage.setItem('petpooja_login_timestamp', Date.now().toString());

      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        authLoading: false,
        authError: null,
        authModalState: 'address' // Auto-transition to Mandatory Address Setup
      });

      return { success: true, user: data.user };
    } catch (error) {
      set({ authLoading: false, authError: error.message });
      return { success: false, error: error.message };
    }
  },

  saveUserAddress: async (addressData) => {
    set({ authLoading: true, authError: null });
    try {
      const token = get().token;
      const response = await fetch(`${API_BASE_URL}/auth/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressData)
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to save address.');
      }

      const updatedUser = {
        ...get().user,
        addresses: data.addresses,
        hasCompletedAddress: true
      };

      localStorage.setItem('petpooja_user', JSON.stringify(updatedUser));

      // Update local address store
      const primaryAddress = data.addresses[data.addresses.length - 1];
      const formattedAddress = {
        id: primaryAddress._id || `addr-${Date.now()}`,
        title: primaryAddress.flat,
        address: `${primaryAddress.flat}, ${primaryAddress.street}, ${primaryAddress.area}, ${primaryAddress.city} - ${primaryAddress.pincode}`,
        area: primaryAddress.area,
        selected: true
      };

      set({
        user: updatedUser,
        addresses: [formattedAddress, ...get().addresses],
        selectedAddress: formattedAddress,
        authLoading: false,
        authError: null,
        isAuthModalOpen: false
      });

      const pending = get().pendingAction;
      if (pending) {
        pending();
        set({ pendingAction: null });
      }

      return { success: true };
    } catch (error) {
      set({ authLoading: false, authError: error.message });
      return { success: false, error: error.message };
    }
  },

  // Navigation & View State
  activeView: 'explore', // 'explore' | 'restaurants' | 'gourmet' | 'track-order' | 'checkout' | 'restaurant-detail'
  setActiveView: (view) => set({ activeView: view }),

  // Address State
  addresses: [],
  selectedAddress: null,
  isAddressModalOpen: false,
  toggleAddressModal: (isOpen) => set((state) => ({ 
    isAddressModalOpen: isOpen !== undefined ? isOpen : !state.isAddressModalOpen 
  })),
  addAddress: (newAddr) => {
    const formatted = {
      id: `addr-${Date.now()}`,
      title: newAddr.title || 'Home',
      address: `${newAddr.flatNo}${newAddr.apartment ? ', ' + newAddr.apartment : ''}, ${newAddr.street}${newAddr.landmark ? ', Landmark: ' + newAddr.landmark : ''}`,
      note: newAddr.instructions || '',
      selected: true
    };
    
    set((state) => {
      const updatedAddresses = [formatted, ...state.addresses.map((a) => ({ ...a, selected: false }))];
      return {
        addresses: updatedAddresses,
        selectedAddress: formatted,
        isAddressModalOpen: false
      };
    });

    // If user is logged in, sync with backend API asynchronously
    const token = get().token;
    if (token) {
      get().saveUserAddress({
        flat: newAddr.flatNo,
        street: newAddr.street,
        area: newAddr.apartment || newAddr.landmark || 'Main Area',
        city: 'Bengaluru',
        pincode: '560001',
        type: (newAddr.title || 'HOME').toUpperCase()
      }).catch((err) => console.error('Address sync error:', err));
    }
  },
  setSelectedAddress: (addressId) => set((state) => {
    const found = state.addresses.find((a) => a.id === addressId);
    return {
      selectedAddress: found || state.selectedAddress,
      addresses: state.addresses.map((a) => ({
        ...a,
        selected: a.id === addressId
      })),
      isAddressModalOpen: false
    };
  }),

  // Filter & Search State
  vegOnly: false,
  toggleVegOnly: () => set((state) => ({ vegOnly: !state.vegOnly })),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCuisine: null,
  setSelectedCuisine: (cuisineId) => set({ selectedCuisine: cuisineId }),

  // Active Restaurant State
  currentRestaurant: RESTAURANTS[0],
  setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),

  // Cart & Drawer State
  cart: [],
  isCartDrawerOpen: false,
  toggleCartDrawer: (isOpen) => set((state) => ({ 
    isCartDrawerOpen: isOpen !== undefined ? isOpen : !state.isCartDrawerOpen 
  })),
  addToCart: (dish, customization = '') => set((state) => {
    const existingIndex = state.cart.findIndex((item) => item.id === dish.id);
    if (existingIndex > -1) {
      const updated = [...state.cart];
      updated[existingIndex].qty += 1;
      return { cart: updated };
    }
    return {
      cart: [
        ...state.cart,
        {
          id: dish.id,
          restaurantId: dish.restaurantId || 'dastarkhwan',
          name: dish.name,
          price: dish.price,
          qty: 1,
          veg: dish.veg,
          customization: customization || dish.customizationNote || ''
        }
      ]
    };
  }),
  updateCartQty: (dishId, delta) => set((state) => {
    const updated = state.cart
      .map((item) => {
        if (item.id === dishId) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    return { cart: updated };
  }),
  removeFromCart: (dishId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== dishId)
  })),
  clearCart: () => set({ cart: [] }),

  // Computed Cart Metrics
  getCartTotal: () => {
    const cart = get().cart;
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  },
  getCartCount: () => {
    const cart = get().cart;
    return cart.reduce((count, item) => count + item.qty, 0);
  },

  // Active Order Tracking State
  activeOrder: null,
  placeOrder: (paymentMethod = 'UPI') => set((state) => ({
    activeOrder: {
      id: `PPJ-${Math.floor(10000 + Math.random() * 90000)}`,
      restaurantName: state.currentRestaurant.name,
      status: 'Kitchen Preparing',
      eta: '25-30 mins',
      expectedTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      valet: {
        name: 'Rajesh Kumar',
        rating: 4.9,
        deliveries: '2,420+ safe deliveries',
        tempCheck: '98.4°F Checked',
        phone: '+91 98765 43210'
      },
      items: state.cart,
      totalPaid: state.getCartTotal() + 25 + 30 + 34 - 100,
      paymentMethod
    },
    cart: [],
    activeView: 'track-order',
    isCartDrawerOpen: false
  }))
}));
