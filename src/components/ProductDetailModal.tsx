import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Check,
  ChevronRight,
  Zap,
  MapPin,
  ZoomIn,
  PackageX,
  Ban,
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { MOROCCAN_CITIES, PRODUCTS_DATA } from '../data/products';
import { SizeGuideModal } from './SizeGuideModal';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
}) => {
  if (!product) return null;

  const { t, lang, dir } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('Casablanca');
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsImageZoomed(true);
    }
  };

  const handleColorChange = (c: ProductColor) => {
    setSelectedColor(c);
    if (c.imageIndex !== undefined && product.images[c.imageIndex]) {
      setActiveImageIndex(c.imageIndex);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
    }, 1800);
  };

  const currentCityInfo =
    MOROCCAN_CITIES.find((c) => c.name.includes(selectedCity)) || MOROCCAN_CITIES[0];

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in"
        dir={dir}
      >
        <div className="relative bg-[#121212] border border-[#2A2A2A] rounded-t-3xl sm:rounded-3xl w-full max-w-5xl h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden">
          {/* Top Bar with Close & Wishlist */}
          <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-[#222] bg-[#161616]/90 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#CCFF00] tracking-widest uppercase font-kvant">
                PHILOSTORYA // {product.categoryLabel}
              </span>
              {product.gsm && (
                <span className="px-2 py-0.5 bg-[#222] text-white/80 text-[10px] font-bold rounded font-mono">
                  {product.gsm}GSM
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full border border-white/10 transition shadow-sm min-h-[40px] min-w-[40px] flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                    : 'bg-[#1F1F1F] text-white/80 hover:text-[#CCFF00]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={onClose}
                className="p-2 bg-[#1F1F1F] hover:bg-[#CCFF00] text-white hover:text-black rounded-full border border-white/10 shadow-sm transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label={t('action.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Modal Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-32 sm:pb-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* Left: Gallery (6 cols) */}
              <div className="lg:col-span-6 flex flex-col gap-3">
                {!product.inStock ? (
                  /* Unavailable placeholder without pictures as requested */
                  <div className="relative w-full aspect-4/5 rounded-2xl bg-[#141414] border border-[#242424] overflow-hidden flex flex-col items-center justify-center p-8 text-center select-none shadow-inner">
                    <div className="w-16 h-16 rounded-3xl bg-[#1E1E1E] border border-white/5 flex items-center justify-center mb-4 text-amber-400">
                      <PackageX className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <span className="px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-sm font-black uppercase font-arabic tracking-wider mb-2">
                      {lang === 'ar' ? 'غير متاح الآن' : 'Currently Unavailable'}
                    </span>
                    <p className="text-xs text-white/50 font-arabic max-w-xs leading-relaxed">
                      {lang === 'ar'
                        ? 'هذا المنتج غير متاح للطلب حالياً. يمكنك تصفح مجموعة التيشورتات المتاحة الآن.'
                        : 'This product is currently out of stock. Please browse our active T-Shirt collection.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Main Image Container */}
                    <div
                      className="relative w-full aspect-4/5 rounded-2xl bg-[#0A0A0A] border border-[#242424] overflow-hidden shadow-inner group select-none flex items-center justify-center"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={() => {
                        setIsImageZoomed(false);
                        setZoomPos({ x: 50, y: 50 });
                      }}
                      onMouseMove={handleMouseMove}
                    >
                      <img
                        src={product.images[activeImageIndex] || product.images[0]}
                        alt={product.name}
                        style={{
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                          transform: isImageZoomed ? 'scale(2.4)' : 'scale(1)',
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-200 ease-out will-change-transform"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
                        <span className="px-2.5 py-1 bg-[#CCFF00] text-black text-[10px] font-black rounded-sm uppercase tracking-wider font-kvant shadow-md">
                          250GSM • 100% COTTON
                        </span>
                        {product.isBestSeller && (
                          <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md text-[#CCFF00] border border-[#CCFF00]/40 text-[10px] font-black rounded-sm uppercase font-kvant flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-[#CCFF00]" /> BEST SELLER
                          </span>
                        )}
                      </div>

                      {/* Fabric zoom indicator (Desktop only) */}
                      <div
                        className={`hidden md:block absolute bottom-3 left-3 z-20 pointer-events-none transition-all duration-300 ${
                          isImageZoomed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                        }`}
                      >
                        <span className="px-3 py-1 bg-black/90 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-2xl">
                          <ZoomIn className="w-3.5 h-3.5 text-[#CCFF00] animate-pulse" />
                          <span>2.4X FABRIC ZOOM (250GSM)</span>
                        </span>
                      </div>
                    </div>

                    {/* Thumbnails Strip */}
                    {product.images && product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                        {product.images.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#0A0A0A] touch-manipulation min-h-[44px] ${
                              activeImageIndex === idx
                                ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/30'
                                : 'border-[#222] opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Moroccan Guarantees Mini Banner */}
                <div className="grid grid-cols-3 gap-2 mt-1 pt-3 border-t border-[#242424] text-center">
                  <div className="p-2 sm:p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                    <Truck className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-black text-white block uppercase font-arabic">
                      {t('product.guaranteeCod')}
                    </span>
                    <span className="text-[9px] text-white/50">24-48h Morocco</span>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                    <ShieldCheck className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-black text-white block uppercase font-arabic">
                      {t('product.guaranteeCotton')}
                    </span>
                    <span className="text-[9px] text-white/50">Casablanca</span>
                  </div>
                  <div className="p-2 sm:p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                    <RotateCcw className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                    <span className="text-[10px] sm:text-[11px] font-black text-white block uppercase font-arabic">
                      {t('product.guaranteeExchange')}
                    </span>
                    <span className="text-[9px] text-white/50">Free Swap</span>
                  </div>
                </div>
              </div>

              {/* Right: Product Info & Buy Controls (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#CCFF00] text-[#CCFF00]" />
                      <span className="font-black text-white">{product.rating}</span>
                      <span className="text-white/40">({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-xl sm:text-3xl font-black font-display text-white tracking-tight mb-1 uppercase">
                    {lang === 'ar' ? product.arabicName : product.name}
                  </h1>
                  <p className="text-base sm:text-xl text-[#CCFF00] font-arabic font-extrabold tracking-normal mb-3">
                    {lang === 'ar' ? product.name : product.arabicName}
                  </p>

                  {/* Price Display */}
                  <div className="flex items-baseline gap-3 p-3 sm:p-3.5 bg-[#181818] rounded-2xl border border-[#282828] mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-[#CCFF00] font-kvant">
                        {product.priceMAD}
                      </span>
                      <span className="text-sm font-bold text-white">MAD</span>
                    </div>
                    {product.originalPriceMAD && (
                      <span className="text-xs sm:text-sm text-white/40 line-through">
                        {product.originalPriceMAD} MAD
                      </span>
                    )}
                    <span className="mr-auto ml-auto sm:mr-0 text-[10px] sm:text-xs px-2.5 py-1 bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 rounded-full font-bold">
                      ✓ {t('product.inStock')} ({product.stockCount} {t('product.piecesLeft')})
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider font-arabic">
                        {t('product.colorway')} <span className="text-[#CCFF00]">{selectedColor.name}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleColorChange(c)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition touch-manipulation min-h-[40px] ${
                            selectedColor.name === c.name
                              ? 'border-[#CCFF00] bg-[#1E1E1E] ring-2 ring-[#CCFF00]/30 text-[#CCFF00]'
                              : 'border-[#262626] bg-[#141414] text-white/70 hover:border-white/30'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider font-arabic">
                        {t('product.size')} <span className="text-[#CCFF00] font-bold">{selectedSize}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSizeGuide(true)}
                        className="text-xs font-black text-[#CCFF00] hover:underline flex items-center gap-1 font-arabic min-h-[36px] touch-manipulation"
                      >
                        <Ruler className="w-3.5 h-3.5" /> {t('product.sizeGuide')}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`py-2.5 text-xs font-black rounded-xl border transition-all font-kvant min-h-[44px] touch-manipulation active:scale-95 ${
                            selectedSize === sz
                              ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-md shadow-[#CCFF00]/20'
                              : 'bg-[#181818] text-white border-[#2A2A2A] hover:border-white/30'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/50 mt-1.5 font-mono">
                      Fit: <span className="font-bold text-white">{product.fit}</span>
                    </p>
                  </div>

                  {/* City Delivery Estimator */}
                  <div className="p-3 bg-[#181818] rounded-xl border border-[#282828] mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#CCFF00]" />
                      <span className="text-xs font-semibold text-white/70 font-arabic">{t('product.shippingTo')}</span>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="text-xs font-bold text-[#CCFF00] bg-transparent border-b border-[#CCFF00] focus:outline-none cursor-pointer"
                      >
                        {MOROCCAN_CITIES.map((city) => (
                          <option key={city.name} value={city.name} className="bg-[#181818] text-white">
                            {lang === 'ar' ? (city.arabicName || city.name) : city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400">
                      {currentCityInfo.shippingDays}
                    </span>
                  </div>
                </div>

                {/* Product Tabs (Specs, Care, Reviews) */}
                <div className="border-t border-[#242424] pt-4 mt-2">
                  <div className="flex gap-4 border-b border-[#242424] pb-2 mb-3 font-arabic">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`text-xs font-black uppercase tracking-wider pb-1 transition min-h-[36px] ${
                        activeTab === 'details'
                          ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {t('product.specs')}
                    </button>
                    <button
                      onClick={() => setActiveTab('care')}
                      className={`text-xs font-black uppercase tracking-wider pb-1 transition min-h-[36px] ${
                        activeTab === 'care'
                          ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {t('product.care')}
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`text-xs font-black uppercase tracking-wider pb-1 transition min-h-[36px] ${
                        activeTab === 'reviews'
                          ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {t('product.reviews')} ({product.reviewsCount})
                    </button>
                  </div>

                  {activeTab === 'details' && (
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc pr-4 pl-4 font-arabic">
                      {product.details.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                      <li>كثافة القماش: {product.gsm}GSM قطن فاخر</li>
                      <li>المنشأ: صُمم وحيك في مشغل الدار البيضاء، المغرب</li>
                    </ul>
                  )}

                  {activeTab === 'care' && (
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc pr-4 pl-4 font-arabic">
                      {product.careInstructions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                      <li>يُفضل التجفيف الطبيعي للحفاظ على قوام القطن الثقيل 500GSM</li>
                    </ul>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-2 text-xs font-arabic">
                      <div className="p-3 bg-[#181818] rounded-xl border border-[#242424]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white">حمزة ب. (الرباط)</span>
                          <div className="flex text-[#CCFF00]">★★★★★</div>
                        </div>
                        <p className="text-white/70">
                          "ثوب 500GSM ثقيل ومخدوم باتقان. تقطيعة Oversized والكاليغرافي واعرين بزاف."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="pt-6 border-t border-[#242424]">
              <div className="flex items-center justify-between mb-3 font-arabic">
                <h3 className="text-base sm:text-lg font-black font-display text-white uppercase">
                  {t('product.completeLook')}
                </h3>
                <span className="text-xs text-[#CCFF00] font-mono">
                  {t('product.pairings')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectProduct(rel)}
                    className="flex items-center gap-3 p-2.5 bg-[#181818] rounded-xl border border-[#262626] hover:border-[#CCFF00]/40 cursor-pointer transition active:scale-98"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-12 h-14 object-cover rounded-lg bg-[#0A0A0A]"
                    />
                    <div className="flex-1 min-w-0 font-arabic">
                      <h4 className="font-bold text-xs text-white truncate">
                        {lang === 'ar' ? rel.arabicName : rel.name}
                      </h4>
                      <p className="text-[11px] text-[#CCFF00] font-black font-kvant">{rel.priceMAD} MAD</p>
                      <span className="text-[10px] text-white/50">{rel.gsm}GSM</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STICKY BOTTOM ACTION BAR (Mobile & Desktop) */}
          <div className="sticky bottom-0 inset-x-0 bg-[#161616]/98 backdrop-blur-xl border-t border-[#2A2A2A] p-3 sm:p-4 z-40 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center bg-[#1F1F1F] border border-[#2E2E2E] rounded-xl p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-base font-bold flex items-center justify-center hover:bg-[#2A2A2A] text-white min-h-[36px] min-w-[36px] touch-manipulation"
                >
                  -
                </button>
                <span className="w-7 text-center text-xs sm:text-sm font-black text-white font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-base font-bold flex items-center justify-center hover:bg-[#2A2A2A] text-white min-h-[36px] min-w-[36px] touch-manipulation"
                >
                  +
                </button>
              </div>

                {!product.inStock ? (
                  <div className="flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider bg-[#1F1F1F] border border-[#2E2E2E] text-amber-400/80 flex items-center justify-center gap-2 font-arabic min-h-[46px] select-none">
                    <Ban className="w-5 h-5" />
                    <span>{lang === 'ar' ? 'هذا المنتج غير متاح للطلب الآن' : 'Currently Unavailable For Purchase'}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 font-arabic min-h-[46px] touch-manipulation ${
                      isAddedSuccess
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#CCFF00] hover:bg-[#B8E600] text-black shadow-[#CCFF00]/20 hover:shadow-2xl active:scale-98'
                    }`}
                  >
                    {isAddedSuccess ? (
                      <>
                        <Check className="w-5 h-5" /> {t('product.addedToBag')}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 shrink-0" />
                        <span>{t('product.addToBag')} — {product.priceMAD * quantity} {t('currency.mad')}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productName={lang === 'ar' ? product.arabicName : product.name}
        category={product.category}
      />
    </>
  );
};
