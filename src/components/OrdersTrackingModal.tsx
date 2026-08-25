import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  LogIn,
  LogOut,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, trackOrderById } from '../lib/firebaseService';
import { GraffitiCrown } from './GraffitiEmblems';

interface OrdersTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrdersTrackingModal: React.FC<OrdersTrackingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-orders' | 'track'>('track');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  // Single tracking input
  const [searchCode, setSearchCode] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Load user orders when logged in
  useEffect(() => {
    if (user && isOpen) {
      setActiveTab('my-orders');
      setLoadingOrders(true);
      fetchUserOrders(user.uid)
        .then((orders) => {
          setUserOrders(orders);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    } else if (!user) {
      setActiveTab('track');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setTrackedOrder(null);

    try {
      const order = await trackOrderById(searchCode.trim());
      if (order) {
        setTrackedOrder(order);
      } else {
        setSearchError('No order found with this tracking number or ID.');
      }
    } catch (err) {
      setSearchError('Error querying database. Please verify your tracking number.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display uppercase tracking-tight text-white flex items-center gap-2">
                ORDER TRACKING & HISTORY <GraffitiCrown size={16} />
              </h3>
              <span className="text-xs text-white/50">
                Connected with Firebase Firestore
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1E1E1E] hover:bg-[#282828] text-white/70 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-between mt-4 mb-4 gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition font-kvant ${
                activeTab === 'track'
                  ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20'
                  : 'bg-[#1A1A1A] text-white/70 hover:text-white'
              }`}
            >
              Live Package Track
            </button>
            <button
              onClick={() => setActiveTab('my-orders')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition font-kvant ${
                activeTab === 'my-orders'
                  ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20'
                  : 'bg-[#1A1A1A] text-white/70 hover:text-white'
              }`}
            >
              My Orders ({userOrders.length})
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-2 text-xs">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-[#CCFF00]"
                />
              )}
              <span className="hidden sm:inline font-bold text-white/90">
                {user.displayName?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="p-1.5 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg text-white/70 hover:text-red-400 transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2C2C2C] border border-[#333] text-[#CCFF00] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer font-kvant"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In with Google
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {activeTab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrackSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Tracking Number (e.g. DERB-CAS-8821) or Order ID"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-3 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-xs rounded-xl transition shadow-lg cursor-pointer font-kvant"
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </button>
              </form>

              {searchError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-center">
                  {searchError}
                </div>
              )}

              {trackedOrder && (
                <div className="p-5 bg-[#181818] border border-[#CCFF00]/40 rounded-2xl space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#262626]">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase block">Tracking Number</span>
                      <span className="text-sm font-black text-[#CCFF00] font-mono">
                        {trackedOrder.trackingNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2.5 py-1 rounded-full uppercase font-black bg-[#CCFF00] text-black font-kvant">
                        {trackedOrder.status}
                      </span>
                      <span className="text-white/60 font-mono text-[11px]">
                        {trackedOrder.totalMAD} MAD ({trackedOrder.paymentMethod === 'cod' ? 'COD' : 'Paid'})
                      </span>
                    </div>
                  </div>

                  {/* Status Progress Bar */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold uppercase mb-2">
                      <span className={getStatusStepIndex(trackedOrder.status) >= 0 ? 'text-[#CCFF00]' : 'text-white/30'}>
                        1. Confirmed
                      </span>
                      <span className={getStatusStepIndex(trackedOrder.status) >= 1 ? 'text-[#CCFF00]' : 'text-white/30'}>
                        2. Packaged
                      </span>
                      <span className={getStatusStepIndex(trackedOrder.status) >= 2 ? 'text-[#CCFF00]' : 'text-white/30'}>
                        3. Out for Delivery
                      </span>
                      <span className={getStatusStepIndex(trackedOrder.status) >= 3 ? 'text-[#CCFF00]' : 'text-white/30'}>
                        4. Delivered
                      </span>
                    </div>
                    <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#CCFF00] h-full transition-all duration-500"
                        style={{
                          width: `${(getStatusStepIndex(trackedOrder.status) + 1) * 25}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Delivery Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#121212] p-3.5 rounded-xl border border-[#242424]">
                    <div>
                      <span className="text-white/50 block text-[11px]">Recipient & City</span>
                      <span className="font-bold text-white">
                        {trackedOrder.shippingDetails.fullName} ({trackedOrder.shippingDetails.city})
                      </span>
                      <span className="text-[11px] text-white/60 block mt-0.5">
                        {trackedOrder.shippingDetails.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[11px]">Estimated Transit Time</span>
                      <span className="font-bold text-[#CCFF00]">
                        {trackedOrder.estimatedDelivery || '24-48 Hours'}
                      </span>
                      <span className="text-[11px] text-white/60 block mt-0.5">
                        Ordered on {trackedOrder.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div>
                    <span className="text-xs font-bold text-white/80 block mb-2">
                      Package Contents ({trackedOrder.items.length} items):
                    </span>
                    <div className="space-y-2">
                      {trackedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div>
                              <span className="font-bold text-white block text-xs">
                                {item.product.name}
                              </span>
                              <span className="text-[11px] text-white/60">
                                Size: {item.selectedSize} • Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-[#CCFF00]">
                            {item.product.priceMAD * item.quantity} MAD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-orders' && (
            <div className="space-y-3">
              {!user ? (
                <div className="text-center py-10 space-y-3 bg-[#181818] rounded-2xl border border-[#242424] p-6">
                  <Package className="w-12 h-12 text-[#CCFF00]/50 mx-auto" />
                  <h4 className="text-base font-black uppercase text-white font-kvant">
                    Sign in to view your orders
                  </h4>
                  <p className="text-xs text-white/60 max-w-sm mx-auto">
                    Link your Google account to automatically store and track all your DERB purchases in Firebase Firestore.
                  </p>
                  <button
                    onClick={login}
                    className="px-5 py-2.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-xs rounded-xl transition shadow-lg cursor-pointer font-kvant inline-flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Sign In with Google
                  </button>
                </div>
              ) : loadingOrders ? (
                <div className="text-center py-10 text-white/60">
                  Loading your orders from Firebase...
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2 bg-[#181818] rounded-2xl border border-[#242424]">
                  <Package className="w-10 h-10 text-white/30 mx-auto" />
                  <p className="text-sm font-bold text-white">No orders placed yet.</p>
                  <p className="text-xs text-white/50">Your future drops and streetwear orders will appear here.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#181818] border border-[#262626] hover:border-[#CCFF00]/40 rounded-2xl transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#CCFF00]">
                        {ord.trackingNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md uppercase font-black bg-[#242424] text-white">
                        {ord.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{ord.createdAt}</span>
                      <span className="font-black text-white">{ord.totalMAD} MAD</span>
                    </div>
                    <div className="pt-2 border-t border-[#222] flex items-center justify-between text-[11px]">
                      <span className="text-white/50">
                        {ord.shippingDetails.city} • {ord.items.length} items
                      </span>
                      <button
                        onClick={() => {
                          setSearchCode(ord.trackingNumber);
                          setTrackedOrder(ord);
                          setActiveTab('track');
                        }}
                        className="text-[#CCFF00] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Track Status <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
