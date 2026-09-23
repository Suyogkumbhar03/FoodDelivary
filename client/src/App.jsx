import React from 'react';
import Header from './components/Header';
import ExploreFeedView from './components/ExploreFeedView';
import RestaurantDetailView from './components/RestaurantDetailView';
import AddressModal from './components/AddressModal';
import CartDrawer from './components/CartDrawer';
import CheckoutView from './components/CheckoutView';
import OrderTrackingView from './components/OrderTrackingView';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { useCraveStore } from './store/useCraveStore';

export default function App() {
  const { activeView } = useCraveStore();

  const renderActiveView = () => {
    switch (activeView) {
      case 'restaurant-detail':
        return <RestaurantDetailView />;
      case 'checkout':
        return <CheckoutView />;
      case 'track-order':
        return <OrderTrackingView />;
      case 'restaurants':
      case 'gourmet':
      case 'explore':
      default:
        return <ExploreFeedView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] font-body text-crave-espresso antialiased selection:bg-crave-flame selection:text-white">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Content Area (padded for fixed header) */}
      <main className="flex-1 pt-28">
        {renderActiveView()}
      </main>

      {/* Modals & Slide-over Drawers */}
      <AddressModal />
      <CartDrawer />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}
