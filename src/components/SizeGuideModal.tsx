import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { GraffitiCrown } from './GraffitiEmblems';
import { useLanguage } from '../context/LanguageContext';

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
  const { lang, dir } = useLanguage();
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in pb-safe"
      dir={dir}
    >
      <div className="bg-[#121212] border border-[#262626] rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-7 text-white font-arabic">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#222]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#CCFF00] text-black flex items-center justify-center font-black shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wider">
                {lang === 'ar' ? 'دليل المقاسات والقصات' : 'Size & Fit Atelier Guide'}
              </h2>
              <p className="text-[11px] text-[#CCFF00] font-mono truncate max-w-[220px] sm:max-w-none">
                PHILOSTORYA Moroccan Sizing • {productName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Fit Calculator */}
        <div className="my-4 sm:my-6 p-4 sm:p-5 bg-[#181818] border border-[#262626] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <GraffitiCrown size={16} />
            <h3 className="font-black text-xs text-[#CCFF00] uppercase tracking-wider">
              {lang === 'ar' ? 'حاسبة المقاس المثالي' : 'Fit Recommender'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {lang === 'ar' ? 'الطول:' : 'Height:'} <span className="text-[#CCFF00] font-bold font-mono">{heightCm} cm</span>
              </label>
              <input
                type="range"
                min={155}
                max={205}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-[#CCFF00] cursor-pointer min-h-[30px]"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>155 cm</span>
                <span>180 cm</span>
                <span>205 cm</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {lang === 'ar' ? 'الوزن:' : 'Weight:'} <span className="text-[#CCFF00] font-bold font-mono">{weightKg} kg</span>
              </label>
              <input
                type="range"
                min={45}
                max={120}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-[#CCFF00] cursor-pointer min-h-[30px]"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>45 kg</span>
                <span>80 kg</span>
                <span>120 kg</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">
                {lang === 'ar' ? 'نوع القصة المفضلة:' : 'Fit Silhouette:'}
              </label>
              <select
                value={fitPreference}
                onChange={(e: any) => setFitPreference(e.target.value)}
                className="w-full p-2 text-xs bg-[#121212] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#CCFF00] min-h-[38px] cursor-pointer"
              >
                <option value="regular">{lang === 'ar' ? 'قصة عادية كلاسيكية' : 'Tailored Street Fit'}</option>
                <option value="oversized">{lang === 'ar' ? 'أوفرسايز واسع (المفضل)' : 'Signature Oversized (Recommended)'}</option>
                <option value="extreme-boxy">{lang === 'ar' ? 'إكستريم بوكسي 90s' : 'Extreme Boxy 90s Street'}</option>
              </select>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#1F1F1F] rounded-xl flex items-center justify-between border border-[#2C2C2C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#CCFF00]" />
              <span className="text-xs font-medium text-white/90">
                {lang === 'ar' ? 'المقاس الموصى به لك:' : 'Recommended Size:'}
              </span>
            </div>
            <span className="text-sm font-black text-black bg-[#CCFF00] px-3 py-1 rounded-md font-kvant uppercase">
              {getRecommendedSize()}
            </span>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-xs sm:text-sm text-white flex items-center justify-between">
            <span>{lang === 'ar' ? 'قياسات القطعة بالسنتمتر (cm)' : 'Garment Measurements (cm)'}</span>
            <span className="text-[11px] font-mono text-[#CCFF00]">100% Cotton</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#262626] bg-[#161616]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1F1F1F] text-[#CCFF00] font-kvant uppercase text-[10px] sm:text-[11px]">
                <tr>
                  <th className="p-2.5 sm:p-3">Size</th>
                  <th className="p-2.5 sm:p-3">Chest (cm)</th>
                  <th className="p-2.5 sm:p-3">Length (cm)</th>
                  <th className="p-2.5 sm:p-3">Shoulder (cm)</th>
                  <th className="p-2.5 sm:p-3">Sleeve (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222] text-white/80 font-mono text-[11px]">
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-2.5 sm:p-3 font-bold text-[#CCFF00]">S</td>
                  <td className="p-2.5 sm:p-3">58 cm</td>
                  <td className="p-2.5 sm:p-3">71 cm</td>
                  <td className="p-2.5 sm:p-3">56 cm</td>
                  <td className="p-2.5 sm:p-3">{isHoodieOrSweat ? '62 cm' : '23 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-2.5 sm:p-3 font-bold text-[#CCFF00]">M</td>
                  <td className="p-2.5 sm:p-3">61 cm</td>
                  <td className="p-2.5 sm:p-3">74 cm</td>
                  <td className="p-2.5 sm:p-3">59 cm</td>
                  <td className="p-2.5 sm:p-3">{isHoodieOrSweat ? '64 cm' : '24 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition bg-[#CCFF00]/5">
                  <td className="p-2.5 sm:p-3 font-black text-[#CCFF00] font-kvant">L (Best)</td>
                  <td className="p-2.5 sm:p-3 font-semibold text-white">64 cm</td>
                  <td className="p-2.5 sm:p-3 font-semibold text-white">77 cm</td>
                  <td className="p-2.5 sm:p-3 font-semibold text-white">62 cm</td>
                  <td className="p-2.5 sm:p-3 font-semibold text-white">{isHoodieOrSweat ? '66 cm' : '25 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-2.5 sm:p-3 font-bold text-[#CCFF00]">XL</td>
                  <td className="p-2.5 sm:p-3">67 cm</td>
                  <td className="p-2.5 sm:p-3">80 cm</td>
                  <td className="p-2.5 sm:p-3">65 cm</td>
                  <td className="p-2.5 sm:p-3">{isHoodieOrSweat ? '68 cm' : '26 cm'}</td>
                </tr>
                <tr className="hover:bg-[#1A1A1A] transition">
                  <td className="p-2.5 sm:p-3 font-bold text-[#CCFF00]">XXL</td>
                  <td className="p-2.5 sm:p-3">71 cm</td>
                  <td className="p-2.5 sm:p-3">83 cm</td>
                  <td className="p-2.5 sm:p-3">68 cm</td>
                  <td className="p-2.5 sm:p-3">{isHoodieOrSweat ? '70 cm' : '27 cm'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fitting Notes */}
        <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-xl bg-[#181818] border border-[#262626] text-xs text-white/70 space-y-1">
          <p className="font-bold text-[#CCFF00]">🇲🇦 {lang === 'ar' ? 'ملاحظات مشغل الدار البيضاء:' : 'Atelier Fitting Notes:'}</p>
          <p>• {lang === 'ar' ? 'جميع قطع فيلوستوريا مصممة بقصة بوكسي أوفرسايز بكتافات متدلية.' : 'All PHILOSTORYA garments have an intentional boxy drop shoulder cut.'}</p>
          <p>• {lang === 'ar' ? 'تبديل مجاني للمقاس في جميع مدن المغرب خلال 14 يوماً من الاستلام.' : 'Free size exchange across all Moroccan cities within 14 days.'}</p>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-xs sm:text-sm rounded-xl transition shadow-md min-h-[44px] touch-manipulation"
          >
            {lang === 'ar' ? 'حسناً، العودة للمنتج' : 'Got it, Back to Product'}
          </button>
        </div>
      </div>
    </div>
  );
};
