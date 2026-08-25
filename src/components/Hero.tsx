import React from 'react';
import { ArrowRight, Globe, Zap, Truck, Sparkles, Flame, Tag } from 'lucide-react';
import { GraffitiCrown, DoodleArrow } from './GraffitiEmblems';
import { DerbLogo } from './DerbLogo';

interface HeroProps {
  onShopNow: () => void;
  onDiscoverCollection: () => void;
  onSelectCategory?: (categoryKey: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopNow,
  onDiscoverCollection,
  onSelectCategory,
}) => {
  return (
    <section id="hero" className="relative pt-4 sm:pt-8 pb-14 sm:pb-20 overflow-hidden bg-[#0A0A0A]">
      {/* Background Gradients and Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12">
          {/* Left Column: Brand Manifesto & Value Props (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Top Manifesto Block */}
            <div className="bg-[#121212] border border-[#222] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              {/* Subtle top watermark */}
              <div className="absolute -top-4 -right-4 opacity-10 pointer-events-none">
                <DerbLogo className="w-36 h-auto" />
              </div>

              {/* Sub-header with graffiti vibe */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <GraffitiCrown size={22} />
                  <span className="text-[11px] font-black tracking-widest text-[#CCFF00] uppercase font-kvant">
                    DERB STREETWEAR
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-white/50 font-graffiti rotate-[-4deg] inline-block">
                    NO RULES JUST ENERGY
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-[1.05] uppercase mb-4">
                BUILT <br />
                DIFFERENT. <br />
                MADE TO <br />
                <span className="text-[#CCFF00] inline-block relative font-graffiti tracking-normal">
                  STAND OUT.
                  <span className="block h-1 bg-[#CCFF00] w-full mt-1 rounded-full opacity-80" />
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm mb-6">
                DERB is more than clothing. It’s a mindset. A movement. A way of life.
                Engineered with 500GSM custom looped cotton for the Moroccan youth redefining street style.
              </p>

              {/* Value Proposition 3-Column Strip matching image */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#222]">
                <div className="bg-[#181818] p-3 rounded-2xl text-center border border-[#262626] flex flex-col items-center justify-center">
                  <GraffitiCrown size={18} className="mb-1" />
                  <span className="text-[10px] font-black text-white uppercase font-kvant leading-tight">
                    PREMIUM<br />QUALITY
                  </span>
                </div>

                <div className="bg-[#181818] p-3 rounded-2xl text-center border border-[#262626] flex flex-col items-center justify-center">
                  <Globe className="w-4 h-4 text-[#CCFF00] mb-1" />
                  <span className="text-[10px] font-black text-white uppercase font-kvant leading-tight">
                    STREET<br />CULTURE
                  </span>
                </div>

                <div className="bg-[#181818] p-3 rounded-2xl text-center border border-[#262626] flex flex-col items-center justify-center">
                  <Zap className="w-4 h-4 text-[#CCFF00] mb-1" />
                  <span className="text-[10px] font-black text-white uppercase font-kvant leading-tight">
                    LIMITED<br />DROPS
                  </span>
                </div>
              </div>
            </div>

            {/* Ripped Club Sticker Banner (Matching image "URBX CLUB" card) */}
            <div id="club" className="relative torn-paper bg-[#CCFF00] text-black p-5 sm:p-6 rounded-sm shadow-xl flex items-center justify-between overflow-hidden">
              <div className="space-y-1 z-10 max-w-[240px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black font-kvant uppercase tracking-tight">
                    DERB CLUB
                  </span>
                  <Sparkles className="w-4 h-4 fill-black" />
                </div>
                <p className="text-[11px] font-bold leading-tight opacity-90">
                  Join the Club. Get early access, exclusive 500GSM drops & member-only prices.
                </p>
                <button
                  type="button"
                  onClick={onShopNow}
                  className="mt-2 px-3 py-1.5 bg-black text-[#CCFF00] text-xs font-black rounded-lg hover:bg-neutral-900 transition flex items-center gap-1.5 font-kvant cursor-pointer"
                >
                  <span>JOIN NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right decorative barcode / emblem */}
              <div className="text-right z-10 hidden sm:flex flex-col items-end">
                <DerbLogo className="h-8 w-auto brightness-0" />
                <span className="text-[9px] font-mono font-bold tracking-widest mt-1">
                  |||||| 2026 |||
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Model Spotlight matching the central mobile screen in image (7 cols) */}
          <div className="lg:col-span-7 relative bg-[#141414] border border-[#262626] rounded-3xl overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[540px] flex flex-col justify-between p-6 sm:p-10 group">
            {/* Background High-Def Streetwear Model Image */}
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"
              alt="DERB Chaos Heavyweight Hoodie Drop"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            {/* Top Drop Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase text-[#CCFF00] font-kvant tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-[#CCFF00]" /> NEW DROP
                  </span>
                  <DoodleArrow className="hidden sm:inline-block scale-90" />
                </div>
                <span dir="rtl" className="text-xs sm:text-sm font-bold text-[#CCFF00] font-arabic bg-black/80 px-3 py-1.5 rounded-md border border-[#CCFF00]/30 tracking-normal inline-block">
                  إصدار هوديز كاوس ٥٠٠ غرام الحصري
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-black font-kvant">
                500GSM HEAVY
              </div>
            </div>

            {/* Central Giant Graphic Typography matching image */}
            <div className="relative z-10 my-auto py-8">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white uppercase leading-[0.95] mb-2">
                URBAN <br />
                VIBES. <br />
                <span className="text-[#CCFF00] font-graffiti tracking-normal">
                  REAL YOU.
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-white/80 max-w-sm">
                Architectural boxy cut with drop shoulders and graffiti screen print.
              </p>
            </div>

            {/* Bottom Actions & Price Pill */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
              {/* Giant Yellow CTA Button */}
              <button
                type="button"
                onClick={onShopNow}
                className="px-8 py-3.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black text-sm uppercase rounded-2xl shadow-xl hover:shadow-[#CCFF00]/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 font-kvant cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Delivery badge */}
              <div className="flex items-center gap-2 text-xs font-bold text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <Truck className="w-4 h-4 text-[#CCFF00]" />
                <span>Cash on Delivery in Morocco (24-48h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar (Matching image "Categories / View all" row) */}
        <div id="categories" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight uppercase">
                Categories
              </h3>
              <span className="text-xs font-bold text-white/40 font-mono">// 04 CORES</span>
            </div>
            <button
              onClick={onShopNow}
              className="text-xs font-black text-[#CCFF00] hover:underline font-kvant uppercase"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                id: 'hoodies',
                name: 'HOODIES',
                arabic: 'هوديز',
                image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80',
                badge: '500GSM',
              },
              {
                id: 't-shirts',
                name: 'T-SHIRTS',
                arabic: 'تيشرتات',
                image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=80',
                badge: '300GSM',
              },
              {
                id: 'pants',
                name: 'BOTTOMS',
                arabic: 'كارجو',
                image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=500&q=80',
                badge: 'Tactical',
              },
              {
                id: 'limited',
                name: 'ACCESSORIES',
                arabic: 'إكسسوارات',
                image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80',
                badge: 'Caps & Bags',
              },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => onSelectCategory ? onSelectCategory(cat.id) : onShopNow()}
                className="group cursor-pointer bg-[#141414] hover:bg-[#1C1C1C] border border-[#242424] hover:border-[#CCFF00]/50 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-between text-center relative overflow-hidden"
              >
                <div className="w-full aspect-square max-w-[140px] mb-3 overflow-hidden rounded-xl bg-[#0D0D0D] flex items-center justify-center relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/80 text-[#CCFF00] text-[9px] font-black rounded font-mono">
                    {cat.badge}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-black font-kvant text-white group-hover:text-[#CCFF00] transition">
                    {cat.name}
                  </span>
                  <span className="text-[11px] font-arabic text-white/50 block">
                    {cat.arabic}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
