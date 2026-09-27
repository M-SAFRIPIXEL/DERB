import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { LOOKBOOK_ITEMS } from '../data/products';
import { DoodleArrow } from './GraffitiEmblems';

export const InstagramCommunity: React.FC = () => {
  return (
    <section id="community" className="py-16 sm:py-24 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-2 font-kvant">
            <Instagram className="w-4 h-4" /> #PHILOSTORYAFITS • CASABLANCA STREET MOVEMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
            TAG US TO BE FEATURED
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-2 font-medium">
            Join thousands of Moroccan creators rocking 500GSM heavyweight hoodies in Casablanca, Marrakech, Rabat, and Tangier.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {LOOKBOOK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden aspect-3/4 bg-[#141414] border border-[#222] hover:border-[#CCFF00]/40 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 sm:p-4 flex flex-col justify-between text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black bg-[#CCFF00] text-black px-2 py-0.5 rounded font-kvant">
                    {item.city.split(',')[0]}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{item.likes}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black text-[#CCFF00] block font-mono">
                    {item.model}
                  </span>
                  <p dir="rtl" className="text-xs text-white/95 line-clamp-2 mt-0.5 font-arabic font-bold tracking-normal">
                    {item.arabicTitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
