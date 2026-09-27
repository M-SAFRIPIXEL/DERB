import React from 'react';
import { DerbLogo } from './DerbLogo';

interface BrandLoadingScreenProps {
  message?: string;
}

export const BrandLoadingScreen: React.FC<BrandLoadingScreenProps> = ({
  message = 'Loading Luxury Streetwear Atelier...',
}) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden select-none p-4">
      {/* Ambient background glows */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[#CCFF00]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#CCFF00]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto animate-fade-in">
        {/* Brand Logo in Glowing Glass Container */}
        <div className="relative mb-5 group">
          {/* Subtle neon ring halo */}
          <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-[#CCFF00]/30 via-[#CCFF00]/10 to-[#CCFF00]/30 blur-xl animate-pulse" />

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#141414]/90 border border-[#CCFF00]/40 flex items-center justify-center p-4 shadow-[0_0_35px_rgba(204,255,0,0.25)] backdrop-blur-md">
            <DerbLogo
              size={56}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_18px_rgba(204,255,0,0.5)] animate-pulse"
              alt="PHILOSTORYA Brand Logo"
            />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black font-kvant tracking-wider text-white">
            PHILOSTORYA
          </h1>
          <p className="text-base sm:text-lg font-black font-arabic-title text-[#CCFF00] tracking-normal">
            فيلوستوريا
          </p>
          <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/40 uppercase pt-0.5">
            Moroccan Luxury Streetwear
          </p>
        </div>

        {/* Animated Neon Progress Bar */}
        <div className="w-36 sm:w-48 h-1 bg-[#1F1F1F] rounded-full overflow-hidden relative mb-3.5 border border-white/5">
          <div className="h-full bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent w-1/2 rounded-full absolute animate-brand-shimmer" />
        </div>

        {/* Status text */}
        <p className="text-white/50 text-xs font-arabic font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

export default BrandLoadingScreen;
