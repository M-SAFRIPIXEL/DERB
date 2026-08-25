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
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { MOROCCAN_CITIES, PRODUCTS_DATA } from '../data/products';
import { SizeGuideModal } from './SizeGuideModal';

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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
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
    }, 2000);
  };

  const currentCityInfo =
    MOROCCAN_CITIES.find((c) => c.name.includes(selectedCity)) || MOROCCAN_CITIES[0];

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
        <div className="relative bg-[#121212] border border-[#2A2A2A] rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6 md:p-8 text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 bg-[#1F1F1F] hover:bg-[#CCFF00] text-white hover:text-black rounded-full border border-white/10 shadow-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Grid: Gallery + Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Left: Gallery (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Main Image with Fabric Texture Zoom */}
              <div
                className="relative w-full aspect-4/5 rounded-2xl bg-[#0A0A0A] border border-[#242424] overflow-hidden shadow-inner group cursor-crosshair select-none"
                onMouseEnter={() => setIsImageZoomed(true)}
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

                {/* Floating Fabric Texture Zoom Badge */}
                <div
                  className={`absolute bottom-3 left-3 z-20 pointer-events-none transition-all duration-300 ${
                    isImageZoomed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <span className="px-3 py-1 bg-black/90 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-[10px] font-black rounded-lg uppercase tracking-wider flex items-center gap-1.5 font-mono shadow-2xl">
                    <ZoomIn className="w-3.5 h-3.5 text-[#CCFF00] animate-pulse" />
                    <span>2.4X FABRIC TEXTURE ZOOM ({product.gsm}GSM)</span>
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                  <span className="px-3 py-1 bg-[#CCFF00] text-black text-xs font-black rounded-sm uppercase tracking-wider font-kvant shadow-md">
                    {product.gsm}GSM FLEECE
                  </span>
                  {product.isLimitedEdition && (
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[#CCFF00] border border-[#CCFF00]/40 text-xs font-black rounded-sm uppercase font-kvant flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-[#CCFF00]" /> 200 PIECES DROP
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg ${
                    isWishlisted
                      ? 'bg-[#CCFF00] text-black'
                      : 'bg-black/70 text-white/80 hover:text-[#CCFF00]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Strip */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-[#0A0A0A] ${
                      activeImageIndex === idx
                        ? 'border-[#CCFF00] ring-2 ring-[#CCFF00]/30'
                        : 'border-[#222] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Moroccan Guarantees Mini Banner */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#242424] text-center">
                <div className="p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                  <Truck className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                  <span className="text-[11px] font-black text-white block uppercase font-kvant">Paiement à la livraison</span>
                  <span className="text-[10px] text-white/50">Cash on Delivery</span>
                </div>
                <div className="p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                  <ShieldCheck className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                  <span className="text-[11px] font-black text-white block uppercase font-kvant">100% 500GSM Cotton</span>
                  <span className="text-[10px] text-white/50">Casablanca Atelier</span>
                </div>
                <div className="p-2.5 bg-[#181818] rounded-xl border border-[#262626]">
                  <RotateCcw className="w-4 h-4 text-[#CCFF00] mx-auto mb-1" />
                  <span className="text-[11px] font-black text-white block uppercase font-kvant">14 Days Exchange</span>
                  <span className="text-[10px] text-white/50">Across Morocco</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Buy Controls (6 cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-[#CCFF00] tracking-widest uppercase font-kvant">
                    DERB // {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] text-xs">
                    <Star className="w-3.5 h-3.5 fill-[#CCFF00] text-[#CCFF00]" />
                    <span className="font-black text-white">{product.rating}</span>
                    <span className="text-white/40">({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight mb-1 uppercase">
                  {product.name}
                </h1>
                <p dir="rtl" className="text-xl sm:text-2xl text-[#CCFF00] font-arabic font-extrabold tracking-normal mb-4">
                  {product.arabicName}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-3.5 bg-[#181818] rounded-2xl border border-[#282828] mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#CCFF00] font-kvant">
                      {product.priceMAD}
                    </span>
                    <span className="text-base font-bold text-white">MAD</span>
                  </div>
                  {product.originalPriceMAD && (
                    <span className="text-sm text-white/40 line-through">
                      {product.originalPriceMAD} MAD
                    </span>
                  )}
                  <span className="ml-auto text-xs px-2.5 py-1 bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/30 rounded-full font-bold">
                    ✓ In Stock ({product.stockCount} left)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Color Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      Colorway: <span className="text-[#CCFF00]">{selectedColor.name}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleColorChange(c)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          selectedColor.name === c.name
                            ? 'border-[#CCFF00] bg-[#1E1E1E] ring-2 ring-[#CCFF00]/30 text-[#CCFF00]'
                            : 'border-[#262626] bg-[#141414] text-white/60 hover:border-white/30'
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
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      Size: <span className="text-[#CCFF00] font-bold">{selectedSize}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs font-black text-[#CCFF00] hover:underline flex items-center gap-1 font-kvant"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2.5 text-xs font-black rounded-xl border transition-all font-kvant ${
                          selectedSize === sz
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-md shadow-[#CCFF00]/20'
                            : 'bg-[#181818] text-white border-[#2A2A2A] hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/50 mt-1.5">
                    Fit: <span className="font-bold text-white">{product.fit}</span>
                  </p>
                </div>

                {/* City Delivery Estimator */}
                <div className="p-3 bg-[#181818] rounded-xl border border-[#282828] mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-xs font-semibold text-white/70">Shipping to:</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="text-xs font-bold text-[#CCFF00] bg-transparent border-b border-[#CCFF00] focus:outline-none cursor-pointer"
                    >
                      {MOROCCAN_CITIES.map((city) => (
                        <option key={city.name} value={city.name} className="bg-[#181818] text-white">
                          {city.name} ({city.arabicName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">
                    {currentCityInfo.shippingDays}
                  </span>
                </div>

                {/* Quantity + Add to Cart Row */}
                <div className="flex items-center gap-3 mb-6">
                  {/* Quantity Counter */}
                  <div className="flex items-center bg-[#181818] border border-[#2A2A2A] rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-[#222] text-white"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-[#222] text-white"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 font-kvant ${
                      isAddedSuccess
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#CCFF00] hover:bg-[#B8E600] text-black shadow-[#CCFF00]/20 hover:shadow-xl active:scale-98'
                    }`}
                  >
                    {isAddedSuccess ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Your Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> Add to Bag — {product.priceMAD * quantity} MAD
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="border-t border-[#242424] pt-4">
                <div className="flex gap-4 border-b border-[#242424] pb-2 mb-3">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`text-xs font-black uppercase tracking-wider pb-1 transition font-kvant ${
                      activeTab === 'details'
                        ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`text-xs font-black uppercase tracking-wider pb-1 transition font-kvant ${
                      activeTab === 'care'
                        ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Wash & Care
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`text-xs font-black uppercase tracking-wider pb-1 transition font-kvant ${
                      activeTab === 'reviews'
                        ? 'text-[#CCFF00] border-b-2 border-[#CCFF00]'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Reviews ({product.reviewsCount})
                  </button>
                </div>

                {activeTab === 'details' && (
                  <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4">
                    {product.details.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                    <li>Fabric Weight: {product.gsm} Grams Per Square Meter</li>
                    <li>Origin: Designed and milled in Casablanca Atelier, Morocco</li>
                  </ul>
                )}

                {activeTab === 'care' && (
                  <ul className="text-xs text-white/70 space-y-1.5 list-disc pl-4">
                    {product.careInstructions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                    <li>Air dry flat to preserve heavyweight fabric structure</li>
                  </ul>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-[#181818] rounded-xl border border-[#242424]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white">Hamza B. (Rabat)</span>
                        <div className="flex text-[#CCFF00]">★★★★★</div>
                      </div>
                      <p className="text-white/70">
                        "The 500GSM heavyweight feel is pure perfection. Boxy fit and the calligraphy print is top tier."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-10 pt-6 border-t border-[#242424]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black font-display text-white uppercase">
                Complete the DERB Look
              </h3>
              <span className="text-xs text-[#CCFF00] font-mono">
                500GSM PAIRINGS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="flex items-center gap-3 p-3 bg-[#181818] rounded-xl border border-[#262626] hover:border-[#CCFF00]/40 cursor-pointer transition"
                >
                  <img
                    src={rel.images[0]}
                    alt={rel.name}
                    className="w-14 h-16 object-cover rounded-lg bg-[#0A0A0A]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{rel.name}</h4>
                    <p className="text-[11px] text-[#CCFF00] font-black">{rel.priceMAD} MAD</p>
                    <span className="text-[10px] text-white/50">{rel.gsm}GSM</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        productName={product.name}
        category={product.category}
      />
    </>
  );
};
