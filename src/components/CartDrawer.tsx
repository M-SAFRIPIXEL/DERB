import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Sparkles,
} from 'lucide-react';
import { CartItem } from '../types';
import { DerbLogo } from './DerbLogo';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => boolean;
  discountPercentage: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  discountPercentage,
}) => {
  const { t, lang, dir } = useLanguage();
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500;
  const subtotal = items.reduce((acc, item) => acc + item.product.priceMAD * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const eligibleForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = eligibleForFreeShipping || items.length === 0 ? 0 : 30;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim());
    if (success) {
      setPromoMessage({ text: t('cart.promoApplied'), isError: false });
    } else {
      setPromoMessage({ text: t('cart.promoInvalid'), isError: true });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex justify-end animate-fade-in"
      dir={dir}
    >
      <div className="w-full sm:max-w-md bg-[#121212] h-full shadow-2xl flex flex-col border-l border-[#262626] text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between bg-[#161616] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#CCFF00] text-black flex items-center justify-center font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base font-arabic uppercase text-white tracking-wider">
                {t('cart.title')}
              </h2>
              <p className="text-[11px] text-[#CCFF00] font-mono">
                {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={t('action.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-3.5 sm:p-4 bg-[#181818] border-b border-[#242424] shrink-0 font-arabic">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-white/80">
              <Truck className="w-3.5 h-3.5 text-[#CCFF00]" />
              {eligibleForFreeShipping ? (
                <span className="text-[#CCFF00] font-bold">
                  {t('cart.freeShippingUnlocked')}
                </span>
              ) : (
                <span>
                  {t('cart.addMoreForFree')} <strong className="text-[#CCFF00] font-mono">{amountNeededForFreeShipping} {t('currency.mad')}</strong> {t('cart.forFreeShipping')}
                </span>
              )}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              500 {t('currency.mad')}
            </span>
          </div>
          <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#CCFF00] h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 font-arabic">
              <div className="p-4 bg-[#141414] rounded-2xl border border-[#222]">
                <DerbLogo className="h-12 w-auto drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]" />
              </div>
              <div>
                <h3 className="font-black text-base uppercase text-white">{t('cart.empty')}</h3>
                <p className="text-xs text-white/60 max-w-xs mt-1">
                  {t('cart.emptyDesc')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#CCFF00] text-black font-black text-xs uppercase rounded-xl shadow-md hover:bg-[#B8E600] transition min-h-[44px] touch-manipulation"
              >
                {t('cart.discoverDrops')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-[#181818] rounded-xl border border-[#262626] shadow-sm relative group"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[item.selectedColor.imageIndex] || item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-20 sm:w-18 sm:h-22 object-cover rounded-lg bg-[#0A0A0A] flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-white truncate pr-2 pl-2">
                        {lang === 'ar' ? item.product.arabicName : item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-white/40 hover:text-red-400 transition p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-black bg-[#CCFF00] text-black px-1.5 py-0.5 rounded font-kvant">
                        {item.selectedSize}
                      </span>
                      <span className="text-[10px] text-white/60 flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center bg-[#121212] border border-[#2A2A2A] rounded-lg">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 text-xs font-bold flex items-center justify-center hover:bg-[#222] rounded-l-lg text-white touch-manipulation min-h-[32px] min-w-[32px]"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white font-mono">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 text-xs font-bold flex items-center justify-center hover:bg-[#222] rounded-r-lg text-white touch-manipulation min-h-[32px] min-w-[32px]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#CCFF00] font-kvant">
                        {item.product.priceMAD * item.quantity}{' '}
                        <span className="text-[10px] text-white">{t('currency.mad')}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action (Sticky on Mobile) */}
        {items.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-[#161616] border-t border-[#262626] space-y-2.5 pb-safe shrink-0 font-arabic">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromoCode} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('cart.promoPlaceholder')}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 text-xs bg-[#1F1F1F] border border-[#2E2E2E] rounded-lg uppercase font-bold text-white focus:outline-[#CCFF00] min-h-[40px]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-black uppercase rounded-lg hover:bg-[#B8E600] transition min-h-[40px] touch-manipulation"
              >
                {t('cart.applyPromo')}
              </button>
            </form>

            {promoMessage && (
              <p
                className={`text-[11px] font-bold ${
                  promoMessage.isError ? 'text-rose-400' : 'text-[#CCFF00]'
                }`}
              >
                {promoMessage.text}
              </p>
            )}

            {appliedPromo && !promoMessage && (
              <div className="flex items-center justify-between text-xs text-[#CCFF00] font-bold bg-[#CCFF00]/10 border border-[#CCFF00]/20 px-2.5 py-1 rounded-md">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> '{appliedPromo}' (10% OFF)
                </span>
                <span className="font-mono">-{discountAmount} {t('currency.mad')}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-white/70 pt-1">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-white font-mono">{subtotal} {t('currency.mad')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#CCFF00] font-bold">
                  <span>{t('cart.voucher')}</span>
                  <span className="font-mono">-{discountAmount} {t('currency.mad')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('cart.delivery')}</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-[#CCFF00]">{t('cart.free')}</span>
                  ) : (
                    <span className="font-mono">{shippingFee} {t('currency.mad')}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-[#262626]">
                <span>{t('cart.estimatedTotal')}</span>
                <span className="text-[#CCFF00] text-base font-kvant">{total} {t('currency.mad')}</span>
              </div>
            </div>

            {/* Cash on delivery notice */}
            <div className="p-2 bg-[#1C1C1C] rounded-lg border border-[#2E2E2E] flex items-center gap-2 text-[11px] text-white/80 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0" />
              <span>{t('cart.codNotice')}</span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black text-xs sm:text-sm font-black uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:shadow-[#CCFF00]/30 active:scale-98 cursor-pointer min-h-[46px] touch-manipulation"
            >
              <span>{t('cart.proceedCheckout')} ({total} {t('currency.mad')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
