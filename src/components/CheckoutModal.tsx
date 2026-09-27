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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types';
import { MOROCCAN_CITIES } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t, lang, dir } = useLanguage();
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
      alert(lang === 'ar' ? 'يرجى إدخال الاسم، رقم الهاتف، وعنوان التوصيل في المغرب.' : 'Please fill out your name, phone number, and delivery address in Morocco.');
      return;
    }

    setIsSubmitting(true);

    try {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const cityPrefix = selectedCityName.substring(0, 3).toUpperCase();
      const trackingCode = `PHILO-${cityPrefix}-${randomDigits}`;

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

      // Trigger Confetti
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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
      dir={dir}
    >
      <div className="bg-[#121212] border border-[#262626] rounded-t-3xl sm:rounded-3xl w-full max-w-3xl h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl p-4 sm:p-7 text-white overflow-hidden pb-safe">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#222] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black font-arabic uppercase text-white tracking-wider">
                {completedOrder ? t('checkout.successTitle') : t('checkout.title')}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#CCFF00] font-arabic">
                {completedOrder
                  ? t('checkout.successDesc')
                  : t('checkout.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={t('action.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 py-3 sm:py-4">
          {/* ORDER SUCCESS STATE */}
          {completedOrder ? (
            <div className="py-4 space-y-5 animate-fade-in font-arabic">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#CCFF00]/10 border border-[#CCFF00] text-[#CCFF00] rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
                  {t('checkout.successTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed">
                  {t('checkout.successDesc')}
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-white/50 block">
                    {t('checkout.trackingCode')}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#CCFF00] tracking-wider font-mono">
                    {completedOrder.trackingNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTracking(completedOrder.trackingNumber)}
                  className="px-4 py-2.5 bg-[#CCFF00] text-black text-xs font-black uppercase rounded-xl transition flex items-center gap-1.5 hover:bg-[#B8E600] cursor-pointer min-h-[40px] touch-manipulation"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedTracking ? t('checkout.copied') : t('checkout.copyTracking')}
                </button>
              </div>

              {/* Order Details Summary */}
              <div className="p-4 sm:p-5 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-3 text-xs">
                <h4 className="font-black text-xs uppercase text-white border-b border-[#262626] pb-2">
                  {t('checkout.orderSummary')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-white/50 block">{t('checkout.recipient')}</span>
                    <span className="font-bold text-white">{completedOrder.shippingDetails.fullName}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">{t('checkout.phoneLabel')}</span>
                    <span className="font-bold text-white font-mono">{completedOrder.shippingDetails.phone}</span>
                  </div>
                  <div>
                    <span className="text-white/50 block">{t('checkout.destination')}</span>
                    <span className="font-bold text-white">
                      {completedOrder.shippingDetails.address}, {completedOrder.shippingDetails.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 block">{t('checkout.paymentLabel')}</span>
                    <span className="font-bold text-[#CCFF00]">
                      {completedOrder.paymentMethod === 'cod'
                        ? t('checkout.codTitle')
                        : t('checkout.cardTitle')}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 block">{t('checkout.timeline')}</span>
                    <span className="font-bold text-[#CCFF00]">
                      {completedOrder.estimatedDelivery}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/50 block">{t('checkout.amountToPay')}</span>
                    <span className="font-black text-base text-[#CCFF00] font-kvant">
                      {completedOrder.totalMAD} {t('currency.mad')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/212710960721?text=${encodeURIComponent(
                    `Salam PHILOSTORYA, I just placed order ${completedOrder.trackingNumber} for ${completedOrder.totalMAD} MAD.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-center min-h-[44px] touch-manipulation"
                >
                  <span>{t('checkout.confirmWhatsApp')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#CCFF00] hover:bg-[#B8E600] text-black text-xs font-black uppercase rounded-xl shadow-md transition text-center cursor-pointer min-h-[44px] touch-manipulation"
                >
                  {t('action.backToStore')}
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5 font-arabic">
              {/* Step 1: Shipping Details */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {t('checkout.step1')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      {t('checkout.fullName')}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder={t('checkout.fullNamePlaceholder')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00] min-h-[42px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      {t('checkout.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder={t('checkout.phonePlaceholder')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00] min-h-[42px] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      {t('checkout.city')}
                    </label>
                    <select
                      value={selectedCityName}
                      onChange={(e) => setSelectedCityName(e.target.value)}
                      className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#CCFF00] min-h-[42px] cursor-pointer"
                    >
                      {MOROCCAN_CITIES.map((city) => (
                        <option key={city.name} value={city.name} className="bg-[#181818] text-white">
                          {lang === 'ar' ? (city.arabicName || city.name) : city.name} ({city.shippingDays})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/80 block mb-1">
                      {t('checkout.address')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Quartier, Boulevard, Rue, N° d'appartement"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00] min-h-[42px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/80 block mb-1">
                    {t('checkout.deliveryNotes')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('checkout.deliveryNotesPlaceholder')}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="w-full p-2.5 bg-[#181818] border border-[#2A2A2A] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#CCFF00] min-h-[42px]"
                  />
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-2.5 pt-3 border-t border-[#222]">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                  <Banknote className="w-4 h-4" /> {t('checkout.step2')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on delivery */}
                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition touch-manipulation min-h-[64px] ${
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
                      className="accent-[#CCFF00] w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#CCFF00]" />
                        <span className="text-xs font-black text-white">{t('checkout.codTitle')}</span>
                      </div>
                      <span className="text-[10px] text-white/50 block mt-0.5">
                        {t('checkout.codDesc')}
                      </span>
                    </div>
                  </label>

                  {/* Credit Card / CMI */}
                  <label
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition touch-manipulation min-h-[64px] ${
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
                      className="accent-[#CCFF00] w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#CCFF00]" />
                        <span className="text-xs font-black text-white">{t('checkout.cardTitle')}</span>
                      </div>
                      <span className="text-[10px] text-white/50 block mt-0.5">
                        {t('checkout.cardDesc')}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Card Inputs if Card chosen */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-black text-[#CCFF00]">
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
                        className="w-full p-2.5 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white font-mono"
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
                          className="w-full p-2.5 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-white/60 block mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2.5 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Order Breakdown */}
              <div className="p-3.5 sm:p-4 bg-[#181818] rounded-2xl border border-[#2A2A2A] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')} ({items.length} items)</span>
                  <span className="font-bold text-white font-mono">{subtotal} {t('currency.mad')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#CCFF00] font-bold">
                    <span>{t('cart.voucher')} ({promoCode || '10%'})</span>
                    <span className="font-mono">-{discountAmount} {t('currency.mad')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('cart.delivery')} ({currentCity.shippingDays})</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? <span className="text-[#CCFF00]">{t('cart.free')}</span> : `${shippingFee} ${t('currency.mad')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-[#262626]">
                  <span>{t('cart.estimatedTotal')}</span>
                  <span className="text-[#CCFF00] font-kvant">{total} {t('currency.mad')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#CCFF00] hover:bg-[#B8E600] disabled:opacity-75 text-black font-black uppercase text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 hover:shadow-[#CCFF00]/25 active:scale-98 cursor-pointer min-h-[48px] touch-manipulation"
              >
                {isSubmitting ? (
                  <span>{t('checkout.packing')}</span>
                ) : (
                  <>
                    <span>
                      {t('checkout.confirmBtn')} ({total} {t('currency.mad')} •{' '}
                      {paymentMethod === 'cod' ? t('checkout.codTitle') : 'Online'})
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
