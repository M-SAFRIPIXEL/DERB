import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { DerbLogo } from './DerbLogo';
import { useLanguage } from '../context/LanguageContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const { t, lang, dir } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/85 backdrop-blur-sm flex justify-end animate-fade-in"
      dir={dir}
    >
      <div className="w-full sm:max-w-md bg-[#121212] h-full shadow-2xl flex flex-col border-l border-[#262626] text-white pb-safe">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between bg-[#161616] shrink-0 font-arabic">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#CCFF00] text-black flex items-center justify-center">
              <Heart className="w-4 h-4 fill-black" />
            </div>
            <div>
              <h2 className="font-black text-sm sm:text-base font-arabic uppercase text-white tracking-wider">
                {t('wishlist.title')}
              </h2>
              <p className="text-[11px] text-[#CCFF00] font-mono">
                {wishlist.length} {wishlist.length === 1 ? 'Piece' : 'Pieces'}
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

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 font-arabic">
              <div className="p-4 bg-[#141414] rounded-2xl border border-[#222]">
                <DerbLogo className="h-12 w-auto drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]" />
              </div>
              <div>
                <h3 className="font-black text-base uppercase text-white">{t('wishlist.empty')}</h3>
                <p className="text-xs text-white/60 max-w-xs mt-1">
                  {t('wishlist.emptyDesc')}
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
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-[#181818] rounded-xl border border-[#262626] shadow-sm relative group"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="w-16 h-20 sm:w-18 sm:h-22 object-cover rounded-lg bg-[#0A0A0A] cursor-pointer flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0 font-arabic">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="font-bold text-xs text-white truncate pr-2 pl-2 cursor-pointer hover:text-[#CCFF00]"
                      >
                        {lang === 'ar' ? product.arabicName : product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-white/40 hover:text-red-400 transition p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-[#CCFF00] font-mono block mt-0.5">
                      {product.gsm}GSM Fleece
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-black text-[#CCFF00] font-kvant">
                      {product.priceMAD} <span className="text-[10px] text-white font-sans">{t('currency.mad')}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product);
                      }}
                      className="px-3 py-1.5 bg-[#CCFF00] text-black text-[11px] font-black uppercase rounded-lg hover:bg-[#B8E600] transition flex items-center gap-1 font-arabic min-h-[34px] touch-manipulation active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" /> {t('wishlist.moveToBag')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
