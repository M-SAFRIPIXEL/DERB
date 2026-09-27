import React, { useState } from 'react';
import { Heart, Plus, Check, Star, Zap, Eye, ZoomIn, PackageX, Ban } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { t, lang } = useLanguage();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Black', hex: '#000', bgClass: 'bg-black', imageIndex: 0 });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0] || 'L');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [addedJustNow, setAddedJustNow] = useState<boolean>(false);

  const currentImage = (product.images && product.images[selectedColor?.imageIndex ?? 0]) || product.images?.[0] || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!product.inStock) return;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    }
  };

  const handleMouseEnter = () => {
    if (!product.inStock) return;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsImageHovered(true);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, selectedSize, selectedColor);
    setAddedJustNow(true);
    setTimeout(() => {
      setAddedJustNow(false);
      setShowQuickAdd(false);
    }, 1200);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsImageHovered(false);
        setShowQuickAdd(false);
        setZoomPos({ x: 50, y: 50 });
      }}
      onClick={() => onSelectProduct(product)}
      className={`group relative bg-[#141414] rounded-2xl p-2.5 sm:p-4 border transition-all duration-300 flex flex-col cursor-pointer overflow-hidden active:scale-[0.99] touch-manipulation ${
        !product.inStock
          ? 'border-[#222] opacity-80 hover:opacity-100 hover:border-amber-500/30'
          : 'border-[#242424] hover:border-[#CCFF00]/40 shadow-lg hover:shadow-2xl'
      }`}
    >
      {/* Top Badges Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 pointer-events-none">
        {!product.inStock ? (
          <span className="px-2 py-0.5 bg-neutral-900/90 text-amber-400 border border-amber-500/40 text-[9px] sm:text-[10px] font-black rounded-sm uppercase font-arabic shadow-md flex items-center gap-1">
            <Ban className="w-2.5 h-2.5" />
            {lang === 'ar' ? 'غير متاح الآن' : 'Currently Unavailable'}
          </span>
        ) : (
          <>
            <span className="px-2 py-0.5 bg-[#CCFF00] text-black text-[9px] sm:text-[10px] font-black rounded-sm uppercase tracking-wider font-kvant flex items-center gap-1 shadow-md">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-black" />
              250GSM • 100% COTTON
            </span>
            {product.isBestSeller && (
              <span className="px-2 py-0.5 bg-black/85 backdrop-blur-md text-[#CCFF00] border border-[#CCFF00]/30 text-[9px] sm:text-[10px] font-black rounded-sm uppercase font-kvant shadow-md">
                {t('product.bestSeller')}
              </span>
            )}
          </>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        aria-label="Wishlist"
        className={`absolute top-2.5 right-2.5 z-20 min-w-[38px] min-h-[38px] rounded-full flex items-center justify-center transition-all shadow-md touch-manipulation ${
          isWishlisted
            ? 'bg-[#CCFF00] text-black'
            : 'bg-black/60 text-white/80 hover:bg-black hover:text-[#CCFF00] active:scale-90'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Visual / Image Container: If NOT inStock, do NOT show images, show 'غير متاح الآن' */}
      {!product.inStock ? (
        <div className="relative w-full aspect-4/5 rounded-xl bg-[#111111] border border-[#222] overflow-hidden mb-2.5 sm:mb-3.5 flex flex-col items-center justify-center p-4 text-center select-none group-hover:border-amber-500/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-center mb-2.5 text-white/30 group-hover:text-amber-400/80 transition-colors">
            <PackageX className="w-6 h-6 stroke-[1.5]" />
          </div>
          <span className="px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[11px] sm:text-xs font-black uppercase font-arabic tracking-wider mb-1">
            {lang === 'ar' ? 'غير متاح الآن' : 'Currently Unavailable'}
          </span>
          <span className="text-[10px] text-white/40 font-arabic font-medium">
            {lang === 'ar' ? 'سيتوفر في الإصدار القادم' : 'Coming in Next Drop'}
          </span>
        </div>
      ) : (
        <div
          className="relative w-full aspect-4/5 rounded-xl bg-[#0D0D0D] overflow-hidden mb-2.5 sm:mb-3.5 flex items-center justify-center select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {
            setIsImageHovered(false);
            setZoomPos({ x: 50, y: 50 });
          }}
          onMouseMove={handleMouseMove}
        >
          <img
            src={currentImage}
            alt={product.name}
            loading="lazy"
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isImageHovered ? 'scale(2.2)' : 'scale(1)',
            }}
            className="w-full h-full object-cover object-center transition-transform duration-200 ease-out will-change-transform opacity-95 group-hover:opacity-100"
          />

          {/* Floating Fabric Zoom Inspection Pill (Desktop) */}
          <div
            className={`hidden md:block absolute bottom-2.5 left-2.5 z-20 pointer-events-none transition-all duration-300 ${
              isImageHovered && !showQuickAdd
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-xl">
              <ZoomIn className="w-3 h-3 text-[#CCFF00] animate-pulse" />
              <span>2.2X FABRIC (250GSM 100% COTTON)</span>
            </span>
          </div>

          {/* Quick View Click Hint on Card Hover */}
          <div
            className={`hidden md:block absolute bottom-2.5 right-2.5 z-20 pointer-events-none transition-all duration-300 ${
              isHovered && !isImageHovered && !showQuickAdd
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-white/80 border border-white/10 text-[9px] font-bold rounded-md flex items-center gap-1 font-kvant">
              <Eye className="w-3 h-3 text-[#CCFF00]" /> {t('product.inspect')}
            </span>
          </div>

          {/* Quick Add Size Tray Overlay */}
          {showQuickAdd && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-1.5 bottom-1.5 p-2 sm:p-3 bg-[#161616]/98 backdrop-blur-md rounded-xl border border-[#CCFF00]/40 shadow-2xl flex flex-col gap-1.5 z-30 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black text-[#CCFF00] uppercase font-kvant">
                  {t('product.size')}
                </span>
                <span className="text-[9px] text-white/70 font-bold">{selectedSize}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-1.5 sm:px-2 py-1 text-[9px] sm:text-[10px] font-bold rounded border transition font-kvant min-h-[30px] flex-1 min-w-[28px] ${
                      selectedSize === sz
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-[#222] text-white border-transparent hover:border-white/20 active:scale-95'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleQuickAdd}
                className={`w-full py-2 text-[10px] sm:text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition uppercase font-kvant min-h-[36px] active:scale-95 ${
                  addedJustNow
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#CCFF00] text-black hover:bg-[#B8E600]'
                }`}
              >
                {addedJustNow ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Added!
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" /> {t('product.add')} ({product.priceMAD} MAD)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-0.5">
            <span className="uppercase tracking-wider font-bold text-white/40 text-[9px] sm:text-[10px] font-mono truncate">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-0.5 text-[#CCFF00] text-[10px] sm:text-[11px] font-bold shrink-0">
              <Star className="w-3 h-3 fill-[#CCFF00]" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1">
            {lang === 'ar' ? product.arabicName : product.name}
          </h3>

          {/* Subtitle */}
          <p className="text-[11px] sm:text-xs text-[#CCFF00]/85 font-arabic font-semibold line-clamp-1 mb-1.5">
            {lang === 'ar' ? product.name : product.arabicName}
          </p>
        </div>

        {/* Bottom Price & Action */}
        <div className="pt-2 border-t border-[#242424] flex items-center justify-between">
          {!product.inStock ? (
            <div className="w-full py-1.5 flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 font-arabic flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'غير متاح الآن' : 'Not Available'}
              </span>
              <span className="text-[10px] text-white/40 font-mono uppercase">
                {lang === 'ar' ? 'سيتوفر قريباً' : 'Next Drop'}
              </span>
            </div>
          ) : (
            <>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base font-black text-[#CCFF00] font-kvant">
                    {product.priceMAD} <span className="text-[10px] sm:text-xs font-bold text-white font-sans">MAD</span>
                  </span>
                  {product.originalPriceMAD && (
                    <span className="text-[10px] sm:text-xs text-white/40 line-through">
                      {product.originalPriceMAD}
                    </span>
                  )}
                </div>
                <span className="text-[8px] sm:text-[9px] text-emerald-400 font-medium block">
                  {t('product.cod')}
                </span>
              </div>

              {/* Plus Quick Action button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQuickAdd(!showQuickAdd);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#222] hover:bg-[#CCFF00] text-white hover:text-black transition-all flex items-center justify-center font-bold active:scale-90 touch-manipulation min-h-[36px] min-w-[36px]"
                title={t('product.quickAdd')}
                aria-label={t('product.quickAdd')}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
