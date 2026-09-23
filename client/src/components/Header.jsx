import React, { useState } from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function Header() {
  const {
    activeView,
    setActiveView,
    selectedAddress,
    toggleAddressModal,
    vegOnly,
    toggleVegOnly,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartTotal,
    toggleCartDrawer,
    isAuthenticated,
    user,
    logoutUser,
    openAuthModal,
    activeOrder
  } = useCraveStore();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const navItems = [
    { id: 'explore', label: 'Explore & Feed' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'gourmet', label: 'Gourmet & Handi' },
    ...(isAuthenticated && activeOrder ? [{ id: 'track-order', label: 'Track Order' }] : [])
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-crave-border select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-3 pb-2 flex flex-col justify-between gap-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Delivery Location */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setActiveView('explore')}
              className="flex items-center gap-2 text-left focus:outline-none group select-none"
            >
              {/* PetPooja Brand Logo SVG */}
              <svg className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(4, 8)">
                  <path d="M12 28 C12 38, 36 38, 36 28 L38 20 C38 18, 10 18, 10 20 Z" fill="#E05326" />
                  <path d="M10 20 C10 16, 38 16, 38 20" stroke="#C23A22" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18 14 C18 10, 22 8, 20 4" stroke="#E05326" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M25 13 C25 8, 30 7, 28 3" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="34" cy="24" r="2" fill="#FFFFFF"/>
                </g>
                <text x="54" y="42" fontFamily="'Fraunces', serif" fontSize="30" fontWeight="800" letterSpacing="1" fill="#E05326">PetPooja</text>
                <circle cx="204" cy="24" r="4.5" fill="#E05326"/>
                <text x="56" y="55" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.5" fill="#6E665E">PEHLE PET POOJA, PHIR KAAM DOOJA</text>
              </svg>
            </button>

            {/* Deliver To Location Selector */}
            <div
              onClick={() => toggleAddressModal(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-crave-border hover:bg-crave-creamLow transition-colors cursor-pointer select-none shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-crave-flameLight flex items-center justify-center text-crave-flame shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="font-body text-xs font-bold text-crave-espresso leading-tight flex items-center gap-1">
                  Deliver to: <span className="font-semibold">{selectedAddress?.title || 'Home / Office'}</span>
                  <span className="material-symbols-outlined text-[14px] text-crave-sand">expand_more</span>
                </span>
                <span className="font-body text-[11px] text-crave-sand truncate max-w-[180px]">
                  {selectedAddress?.address || 'Near Main Market, MG Road'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-md lg:max-w-lg mx-1 sm:mx-2">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-crave-sand text-[20px] pointer-events-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for butter chicken, veg thali, biryani, or your favorite hotel..."
                className="w-full h-10 pl-10 pr-10 rounded-xl bg-white text-crave-espresso placeholder:text-crave-sand font-body text-xs font-medium border border-crave-border focus:outline-none focus:bg-white focus:ring-2 focus:ring-crave-flame/30 transition-all shadow-sm"
              />
              <button
                type="button"
                className="absolute right-2 p-1 text-crave-sand hover:text-crave-flame transition-colors"
                title="Filter options"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>

          {/* Controls: Veg Toggle + Cart Button + Auth Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 select-none">
            
            {/* Veg Only Toggle Switch */}
            <button
              type="button"
              onClick={toggleVegOnly}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-sm cursor-pointer ${
                vegOnly
                  ? 'bg-crave-wasabiBg border-crave-wasabi text-crave-wasabi font-bold'
                  : 'bg-white border-crave-border text-crave-espresso font-bold hover:bg-crave-creamLow'
              }`}
              title="Toggle Veg Only Dishes"
            >
              <div className="w-4 h-4 rounded-[3px] border-2 border-crave-wasabi flex items-center justify-center p-[2px] bg-white shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-crave-wasabi"></div>
              </div>
              
              <span className="font-body text-xs font-extrabold tracking-tight">
                Veg Only
              </span>

              <div
                className={`w-7 h-4 rounded-full relative p-0.5 transition-colors shrink-0 ${
                  vegOnly ? 'bg-crave-wasabi' : 'bg-crave-sand/40'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white shadow-md transform transition-transform ${
                    vegOnly ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>

            {/* Cart Pill */}
            <button
              onClick={() => toggleCartDrawer(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-crave-espresso text-white shadow-md hover:bg-black transition-all active:scale-95 select-none"
            >
              <span className="material-symbols-outlined text-crave-wasabiBg text-[18px]">shopping_bag</span>
              <span className="font-mono text-xs font-bold text-crave-wasabiBg">
                {cartCount}
              </span>
              <span className="text-crave-sand font-mono">•</span>
              <span className="font-mono text-xs font-bold text-white">₹{cartTotal}</span>
            </button>

            {/* User Profile Avatar or Sign-in Pill */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-crave-border hover:bg-crave-creamLow transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-crave-flame text-white font-serif font-bold flex items-center justify-center text-sm shadow-sm">
                    {user?.name?.charAt(0) || 'P'}
                  </div>
                  <span className="hidden md:inline font-body text-xs font-bold text-crave-espresso max-w-[90px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <span className="material-symbols-outlined text-crave-sand text-[16px]">expand_more</span>
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-crave-border p-2 space-y-1 animate-scale-up z-50"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <div className="px-3 py-2 border-b border-crave-border">
                      <p className="font-body text-xs font-bold text-crave-espresso">{user?.name}</p>
                      <p className="font-mono text-[10px] text-crave-sand truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => setActiveView('track-order')}
                      className="w-full text-left px-3 py-1.5 rounded-xl font-body text-xs text-crave-espresso hover:bg-crave-creamLow flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={logoutUser}
                      className="w-full text-left px-3 py-1.5 rounded-xl font-body text-xs text-crave-flame hover:bg-crave-flameLight flex items-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E05326] text-white font-body text-xs font-bold hover:bg-[#C23A22] shadow-md transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>Sign In / Register</span>
              </button>
            )}

          </div>
        </div>

        {/* Sub-Navigation Links */}
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-crave-border/40 pt-2 select-none">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-4 py-1.5 rounded-full font-body text-xs transition-all whitespace-nowrap select-none ${
                  isActive
                    ? 'bg-[#E05326] text-white font-bold shadow-sm'
                    : 'text-[#6E665E] hover:text-[#211C18] font-semibold hover:bg-[#F4EEE6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
