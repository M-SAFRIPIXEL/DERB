import React, { useState } from 'react';
import { Heart, Plus, Check, Star, Zap, Eye, Sparkles, ZoomIn } from 'lucide-react';
import { Product, ProductColor } from '../types';

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
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isImageHovered, setIsImageHovered] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [addedJustNow, setAddedJustNow] = useState<boolean>(false);

  const currentImage = product.images[selectedColor.imageIndex] || product.images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setAddedJustNow(true);
    setTimeout(() => {
      setAddedJustNow(false);
      setShowQuickAdd(false);
    }, 1400);
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
      className="group relative bg-[#141414] rounded-2xl p-3 sm:p-4 border border-[#242424] hover:border-[#CCFF00]/40 shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Top Badges Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.isLimitedEdition && (
          <span className="px-2.5 py-0.5 bg-[#CCFF00] text-black text-[10px] font-black rounded-sm uppercase tracking-wider font-kvant flex items-center gap-1">
            <Zap className="w-3 h-3 fill-black" /> ONLY 200 PCS
          </span>
        )}
        {product.isBestSeller && !product.isLimitedEdition && (
          <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-[#CCFF00] border border-[#CCFF00]/30 text-[10px] font-black rounded-sm uppercase font-kvant">
            BEST SELLER
          </span>
        )}
        {product.gsm && (
          <span className="px-2 py-0.5 bg-[#1F1F1F] text-white/80 text-[9px] font-bold rounded-sm font-mono tracking-wider">
            {product.gsm}GSM
          </span>
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
        className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-[#CCFF00] text-black'
            : 'bg-black/60 text-white/80 hover:bg-black hover:text-[#CCFF00]'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container with Fabric Texture Hover-Zoom */}
      <div
        className="relative w-full aspect-4/5 rounded-xl bg-[#0D0D0D] overflow-hidden mb-3.5 flex items-center justify-center cursor-crosshair group/image select-none"
        onMouseEnter={() => setIsImageHovered(true)}
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

        {/* Floating Fabric Zoom Inspection Pill */}
        <div
          className={`absolute bottom-2.5 left-2.5 z-20 pointer-events-none transition-all duration-300 ${
            isImageHovered && !showQuickAdd
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-xl">
            <ZoomIn className="w-3 h-3 text-[#CCFF00] animate-pulse" />
            <span>2.2X FABRIC ZOOM ({product.gsm || 500}GSM)</span>
          </span>
        </div>

        {/* Subtle Quick View Click Hint on Card Hover */}
        <div
          className={`absolute bottom-2.5 right-2.5 z-20 pointer-events-none transition-all duration-300 ${
            isHovered && !isImageHovered && !showQuickAdd
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-white/80 border border-white/10 text-[9px] font-bold rounded-md flex items-center gap-1 font-kvant">
            <Eye className="w-3 h-3 text-[#CCFF00]" /> INSPECT
          </span>
        </div>

        {/* Quick Add Size Tray Overlay */}
        {showQuickAdd && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-2 bottom-2 p-3 bg-[#181818]/95 backdrop-blur-md rounded-xl border border-[#CCFF00]/30 shadow-2xl flex flex-col gap-2 z-30 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#CCFF00] uppercase font-kvant">
                Select Size
              </span>
              <span className="text-[10px] text-white/50">{selectedSize}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition font-kvant ${
                    selectedSize === sz
                      ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                      : 'bg-[#222] text-white border-transparent hover:border-white/20'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-2 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 transition uppercase font-kvant ${
                addedJustNow
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#CCFF00] text-black hover:bg-[#B8E600]'
              }`}
            >
              {addedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added!
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add ({product.priceMAD} MAD)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="uppercase tracking-wider font-bold text-white/40 text-[10px] font-mono">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-[#CCFF00] text-[11px] font-bold">
              <Star className="w-3 h-3 fill-[#CCFF00]" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Arabic Subtitle */}
          <p dir="rtl" className="text-xs sm:text-sm text-[#CCFF00]/90 font-arabic font-bold line-clamp-1 mb-2 tracking-normal">
            {product.arabicName}
          </p>
        </div>

        {/* Bottom Price & Add Button matching image */}
        <div className="pt-2 border-t border-[#242424] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[#CCFF00] font-kvant">
                {product.priceMAD} <span className="text-xs font-bold text-white">MAD</span>
              </span>
              {product.originalPriceMAD && (
                <span className="text-xs text-white/40 line-through">
                  {product.originalPriceMAD}
                </span>
              )}
            </div>
            <span className="text-[9px] text-emerald-400 font-medium block">
              COD Available (الدفع عند الاستلام)
            </span>
          </div>

          {/* Plus Quick Action button matching the mockup */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickAdd(!showQuickAdd);
            }}
            className="w-8 h-8 rounded-lg bg-[#222] hover:bg-[#CCFF00] text-white hover:text-black transition-all flex items-center justify-center font-bold"
            title="Quick Add"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
