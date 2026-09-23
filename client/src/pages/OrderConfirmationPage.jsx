import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Printer,
  Compass,
  MapPin,
  Phone,
  Sparkles,
  ChefHat,
  Bike,
  Home,
  ShieldCheck
} from 'lucide-react';
import { getOrderById } from '../services/api';

const MOCK_ORDER = {
  _id: '66e5f8a002b1c41b9c8d1001',
  customer: {
    name: 'Alexander Vance',
    email: 'alexander.vance@epicurean.com',
    phone: '555-019-2834',
    deliveryAddress: {
      street: '742 Evergreen Terrace, Penthouse B',
      city: 'New York',
      postalCode: '10001'
    }
  },
  items: [
    {
      _id: 'i1',
      name: 'A5 Wagyu & Black Truffle Nigiri',
      price: 38,
      quantity: 1,
      menuItem: { name: 'A5 Wagyu & Black Truffle Nigiri' }
    },
    {
      _id: 'i2',
      name: 'Truffle Burrata & Wild Mushroom Pizza',
      price: 28,
      quantity: 1,
      menuItem: { name: 'Truffle Burrata & Wild Mushroom Pizza' }
    }
  ],
  paymentMethod: 'UPI',
  subtotal: 66.0,
  deliveryFee: 0.0,
  tax: 5.28,
  total: 71.28,
  status: 'Order Placed',
  createdAt: new Date().toISOString()
};

const TIMELINE_STEPS = [
  { id: 'placed', label: 'Order Transmitted', icon: CheckCircle2, status: 'completed' },
  { id: 'prepping', label: 'Kitchen Prepping', icon: ChefHat, status: 'active' },
  { id: 'assigned', label: 'Rider Assigned', icon: Bike, status: 'upcoming' },
  { id: 'delivered', label: 'Sanctuary Arrival', icon: Home, status: 'upcoming' }
];

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Countdown Timer (starting at 28 mins)
  const [secondsRemaining, setSecondsRemaining] = useState(28 * 60);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        if (id) {
          const response = await getOrderById(id);
          if (response && response.data) {
            setOrder(response.data);
          } else {
            setOrder(MOCK_ORDER);
          }
        } else {
          setOrder(MOCK_ORDER);
        }
      } catch (err) {
        console.warn('Using mock order fallback:', err);
        setOrder(MOCK_ORDER);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedTicketId = order?._id
    ? `#CRV-${order._id.slice(-6).toUpperCase()}`
    : '#CRV-9824';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#E25B32] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#9EB878]">Generating Epicurean Receipt...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#EDE8DF] selection:bg-[#E25B32] selection:text-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Animated Order Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="w-16 h-16 rounded-full bg-[#9EB878]/15 border border-[#9EB878]/40 flex items-center justify-center text-[#9EB878] mx-auto shadow-[0_0_25px_rgba(158,184,120,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-[#9EB878]">
            Order Successfully Dispatched
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-[#EDE8DF] tracking-tight">
            GASTRONOMY <span className="text-[#E25B32] italic font-serif">In Transit.</span>
          </h1>
          <p className="text-xs font-mono text-[#EDE8DF]/60 max-w-md mx-auto">
            Your culinary selection has been confirmed by master chefs. Follow the live dispatch timeline below.
          </p>
        </motion.div>

        {/* 1. ANIMATED STATUS TIMELINE & COUNTDOWN TIMER */}
        <div className="bg-[#161513] border border-[#2A2724] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#2A2724]">
            <div>
              <span className="text-[10px] font-mono text-[#EDE8DF]/50 uppercase tracking-widest block">
                Target Sanctuary Arrival
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-5 h-5 text-[#E25B32] animate-pulse" />
                <span className="font-mono text-3xl font-extrabold text-[#E25B32]">
                  {formatCountdown(secondsRemaining)}
                </span>
                <span className="text-xs font-mono text-[#9EB878]">(Estimated 25-30m)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-[#EDE8DF]/50 uppercase tracking-widest block">
                Digital Receipt Ticket
              </span>
              <strong className="font-mono text-lg text-[#EDE8DF] tracking-wider">{formattedTicketId}</strong>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx === 0;
              const isActive = idx === 1;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 relative transition-all ${
                    isDone
                      ? 'bg-[#9EB878]/10 border-[#9EB878]/40 text-[#9EB878]'
                      : isActive
                      ? 'bg-[#E25B32]/10 border-[#E25B32] text-[#E25B32] shadow-[0_0_15px_rgba(226,91,50,0.3)]'
                      : 'bg-[#0E0D0C] border-[#2A2724] text-[#EDE8DF]/30'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce' : ''}`} />
                  <span className="text-xs font-mono font-bold">{step.label}</span>
                  {isActive && <span className="text-[9px] font-mono uppercase text-[#E25B32]">In Progress</span>}
                  {isDone && <span className="text-[9px] font-mono uppercase text-[#9EB878]">Confirmed</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. DIGITAL RECEIPT TICKET (Itemized & Printable) */}
        <div className="bg-[#161513] border border-[#2A2724] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Decorative Receipt Jagged Header Accent */}
          <div className="flex items-center justify-between pb-4 border-b border-[#2A2724]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#E25B32]" />
              <div>
                <h3 className="font-display font-extrabold text-xl text-[#EDE8DF]">
                  CRAVE Epicurean Receipt
                </h3>
                <span className="text-[10px] font-mono text-[#EDE8DF]/50">
                  Transmitted at {new Date(order?.createdAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E0D0C] border border-[#2A2724] text-xs font-mono text-[#EDE8DF]/70 hover:text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>

          {/* Delivery Details Ticket Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#0E0D0C] border border-[#2A2724] text-xs font-mono">
            <div>
              <span className="text-[#EDE8DF]/50 block text-[10px] uppercase">Delivery Recipient</span>
              <strong className="text-[#EDE8DF]">{order?.customer?.name}</strong>
              <p className="text-[#EDE8DF]/70 text-[11px] mt-0.5">{order?.customer?.phone}</p>
            </div>
            <div>
              <span className="text-[#EDE8DF]/50 block text-[10px] uppercase">Sanctuary Address</span>
              <strong className="text-[#EDE8DF]">{order?.customer?.deliveryAddress?.street}</strong>
              <p className="text-[#EDE8DF]/70 text-[11px] mt-0.5">
                {order?.customer?.deliveryAddress?.city}, {order?.customer?.deliveryAddress?.postalCode}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-[#EDE8DF]/50">Itemized Selections</h4>
            <div className="divide-y divide-[#2A2724]/60 text-xs font-mono">
              {order?.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[#E25B32] font-bold">{item.quantity}x</span>
                    <span className="text-[#EDE8DF]">{item.name || item.menuItem?.name}</span>
                  </div>
                  <span className="font-bold text-[#EDE8DF]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="pt-4 border-t border-[#2A2724] space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-[#EDE8DF]/70">
              <span>Subtotal</span>
              <span>${order?.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#EDE8DF]/70">
              <span>Courier Delivery</span>
              <span>{order?.deliveryFee === 0 ? 'FREE' : `$${order?.deliveryFee?.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-[#EDE8DF]/70">
              <span>Taxes (8%)</span>
              <span>${order?.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#EDE8DF] pt-3 border-t border-[#2A2724]">
              <span>Total Paid ({order?.paymentMethod})</span>
              <span className="text-[#E25B32] text-xl font-mono">${order?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E25B32] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#E25B32]/90 transition-all shadow-[0_0_20px_rgba(226,91,50,0.4)] flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Concept Kitchens</span>
          </button>
        </div>
      </div>
    </div>
  );
}
