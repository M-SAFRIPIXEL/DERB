import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Zap, Flame, ArrowRight, ZoomIn } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { ProductCard } from './ProductCard';
import { DoodleArrow } from './GraffitiEmblems';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  initialCategory?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'gsm'>('featured');
  const [isSpotlightZoomed, setIsSpotlightZoomed] = useState<boolean>(false);
  const [spotlightZoomPos, setSpotlightZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleSpotlightMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const filterTabs = [
    { id: 'all', label: 'All Drops' },
    { id: 'hoodies', label: 'Heavyweight Hoodies' },
    { id: 't-shirts', label: 'Oversized Tees' },
    { id: 'pants', label: 'Bottoms & Cargo' },
    { id: 'arabic-typography', label: 'Arabic Typography' },
    { id: 'limited', label: 'Limited Drops' },
  ];

  const shadowHoodieProduct = products.find((p) => p.id === 'prod-shadow-hoodie-limited') || products[0];

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (selectedCategory === 'all') return true;
      return p.category === selectedCategory;
    });

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.priceMAD - b.priceMAD);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceMAD - a.priceMAD);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'gsm':
        result.sort((a, b) => b.gsm - a.gsm);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <section id="shop" className="py-14 sm:py-20 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Spotlight Banner: "LIMITED DROP SHADOW HOODIE" matching center screen in image */}
        <div
          onClick={() => onSelectProduct(shadowHoodieProduct)}
          className="relative bg-gradient-to-r from-[#121212] to-[#1A1A1A] border border-[#2A2A2A] hover:border-[#CCFF00]/60 rounded-3xl p-6 sm:p-8 mb-14 cursor-pointer overflow-hidden shadow-2xl group transition-all"
        >
          {/* Subtle neon spray paint effect on right */}
          <div className="absolute -right-10 top-0 bottom-0 w-80 bg-[#CCFF00]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Copy matching mockup */}
            <div className="md:col-span-7 space-y-2 z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#CCFF00] text-black text-[10px] font-black uppercase rounded font-kvant flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-black" /> LIMITED DROP
                </span>
                <span className="text-xs font-bold text-[#CCFF00] font-mono">
                  ONLY 200 PIECES
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight uppercase">
                SHADOW HOODIE
              </h3>

              <p className="text-xs sm:text-sm text-white/70 max-w-md">
                600GSM ultra-heavyweight fleece with distressed neon X artwork and numbered metallic plaque.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xl font-black text-[#CCFF00] font-kvant">
                  950 MAD
                </span>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-black rounded-xl hover:bg-[#B8E600] transition flex items-center gap-1 font-kvant"
                >
                  <span>CLAIM PIECE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Image Cutout */}
            <div className="md:col-span-5 relative flex justify-center md:justify-end">
              <div
                className="w-44 sm:w-56 aspect-square rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#333] relative cursor-crosshair group/spotlight"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setIsSpotlightZoomed(true);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  setIsSpotlightZoomed(false);
                  setSpotlightZoomPos({ x: 50, y: 50 });
                }}
                onMouseMove={handleSpotlightMouseMove}
              >
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85"
                  alt="Shadow Hoodie Limited Drop"
                  style={{
                    transformOrigin: `${spotlightZoomPos.x}% ${spotlightZoomPos.y}%`,
                    transform: isSpotlightZoomed ? 'scale(2.2)' : 'scale(1)',
                  }}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out will-change-transform"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[#CCFF00] text-[9px] font-black rounded font-mono z-10">
                  600GSM
                </span>
                <div
                  className={`absolute top-2 right-2 z-10 pointer-events-none transition-all duration-300 ${
                    isSpotlightZoomed ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className="px-2 py-0.5 bg-black/90 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-[8px] font-black rounded uppercase tracking-wider flex items-center gap-1 font-mono">
                    <ZoomIn className="w-2.5 h-2.5" /> 2.2X ZOOM
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header: "Best Sellers" matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-1 font-kvant">
              <Flame className="w-3.5 h-3.5 fill-[#CCFF00]" /> DROP CATALOG
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
              Best Sellers
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-xs font-medium">
            Heavyweight streetwear crafted in Casablanca. Delivered across Morocco with COD.
          </p>
        </div>

        {/* Filter Tabs & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-[#222] pb-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition font-kvant flex-shrink-0 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20'
                    : 'bg-[#141414] border border-[#242424] text-white/70 hover:border-[#CCFF00]/40 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs font-bold text-white/50 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#CCFF00]" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-[#141414] border border-[#242424] rounded-xl text-xs font-bold text-white focus:outline-[#CCFF00] cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated (★ 4.9+)</option>
              <option value="gsm">Heaviest GSM</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
