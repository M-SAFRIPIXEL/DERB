import React from 'react';
import { Home, Flame, Search, Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  cartCount: number;
  cartTotalMAD: number;
  wishlistCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNavigateHome,
  onNavigateShop,
  onOpenSearch,
  onOpenWishlist,
  onOpenCart,
  cartCount,
  cartTotalMAD,
  wishlistCount,
}) => {
  const { t, dir } = useLanguage();

  return (
    <nav
      aria-label="Mobile Navigation"
      dir={dir}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0E0E0E]/95 backdrop-blur-xl border-t border-[#262626] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] transition-all select-none"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1 text-center">
        {/* Home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-white/70 active:text-[#CCFF00] hover:text-white transition active:scale-90 touch-manipulation min-h-[44px]"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold font-arabic tracking-tight">{t('nav.home')}</span>
        </button>

        {/* Drops / Shop */}
        <button
          type="button"
          onClick={onNavigateShop}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-white/70 active:text-[#CCFF00] hover:text-white transition active:scale-90 touch-manipulation min-h-[44px]"
        >
          <div className="relative">
            <Flame className="w-5 h-5 mb-0.5 text-[#CCFF00]" />
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
          </div>
          <span className="text-[10px] font-black font-arabic tracking-tight text-[#CCFF00]">{t('nav.drops')}</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-white/70 active:text-[#CCFF00] hover:text-white transition active:scale-90 touch-manipulation min-h-[44px]"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold font-arabic tracking-tight">{t('nav.search')}</span>
        </button>

        {/* Wishlist */}
        <button
          type="button"
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-white/70 active:text-[#CCFF00] hover:text-white transition active:scale-90 relative touch-manipulation min-h-[44px]"
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#CCFF00] text-black text-[9px] font-black flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold font-arabic tracking-tight">{t('nav.wishlist')}</span>
        </button>

        {/* Cart Bag */}
        <button
          type="button"
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl bg-gradient-to-b from-[#1C1C1C] to-[#121212] border border-[#CCFF00]/40 text-[#CCFF00] active:scale-95 shadow-md hover:border-[#CCFF00] transition touch-manipulation min-h-[44px]"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 mb-0.5 text-[#CCFF00]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-[#CCFF00] text-black text-[9px] font-black flex items-center justify-center font-mono shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black font-mono leading-none mt-0.5 truncate max-w-[54px]">
            {cartTotalMAD > 0 ? `${cartTotalMAD} MAD` : t('nav.cart')}
          </span>
        </button>
      </div>
    </nav>
  );
};
