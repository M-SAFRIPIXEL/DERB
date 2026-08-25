import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  User,
  MapPin,
  Copy,
  ExternalLink,
  CloudCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';
import { MOROCCAN_CITIES } from '../data/products';
import { GraffitiCrown } from './GraffitiEmblems';
import { useAuth } from '../context/AuthContext';
import { createOrderInFirestore } from '../lib/firebaseService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercentage: number;
  promoCode: string;
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercentage,
  promoCode,
  onOrderPlaced,
  onClearCart,
}) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('Casablanca');
  const [address, setAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);

  useEffect(() => {
    if (user?.displayName && !fullName) {
      setFullName(user.displayName);
    }
  }, [user]);

  if (!isOpen) return null;

  const currentCity =
    MOROCCAN_CITIES.find((c) => c.name === selectedCityName) || MOROCCAN_CITIES[0];

  const subtotal = items.reduce((acc, item) => acc + item.product.priceMAD * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const isFreeShipping = subtotal >= 500;
  const shippingFee = isFreeShipping ? 0 : currentCity.shippingFeeMAD;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Please fill out your name, phone number, and delivery address in Morocco.');
      return;
    }

    setIsSubmitting(true);

    try {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const cityPrefix = selectedCityName.substring(0, 3).toUpperCase();
      const trackingCode = `DERB-${cityPrefix}-${randomDigits}`;

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        trackingNumber: trackingCode,
        items: [...items],
        shippingDetails: {
          fullName,
          phone,
          city: selectedCityName,
          address,
          ...(deliveryNotes.trim() ? { deliveryNotes: deliveryNotes.trim() } : {}),
        },
        paymentMethod,
        subtotalMAD: subtotal,
        shippingFeeMAD: shippingFee,
        discountMAD: discountAmount,
        totalMAD: total,
        ...(promoCode.trim() ? { promoCodeApplied: promoCode.trim() } : {}),
        status: 'confirmed',
        estimatedDelivery: currentCity.shippingDays,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Save order to Firestore
      await createOrderInFirestore(newOrder, user?.uid);

      // Trigger Confetti with neon lime colors
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#CCFF00', '#B8E600', '#FFFFFF', '#121212'],
        });
      } catch (err) {
        console.log('Confetti triggered');
      }

      setCompletedOrder(newOrder);
      onOrderPlaced(newOrder);
      onClearCart();
    } catch (err) {
      console.error('Error placing order in Firestore:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTracking = (track: string) => {
    navigator.clipboard.writeText(track);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-kvant uppercase text-white tracking-wider">
                {completedOrder ? 'Order Confirmed!' : 'Morocco Express Checkout'}
              </h2>
              <p className="text-xs text-[#CCFF00] font-mono">
                {completedOrder
                  ? 'Thank you for supporting DERB Casablanca Streetwear'
                  : 'Fast Dispatch • Cash on Delivery & CMI Secure'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS STATE */}
        {completedOrder ? (
          <div className="py-6 space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#CCFF00]/10 border border-[#CCFF00] text-[#CCFF00] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black font-kvant uppercase text-white">
                Bseha w Raha! Order Placed Successfully
              </h3>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Your luxury streetwear drop is now being packed at our Casablanca Atelier. Our courier will call you before delivery.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-white/50 font-mono uppercase tracking-wider block">
                  Morocco Courier Tracking Code
                </span>
                <span className="text-lg font-black text-[#CCFF00] tracking-wider font-mono">
                  {completedOrder.trackingNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyTracking(completedOrder.trackingNumber)}
                className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-black uppercase rounded-xl transition flex items-center gap-1.5 font-kvant hover:bg-[#B8E600] cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedTracking ? 'Copied to Clipboard!' : 'Copy Tracking'}
              </button>
            </div>

            {/* Order Details Summary */}
            <div className="p-5 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-4">
              <h4 className="font-black text-sm uppercase text-white font-kvant border-b border-[#262626] pb-2">
                Order Summary & Delivery Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/50 block font-mono">Recipient:</span>
                  <span className="font-bold text-white">{completedOrder.shippingDetails.fullName}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono">Phone (WhatsApp):</span>
                  <span className="font-bold text-white">{completedOrder.shippingDetails.phone}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono">Delivery Destination:</span>
                  <span className="font-bold text-white">
                    {completedOrder.shippingDetails.address}, {completedOrder.shippingDetails.city}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono">Payment Method:</span>
                  <span className="font-bold text-[#CCFF00]">
                    {completedOrder.paymentMethod === 'cod'
                      ? 'Paiement à la livraison (Cash on Delivery)'
                      : 'Credit Card / CMI Verified'}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono">Estimated Timeline:</span>
                  <span className="font-bold text-[#CCFF00]">
                    {completedOrder.estimatedDelivery}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono">Total Amount to Pay:</span>
                  <span className="font-black text-base text-[#CCFF00] font-kvant">
                    {completedOrder.totalMAD} MAD
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`https://wa.me/212600000000?text=Salam%20DERB,%20I%20just%20placed%20order%20${completedOrder.trackingNumber}%20for%20${completedOrder.totalMAD}%20MAD.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-center"
              >
                <span>Confirm Order on WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#CCFF00] hover:bg-[#B8E600] text-black text-xs font-black uppercase rounded-xl shadow-md transition text-center font-kvant cursor-pointer"
              >
                Back to Streetwear Store
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE CHECKOUT FORM */
          <form onSubmit={handleSubmitOrder} className="py-6 space-y-6">
            {/* Step 1: Shipping Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-2 font-kvant">
                <MapPin className="w-4 h-4" /> 1. Moroccan Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    Full Name / Nom Complet *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yassine El Amrani"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    Moroccan Phone / Numéro Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="06 XX XX XX XX / +212 6..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    City / Ville *
                  </label>
                  <select
                    value={selectedCityName}
                    onChange={(e) => setSelectedCityName(e.target.value)}
                    className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    {MOROCCAN_CITIES.map((city) => (
                      <option key={city.name} value={city.name} className="bg-[#181818] text-white">
                        {city.name} ({city.arabicName}) — {city.shippingDays}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    Exact Address / Adresse de livraison *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Quartier, Boulevard, Rue, N° d'appartement"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/80 block mb-1">
                  Delivery Notes / Instructions pour le livreur (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before coming, deliver to office..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3 pt-4 border-t border-[#222]">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-2 font-kvant">
                <Banknote className="w-4 h-4" /> 2. Payment Method / Méthode de Paiement
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cash on delivery */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#CCFF00] bg-[#1A1A1A] ring-1 ring-[#CCFF00]/40'
                      : 'border-[#262626] bg-[#141414] hover:bg-[#181818]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#CCFF00]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-xs font-black text-white uppercase font-kvant">Paiement à la livraison (COD)</span>
                    </div>
                    <span className="text-[11px] text-white/50 block mt-0.5">
                      Pay cash upon delivery directly to the courier
                    </span>
                  </div>
                </label>

                {/* Credit Card / CMI */}
                <label
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'card'
                      ? 'border-[#CCFF00] bg-[#1A1A1A] ring-1 ring-[#CCFF00]/40'
                      : 'border-[#262626] bg-[#141414] hover:bg-[#181818]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#CCFF00]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-xs font-black text-white uppercase font-kvant">Carte Bancaire / CMI</span>
                    </div>
                    <span className="text-[11px] text-white/50 block mt-0.5">
                      Visa, Mastercard, Moroccan CMI Cards
                    </span>
                  </div>
                </label>
              </div>

              {/* Card Inputs if Card chosen */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-xs font-black text-[#CCFF00] font-kvant">
                    <Lock className="w-3.5 h-3.5" /> 256-bit SSL Secure CMI Gateway
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-white/60 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-white/60 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-white/60 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Order Breakdown */}
            <div className="p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Items Subtotal ({items.length} items)</span>
                <span className="font-bold text-white">{subtotal} MAD</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#CCFF00] font-bold">
                  <span>Streetwear Voucher ({promoCode || '10%'})</span>
                  <span>-{discountAmount} MAD</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping to {selectedCityName} ({currentCity.shippingDays})</span>
                <span className="font-bold">
                  {shippingFee === 0 ? <span className="text-[#CCFF00]">FREE</span> : `${shippingFee} MAD`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#262626]">
                <span>Total to Pay</span>
                <span className="text-[#CCFF00] font-kvant">{total} MAD</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#CCFF00] hover:bg-[#B8E600] disabled:opacity-75 text-black font-black uppercase text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 hover:shadow-[#CCFF00]/25 active:scale-98 cursor-pointer font-kvant"
            >
              {isSubmitting ? (
                <span>Packing Order...</span>
              ) : (
                <>
                  <span>
                    Confirm Order ({total} MAD •{' '}
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay Online'})
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
