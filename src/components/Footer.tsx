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
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
}) => {
  const { isAdmin } = useAuth();
  const { lang, dir, t } = useLanguage();

  const navItems = [
    { key: 'footer.home', sectionId: 'hero' },
    { key: 'footer.drops', sectionId: 'shop' },
    { key: 'footer.categories', sectionId: 'categories' },
    { key: 'footer.culture', sectionId: 'collections' },
    { key: 'footer.reviews', sectionId: 'reviews' },
    { key: 'footer.community', sectionId: 'community' },
  ];

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
                {lang === 'ar' ? (
                  <span dir="rtl" className="text-3xl sm:text-4xl font-black font-arabic-title text-[#CCFF00] tracking-normal">
                    {t('brand.name')}
                  </span>
                ) : (
                  <span className="text-3xl sm:text-4xl font-black font-kvant tracking-wider text-white">
                    {t('brand.nameEn')}
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm font-arabic" dir="rtl">
              {t('brand.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#CCFF00] font-semibold font-arabic">
              <MapPin className="w-4 h-4 text-[#CCFF00] shrink-0" />
              <span>{t('brand.atelier')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Phone className="w-4 h-4 text-[#CCFF00] shrink-0" />
              <span className="font-mono">{t('brand.whatsapp')}</span>
            </div>
          </div>

          {/* Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-arabic" dir={dir}>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
                {t('footer.nav')}
              </h4>
              <span className="text-[10px] text-white/40 font-kvant uppercase">NAV</span>
            </div>
            <ul className="space-y-2 text-xs text-white/70">
              {navItems.map((item) => (
                <li key={item.sectionId}>
                  <button
                    onClick={() => onNavigateSection(item.sectionId)}
                    className="hover:text-[#CCFF00] transition cursor-pointer flex items-center justify-between w-full text-right"
                  >
                    <span>{t(item.key)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Guarantees (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-arabic" dir={dir}>
            <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>{t('footer.cod')}</span>
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>{t('footer.exchange')}</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>{t('footer.guarantee')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#CCFF00] shrink-0" />
                <span>{t('footer.noPrepay')}</span>
              </li>
            </ul>
          </div>

          {/* Supported Moroccan Cities Delivery (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-arabic" dir={dir}>
            <h4 className="text-xs font-black font-arabic text-[#CCFF00] uppercase tracking-wider">
              {t('footer.cities')}
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-white/70">
              {MOROCCAN_CITIES.map((c) => (
                <span
                  key={c.name}
                  className="px-2 py-0.5 bg-[#141414] rounded-md border border-[#222] hover:border-[#CCFF00]/40 transition"
                >
                  {lang === 'ar' ? (c.arabicName || c.name) : c.name}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-white/40 pt-1">
              {t('footer.citiesDesc')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-white/70 font-arabic">
              {t('footer.payments')}
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#141414] rounded font-arabic text-[11px] text-[#CCFF00] font-bold border border-[#222]">
                {t('footer.cashOnDelivery')}
              </span>
              <span className="px-2 py-1 bg-[#141414] rounded font-mono text-[10px] text-white font-bold border border-[#222]">
                CMI / VISA / MASTERCARD
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            {isAdmin && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-white/40 hover:text-[#CCFF00] transition flex items-center gap-1 font-arabic"
              >
                <span>{t('footer.adminPortal')}</span>
              </button>
            )}
            <span>{t('brand.copyright')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
