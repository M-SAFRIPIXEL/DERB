import React from 'react';
import {
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Banknote,
  Instagram,
} from 'lucide-react';
import { MOROCCAN_CITIES } from '../data/products';
import { DerbLogo } from './DerbLogo';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#080808] text-white pt-16 pb-12 border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#1C1C1C]">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#262626] p-1.5 flex items-center justify-center">
                <DerbLogo className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl font-black font-kvant tracking-wider text-white">
                  DERB
                </span>
                <span dir="rtl" className="text-3xl sm:text-4xl font-black font-arabic-title text-[#CCFF00] tracking-normal">
                  الدرب
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm font-arabic" dir="rtl">
              العلامة المغربية الرائدة في أزياء الشارع الفاخرة. قطن مغربي 500 غرام عالي الكثافة، قصات معمارية بوكسي، وتصميمات كاليغرافي بطاقة حضرية مبتكرة في الدار البيضاء.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#CCFF00] font-semibold font-arabic">
              <MapPin className="w-4 h-4 text-[#CCFF00] shrink-0" />
              <span>مشغل الدار البيضاء، جهة الدار البيضاء الكبرى، المغرب</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Phone className="w-4 h-4 text-[#CCFF00] shrink-0" />
              <span className="font-mono">خدمة الواتساب: +212 6 00 00 00 00</span>
            </div>
          </div>

          {/* Quick Navigation Links (Arabic Main) (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-arabic">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
                روابط التنقل
              </h4>
              <span className="text-[10px] text-white/40 font-kvant uppercase">NAV</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => onNavigateSection('hero')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>الرئيسية</span>
                  <span className="text-[10px] text-white/30 font-sans">Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('shop')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>أحدث الإصدارات</span>
                  <span className="text-[10px] text-white/30 font-sans">Drops</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('categories')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>فئات الملابس</span>
                  <span className="text-[10px] text-white/30 font-sans">Categories</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('collections')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>ثقافة الشارع والكبسولات</span>
                  <span className="text-[10px] text-white/30 font-sans">Culture</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('reviews')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>آراء وتقييمات الزبائن</span>
                  <span className="text-[10px] text-white/30 font-sans">Reviews</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('community')}
                  className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                >
                  <span>مجتمع #DERBFITS</span>
                  <span className="text-[10px] text-white/30 font-sans">Community</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Guarantees (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-arabic">
            <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
              خدمات التوصيل والضمان
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>الدفع كاش عند الاستلام (COD)</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>استبدال مجاني وسهل خلال 14 يوماً</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>ضمان جودة القطن الفاخر 500GSM</span>
              </li>
              <li className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>بدون أي دفع مسبق</span>
              </li>
            </ul>
          </div>

          {/* Supported Moroccan Cities Delivery (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-arabic">
            <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
              مدن التوصيل السريع
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-white/70">
              {MOROCCAN_CITIES.map((c) => (
                <span
                  key={c.name}
                  className="px-2 py-0.5 bg-[#141414] rounded-md border border-[#222] hover:border-[#CCFF00]/40 transition"
                >
                  {c.arabicName || c.name}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/40 pt-1">
              توصيل يومي إلى أكثر من 40 مدينة وقرية مغربية.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Payments + Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-white/70 font-arabic">
              طرق الدفع المعتمدة:
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#141414] rounded font-arabic text-[11px] text-[#CCFF00] font-bold border border-[#222]">
                الدفع نقداً عند الاستلام
              </span>
              <span className="px-2 py-1 bg-[#141414] rounded font-mono text-[10px] text-white font-bold border border-[#222]">
                CMI / VISA / MASTERCARD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-white/40 hover:text-[#CCFF00] transition flex items-center gap-1 font-arabic"
              >
                <span>بوابة الإدارة (Admin)</span>
              </button>
            )}
            <span>© 2026 DERB STREETWEAR CASABLANCA • الدرب للأزياء المغربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
