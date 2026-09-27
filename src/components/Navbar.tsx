import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Package,
  MapPin,
  User,
  LogIn,
  LogOut,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { DerbLogo } from './DerbLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  cartCount: number;
  cartTotalMAD: number;
  wishlistCount: number;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenOrders,
  onOpenAdmin,
  cartCount,
  cartTotalMAD,
  wishlistCount,
  onNavigateSection,
}) => {
  const { user, isAdmin, login, logout } = useAuth();
  const { lang, setLang, dir, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { key: 'nav.home', sectionId: 'hero' },
    { key: 'nav.drops', sectionId: 'shop', badgeKey: 'nav.dropsBadge' },
    { key: 'nav.categories', sectionId: 'categories' },
    { key: 'nav.culture', sectionId: 'collections' },
    { key: 'nav.club', sectionId: 'club' },
    { key: 'nav.reviews', sectionId: 'reviews' },
  ];

  return (
    <>
      {/* Top Announcement Banner */}
      <div className="bg-[#CCFF00] text-[#0A0A0A] py-1.5 px-3 text-center text-[10.5px] sm:text-xs font-black tracking-normal sm:tracking-wider flex items-center justify-center gap-3 select-none overflow-hidden font-arabic">
        <span className="flex items-center gap-1.5 sm:gap-2 font-extrabold truncate" dir={dir}>
          <span className="text-xs">⚡</span>
          <span className="truncate">{t('banner.announcement')}</span>
        </span>
        <span className="hidden md:inline-block opacity-40">|</span>
        <span className="hidden md:inline-flex items-center gap-1 font-bold text-[11px]" dir={dir}>
          {t('banner.delivery')}
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222] shadow-2xl py-2 sm:py-3'
            : 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A] py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left for Mobile: Hamburger Button */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="min-h-[44px] min-w-[44px] p-2 text-white hover:text-[#CCFF00] hover:bg-[#1A1A1A] rounded-xl transition flex items-center justify-center touch-manipulation active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Brand Logo & Full Brand Name: Guaranteed full visibility on Desktop and Mobile */}
            <div
              onClick={() => onNavigateSection('hero')}
              className="cursor-pointer group flex items-center gap-2 sm:gap-3 select-none touch-manipulation shrink-0 whitespace-nowrap py-1"
            >
              <DerbLogo className="h-6 sm:h-7 lg:h-8 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(204,255,0,0.3)] shrink-0" />
              {lang === 'ar' ? (
                <span dir="rtl" className="text-xl sm:text-2xl lg:text-[28px] font-black font-arabic-title text-[#CCFF00] tracking-normal leading-tight drop-shadow-[0_2px_14px_rgba(204,255,0,0.25)] group-hover:scale-105 transition-transform whitespace-nowrap inline-block">
                  {t('brand.name')}
                </span>
              ) : (
                <span className="text-xl sm:text-2xl lg:text-[28px] font-black font-kvant tracking-tight text-white group-hover:text-[#CCFF00] transition-colors whitespace-nowrap inline-block">
                  {t('brand.nameEn')}
                </span>
              )}
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 flex-1 text-sm text-white/80" dir={dir}>
              {navLinks.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => onNavigateSection(link.sectionId)}
                  className="hover:text-[#CCFF00] transition-colors relative py-1.5 flex items-center gap-1.5 font-arabic text-[13px] xl:text-[14px] font-bold tracking-normal group whitespace-nowrap"
                >
                  <span className="group-hover:translate-y-[-1px] transition-transform">{t(link.key)}</span>
                  {link.badgeKey && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-[#CCFF00] text-black rounded-sm leading-none font-arabic">
                      {t(link.badgeKey)}
                    </span>
                  )}
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[#CCFF00] scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-full" />
                </button>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Fast Language Switcher (Mobile & Desktop) */}
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#CCFF00]/50 text-white/90 hover:text-[#CCFF00] text-[11px] sm:text-xs font-bold transition font-arabic min-h-[36px] sm:min-h-[38px] touch-manipulation active:scale-95"
                title={lang === 'ar' ? 'Switch to English' : 'تبديل للعربية'}
              >
                <Globe className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                <span className="font-bold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Search (Desktop only - mobile uses bottom nav) */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden sm:flex p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition min-h-[44px] min-w-[44px] items-center justify-center"
                aria-label={t('action.search')}
                title={t('action.search')}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Track Orders */}
              <button
                type="button"
                onClick={onOpenOrders}
                className="hidden sm:flex p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition min-h-[44px] min-w-[44px] items-center justify-center"
                aria-label={t('action.track')}
                title={t('action.track')}
              >
                <Package className="w-5 h-5" />
              </button>

              {/* Wishlist (Desktop) */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="hidden sm:flex relative p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition min-h-[44px] min-w-[44px] items-center justify-center"
                aria-label={t('action.wishlist')}
                title={t('action.wishlist')}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#CCFF00] text-black rounded-full text-[10px] font-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 sm:p-1.5 rounded-full border border-[#333] hover:border-[#CCFF00] transition flex items-center gap-1.5 bg-[#161616] min-h-[38px] min-w-[38px] justify-center"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Account'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-[#CCFF00]" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={login}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] hover:border-[#CCFF00] text-white/90 hover:text-[#CCFF00] rounded-xl text-xs font-bold transition font-arabic min-h-[38px]"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>{t('action.signIn')}</span>
                  </button>
                )}

                {/* User Dropdown */}
                {user && isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#161616] border border-[#2A2A2A] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-fade-in font-arabic" dir={dir}>
                    <div className="p-2 border-b border-[#242424]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block truncate">
                          {user.displayName || t('user.member')}
                        </span>
                        {isAdmin && (
                          <span className="px-1.5 py-0.2 bg-[#CCFF00] text-black font-black text-[9px] rounded">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/50 block truncate">
                        {user.email}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-right p-2 rounded-lg bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00] font-black flex items-center gap-2 border border-[#CCFF00]/30 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                        <span>{t('action.admin')}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenOrders();
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-[#222] text-white flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-[#CCFF00]" />
                      <span>{t('action.myOrders')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('action.signOut')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Button (Desktop) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#181818] to-[#222] hover:border-[#CCFF00] border border-[#CCFF00]/50 text-[#CCFF00] font-black text-xs rounded-xl shadow-lg transition active:scale-95 font-arabic group min-h-[38px]"
                  title={t('action.adminPanel')}
                >
                  <ShieldCheck className="w-4 h-4 text-[#CCFF00] group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[11px] font-bold">ADMIN</span>
                </button>
              )}

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black text-xs rounded-xl shadow-lg hover:shadow-[#CCFF00]/20 transition active:scale-95 font-arabic font-extrabold min-h-[38px] sm:min-h-[42px] touch-manipulation"
                aria-label="Shopping Bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-black text-[#CCFF00] rounded-full text-[9px] font-black flex items-center justify-center font-sans">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">
                  {cartTotalMAD > 0
                    ? `${cartTotalMAD} ${t('currency.mad')}`
                    : t('action.cart')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex">
          <div className="w-4/5 max-w-sm bg-[#121212] h-full shadow-2xl p-5 sm:p-6 flex flex-col justify-between text-white border-r border-[#262626] animate-fade-in pb-safe overflow-y-auto" dir={dir}>
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#222]">
                <div className="flex items-center gap-2">
                  {lang === 'ar' ? (
                    <span dir="rtl" className="text-xl font-black font-arabic-title text-[#CCFF00] tracking-normal">{t('brand.name')}</span>
                  ) : (
                    <span className="text-xl font-black font-kvant text-white">{t('brand.nameEn')}</span>
                  )}
                  <DerbLogo className="h-6 w-auto drop-shadow-[0_0_10px_rgba(204,255,0,0.25)]" />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-[#222] rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="py-3 flex items-center justify-between border-b border-[#222]">
                <span className="text-xs text-white/60 font-arabic font-bold">{t('lang.label')}</span>
                <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-[#333]">
                  <button
                    onClick={() => setLang('ar')}
                    className={`px-3 py-1.5 text-xs rounded font-arabic font-bold transition min-h-[36px] ${
                      lang === 'ar' ? 'bg-[#CCFF00] text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t('lang.arabic')}
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 text-xs rounded font-sans font-bold transition min-h-[36px] ${
                      lang === 'en' ? 'bg-[#CCFF00] text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {t('lang.english')}
                  </button>
                </div>
              </div>

              {/* Mobile Auth */}
              <div className="py-3 border-b border-[#222]">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {user.photoURL && (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-[#CCFF00]" />
                      )}
                      <div>
                        <span className="font-bold text-xs block text-white font-arabic">{user.displayName}</span>
                        <span className="text-[10px] text-white/50">{user.email}</span>
                      </div>
                    </div>
                    <button onClick={logout} className="text-xs text-red-400 font-bold p-2 min-h-[44px] font-arabic">
                      {t('action.signOut')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="w-full py-3 bg-[#1F1F1F] border border-[#333] text-[#CCFF00] font-black text-xs rounded-xl flex items-center justify-center gap-2 font-arabic min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" /> {t('action.signInGoogle')}
                  </button>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <nav className="py-3 space-y-1 font-arabic">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-right py-3 text-sm font-black text-black bg-[#CCFF00] hover:bg-[#b8e600] transition flex items-center justify-between px-3.5 rounded-xl shadow-lg shadow-[#CCFF00]/10 min-h-[44px]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>{t('action.adminHub')}</span>
                    </span>
                    <span className="text-[10px] font-mono bg-black text-[#CCFF00] px-2 py-0.5 rounded font-black">
                      ADMIN
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenOrders();
                  }}
                  className="w-full text-right py-3 text-sm font-black text-[#CCFF00] hover:text-white transition flex items-center justify-between bg-[#181818] px-3.5 rounded-xl border border-[#282828] min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#CCFF00]" />
                    <span>{t('action.trackShipment')}</span>
                  </span>
                  <span className="text-[10px] font-mono text-white/40">Track</span>
                </button>

                {navLinks.map((link) => (
                  <button
                    key={link.sectionId}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigateSection(link.sectionId);
                    }}
                    className="w-full text-right py-3 px-3.5 text-sm font-bold text-white hover:text-[#CCFF00] hover:bg-[#181818] rounded-xl transition flex items-center justify-between min-h-[44px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]/40 group-hover:bg-[#CCFF00]" />
                      <span>{t(link.key)}</span>
                    </div>
                    {link.badgeKey && (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-[#CCFF00] text-black rounded-sm">
                        {t(link.badgeKey)}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Details */}
            <div className="border-t border-[#222] pt-3 text-xs text-white/60 space-y-2 font-arabic">
              <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t('drawer.atelier')}</span>
              </div>
              <p className="text-[11px] text-white/40">{t('drawer.quality')}</p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
