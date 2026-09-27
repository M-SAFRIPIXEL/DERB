import React, { useState } from 'react';
import { ArrowRight, Eye, Sparkles, Flame } from 'lucide-react';
import { Collection } from '../types';
import { COLLECTIONS_DATA } from '../data/products';

interface CollectionsEditorialProps {
  onExploreCollection: (collection: Collection) => void;
}

export const CollectionsEditorial: React.FC<CollectionsEditorialProps> = ({
  onExploreCollection,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'NEW IN' | 'TRENDING' | 'LIMITED'>('ALL');

  const tabs = ['ALL', 'NEW IN', 'TRENDING', 'LIMITED'] as const;

  return (
    <section id="collections" className="py-16 sm:py-24 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header matching the COLLECTIONS / THE CULTURE screen in image */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#CCFF00] font-kvant tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> CURATED LOOKBOOKS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase leading-none">
              COLLECTIONS <br />
              <span className="text-[#CCFF00] font-graffiti tracking-normal">
                THE CULTURE
              </span>
            </h2>
          </div>

          {/* Filter Pills matching image */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition font-kvant ${
                  activeTab === tab
                    ? 'bg-[#CCFF00] text-black shadow-md'
                    : 'bg-[#181818] text-white/70 hover:text-white border border-[#2A2A2A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Grid matching image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {COLLECTIONS_DATA.map((col, idx) => (
            <div
              key={col.id}
              onClick={() => onExploreCollection(col)}
              className="group bg-[#141414] border border-[#242424] hover:border-[#CCFF00]/50 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative aspect-4/3 w-full bg-[#0D0D0D] overflow-hidden">
                <img
                  src={col.bannerImage}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[#CCFF00] border border-[#CCFF00]/30 text-[10px] font-black rounded-full uppercase font-kvant">
                    {col.tag}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#CCFF00] uppercase font-mono tracking-widest">
                    {col.tagline}
                  </span>
                  <h3 className="text-xl font-black font-display text-white group-hover:text-[#CCFF00] transition uppercase">
                    {col.title}
                  </h3>
                  <p dir="rtl" className="text-base sm:text-lg font-extrabold font-arabic text-[#CCFF00] tracking-normal">
                    {col.arabicTitle}
                  </p>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#222] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-white/40">
                    {col.id === 'col-tshirts-250gsm' ? `${col.productIds.length} ACTIVE ITEMS` : 'غير متاح حالياً'}
                  </span>

                  <button
                    type="button"
                    className={`px-4 py-2 text-xs font-black rounded-xl transition flex items-center gap-1 font-kvant ${
                      col.id === 'col-tshirts-250gsm'
                        ? 'bg-[#CCFF00] text-black shadow-lg hover:bg-white'
                        : 'bg-[#1C1C1C] text-neutral-400 border border-[#2A2A2A]'
                    }`}
                  >
                    <span>{col.id === 'col-tshirts-250gsm' ? 'EXPLORE DROP' : 'غير متاح الآن'}</span>
                    {col.id === 'col-tshirts-250gsm' && (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
