import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { GraffitiCrown } from './GraffitiEmblems';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  category: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productName,
  category,
}) => {
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitPreference, setFitPreference] = useState<'regular' | 'oversized' | 'extreme-boxy'>('oversized');

  if (!isOpen) return null;

  // Calculate recommended size
  const getRecommendedSize = () => {
    let base = 'M';
    if (heightCm < 170) {
      base = weightKg > 70 ? 'M' : 'S';
    } else if (heightCm <= 180) {
      base = weightKg > 80 ? 'XL' : weightKg > 68 ? 'L' : 'M';
    } else if (heightCm <= 188) {
      base = weightKg > 85 ? 'XXL' : 'XL';
    } else {
      base = 'XXL';
    }

    if (fitPreference === 'extreme-boxy') {
      if (base === 'S') return 'M (Oversized)';
      if (base === 'M') return 'L (Oversized)';
      if (base === 'L') return 'XL (Oversized)';
      return 'Oversized Boxy';
    }
    return base;
  };

  const isHoodieOrSweat = category === 'hoodies' || category === 'sweatshirts';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-kvant uppercase text-white tracking-wider">
                Size & Fit Atelier Guide
              </h2>
              <p className="text-xs text-[#CCFF00] font-mono">
                DERB Moroccan Streetwear Sizing • {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Fit Calculator */}
        <div className="my-6 p-5 bg-[#181818] border border-[#262626] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <GraffitiCrown size={16} />
            <h3 className="font-black text-xs text-[#CCFF00] uppercase tracking-wider font-kvant">
              Fit Recommender
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                Your Height: <span className="text-[#CCFF00] font-bold">{heightCm} cm</span>
              </label>
              <input
                type="range"
                min={155}
                max={205}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#CCFF00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>155 cm</span>
                <span>180 cm</span>
                <span>205 cm</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                Your Weight: <span className="text-[#CCFF00] font-bold">{weightKg} kg</span>
              </label>
              <input
                type="range"
                min={45}
                max={120}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-[#CCFF00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>45 kg</span>
                <span>80 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                Fit Silhouette:
              </label>
              <select
                value={fitPreference}
                onChange={(e: any) => setFitPreference(e.target.value)}
                className="w-full p-2 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#CCFF00]"
              >
                <option value="regular">Tailored Street Fit</option>
                <option value="oversized">Signature Oversized (Recommended)</option>
                <option value="extreme-boxy">Extreme Boxy 90s Street</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#1F1F1F] rounded-xl flex items-center justify-between border border-[#2C2C2C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />
              <span className="text-xs font-medium text-white/90">
                Recommended Size for You:
              </span>
            </div>
            <span className="text-sm font-black text-black bg-[#CCFF00] px-3 py-1 rounded-md font-kvant uppercase">
              {getRecommendedSize()}
            </span>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center justify-between">
            <span>Garment Measurements (cm)</span>
            <span className="text-xs font-mono text-[#CCFF00]">Pre-shrunk 100% Cotton</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#161616]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F1F1F] text-[#CCFF00] font-kvant uppercase text-[11px]">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest Width (cm)</th>
                  <th className="p-3">Body Length (cm)</th>
                  <th className="p-3">Shoulder Drop (cm)</th>
                  <th className="p-3">Sleeve Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-white/80">
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-3 font-bold text-[#CCFF00]">S</td>
                  <td className="p-3">58 cm</td>
                  <td className="p-3">71 cm</td>
                  <td className="p-3">56 cm</td>
                  <td className="p-3">{isHoodieOrSweat ? '62 cm' : '23 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-3 font-bold text-[#CCFF00]">M</td>
                  <td className="p-3">61 cm</td>
                  <td className="p-3">74 cm</td>
                  <td className="p-3">59 cm</td>
                  <td className="p-3">{isHoodieOrSweat ? '64 cm' : '24 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition bg-[#CCFF00]/5">
                  <td className="p-3 font-black text-[#CCFF00] font-kvant">L (Most Popular)</td>
                  <td className="p-3 font-semibold text-white">64 cm</td>
                  <td className="p-3 font-semibold text-white">77 cm</td>
                  <td className="p-3 font-semibold text-white">62 cm</td>
                  <td className="p-3 font-semibold text-white">{isHoodieOrSweat ? '66 cm' : '25 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-3 font-bold text-[#CCFF00]">XL</td>
                  <td className="p-3">67 cm</td>
                  <td className="p-3">80 cm</td>
                  <td className="p-3">65 cm</td>
                  <td className="p-3">{isHoodieOrSweat ? '68 cm' : '26 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-3 font-bold text-[#CCFF00]">XXL / Oversized</td>
                  <td className="p-3">71 cm</td>
                  <td className="p-3">83 cm</td>
                  <td className="p-3">68 cm</td>
                  <td className="p-3">{isHoodieOrSweat ? '70 cm' : '27 cm'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Moroccan Fit Advice Notes */}
        <div className="mt-6 p-4 rounded-xl bg-[#181818] border border-[#262626] text-xs text-white/70 space-y-1">
          <p className="font-bold text-[#CCFF00]">🇲🇦 Atelier Fitting Notes:</p>
          <p>• All DERB garments are pre-designed with an intentional boxy drop shoulder cut.</p>
          <p>• If you want a tailored regular fit, order one size down.</p>
          <p>• Free size exchange across all Moroccan cities within 14 days of delivery.</p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-xs sm:text-sm rounded-xl transition shadow-md font-kvant cursor-pointer"
          >
            Got it, Back to Product
          </button>
        </div>
      </div>
    </div>
  );
};
