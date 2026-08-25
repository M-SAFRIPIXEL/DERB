import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES_DATA } from '../data/products';
import { GraffitiCrown } from './GraffitiEmblems';

interface CategoriesSectionProps {
  onSelectCategory: (categoryKey: Category['categoryKey']) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-2 font-kvant">
              <GraffitiCrown size={18} /> SIGNATURE SILHOUETTES
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              FEATURED CATEGORIES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-md font-medium">
            Explore custom-milled heavyweight textiles, signature boxy cuts, and modern Moroccan street aesthetics.
          </p>
        </div>

        {/* Categories Grid (2 cols on mobile, 3 on tablet/desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.categoryKey)}
              className="group relative rounded-3xl overflow-hidden bg-[#141414] border border-[#262626] hover:border-[#CCFF00]/40 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-[360px] sm:h-[400px]"
            >
              {/* Background Image with Zoom */}
              <div className="absolute inset-0 overflow-hidden bg-[#0A0A0A]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out opacity-75 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              </div>

              {/* Badge */}
              <div className="relative z-10 p-5 flex justify-between items-start">
                {cat.badge && (
                  <span className="px-3 py-1 bg-[#CCFF00] text-black text-[11px] font-black rounded-full uppercase tracking-wider shadow-sm font-kvant">
                    {cat.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:text-black group-hover:scale-110 transition-all shadow-md ml-auto">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Text Info (Bottom) */}
              <div className="relative z-10 p-6 sm:p-7 mt-auto text-white space-y-1.5">
                <span className="text-xs font-black text-[#CCFF00] font-mono tracking-widest uppercase block">
                  {cat.itemsCount} Streetwear Pieces
                </span>
                <h3 className="text-2xl font-black font-display group-hover:text-[#CCFF00] transition-colors leading-tight uppercase">
                  {cat.name}
                </h3>
                <p dir="rtl" className="text-lg sm:text-xl text-[#CCFF00] font-arabic font-extrabold tracking-normal">
                  {cat.arabicName}
                </p>
                <p className="text-xs text-white/70 line-clamp-2 pt-1 font-medium">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
