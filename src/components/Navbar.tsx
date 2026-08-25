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

export type Language = 'ar' | 'en';

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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      sectionId: 'hero',
    },
    {
      labelAr: 'الإصدارات',
      labelEn: 'Drops',
      sectionId: 'shop',
      badgeAr: 'جديد',
      badgeEn: 'NEW',
    },
    {
      labelAr: 'التصنيفات',
      labelEn: 'Categories',
      sectionId: 'categories',
    },
    {
      labelAr: 'ثقافة الشارع',
      labelEn: 'The Culture',
      sectionId: 'collections',
    },
    {
      labelAr: 'نادي الدرب',
      labelEn: 'DERB Club',
      sectionId: 'club',
    },
    {
      labelAr: 'التقييمات',
      labelEn: 'Reviews',
      sectionId: 'reviews',
    },
  ];

  return (
    <>
      {/* Top Banner Notice (High Voltage Tape) */}
      <div className="bg-[#CCFF00] text-[#0A0A0A] py-1 px-4 text-center text-[10px] sm:text-[11px] font-black tracking-wider flex items-center justify-center gap-3 select-none overflow-hidden font-arabic">
        <span className="flex items-center gap-2 font-extrabold" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <span>⚡</span>
          <span>
            {lang === 'ar'
              ? 'طاقة بلا حدود • الدفع عند الاستلام كاش في جميع مدن المغرب • قطن فاخر 500GSM'
              : 'NO RULES JUST ENERGY • CASH ON DELIVERY MOROCCO • 500GSM LUXURY FLEECE'}
          </span>
        </span>
        <span className="hidden md:inline-block opacity-40">|</span>
        <span className="hidden md:inline-flex items-center gap-1 font-bold" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {lang === 'ar'
            ? 'توصيل سريع ومجاني للدار البيضاء والرباط للطلبات فوق 500 درهم'
            : 'FREE 24H DELIVERY IN CASABLANCA & RABAT OVER 500 MAD'}
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222] shadow-2xl py-3 sm:py-3.5'
            : 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A] py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Button & Desktop Navigation Links (Arabic as Main) */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-white hover:text-[#CCFF00] hover:bg-[#1A1A1A] rounded-xl transition flex items-center gap-1.5"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
                <span className="text-xs font-bold font-arabic text-white/80 lg:hidden">القائمة</span>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-6 text-sm font-black text-white/80" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                {navLinks.map((link) => {
                  const label = lang === 'ar' ? link.labelAr : link.labelEn;
                  const badge = lang === 'ar' ? link.badgeAr : link.badgeEn;
                  return (
                    <button
                      key={link.sectionId}
                      onClick={() => onNavigateSection(link.sectionId)}
                      className="hover:text-[#CCFF00] transition-colors relative py-1 flex items-center gap-1.5 font-arabic text-[14px] font-bold tracking-normal group"
                    >
                      <span className="group-hover:translate-y-[-1px] transition-transform">{label}</span>
                      {badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-[#CCFF00] text-black rounded-sm leading-tight font-arabic">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Center: Brand Logo with official vector brand mark */}
            <div
              onClick={() => onNavigateSection('hero')}
              className="cursor-pointer text-center group flex items-center gap-2.5 sm:gap-3.5"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black font-kvant tracking-tighter text-white group-hover:text-[#CCFF00] transition-colors">
                DERB
              </span>
              <DerbLogo className="h-7 sm:h-8 lg:h-9 w-auto group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(204,255,0,0.3)]" />
              <span dir="rtl" className="text-2xl sm:text-3xl lg:text-4xl font-black font-arabic-title text-[#CCFF00] tracking-normal leading-tight drop-shadow-[0_2px_14px_rgba(204,255,0,0.25)] group-hover:scale-105 transition-transform">
                الدرب
              </span>
            </div>

            {/* Right: Actions (Language Switcher, Search, Wishlist, Track Orders, Account, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Language Switcher Pill */}
              <button
                type="button"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181818] border border-[#2A2A2A] hover:border-[#CCFF00] text-white/80 hover:text-[#CCFF00] text-xs font-bold transition font-arabic"
                title={lang === 'ar' ? 'تبديل للإنجليزية' : 'Switch to Arabic'}
              >
                <Globe className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>{lang === 'ar' ? 'العربية' : 'EN'}</span>
              </button>

              {/* Search Button */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition"
                aria-label="Search"
                title={lang === 'ar' ? 'بحث في المنتجات' : 'Search Products'}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Order Tracking Button */}
              <button
                type="button"
                onClick={onOpenOrders}
                className="p-2 sm:p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition flex items-center gap-1"
                aria-label="Track Order"
                title={lang === 'ar' ? 'تتبع طلبياتك وشحناتك' : 'Track Package & Orders'}
              >
                <Package className="w-5 h-5" />
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative p-2 sm:p-2.5 rounded-full text-white/80 hover:text-[#CCFF00] hover:bg-[#1A1A1A] transition"
                aria-label="Wishlist"
                title={lang === 'ar' ? 'قائمة الرغبات والمفضلة' : 'Wishlist'}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#CCFF00] text-black rounded-full text-[10px] font-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account Button */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 sm:p-1.5 rounded-full border border-[#333] hover:border-[#CCFF00] transition flex items-center gap-1.5 bg-[#161616]"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Account'}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-[#CCFF00]" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={login}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] hover:border-[#CCFF00] text-white/90 hover:text-[#CCFF00] rounded-xl text-xs font-bold transition font-arabic"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>{lang === 'ar' ? 'تسجيل الدخول' : 'SIGN IN'}</span>
                  </button>
                )}

                {/* User Dropdown */}
                {user && isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#161616] border border-[#2A2A2A] rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1 animate-fade-in font-arabic" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="p-2 border-b border-[#242424]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white block truncate">
                          {user.displayName || (lang === 'ar' ? 'عضو الدرب' : 'Streetwear User')}
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

                    {/* Admin Dashboard Entry */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenAdmin();
                        }}
                        className="w-full text-right p-2 rounded-lg bg-[#CCFF00]/10 hover:bg-[#CCFF00]/20 text-[#CCFF00] font-black flex items-center gap-2 border border-[#CCFF00]/30 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                        <span>{lang === 'ar' ? 'لوحة تحكم المتجر (Admin)' : 'Admin Dashboard'}</span>
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
                      <span>{lang === 'ar' ? 'طلبياتي السابقة' : 'My Orders'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Button on Header (if logged in as admin) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#181818] to-[#222] hover:border-[#CCFF00] border border-[#CCFF00]/50 text-[#CCFF00] font-black text-xs rounded-xl shadow-lg transition active:scale-95 font-arabic group"
                  title="لوحة تحكم المشرف safrim629@gmail.com"
                >
                  <ShieldCheck className="w-4 h-4 text-[#CCFF00] group-hover:scale-110 transition-transform" />
                  <span className="font-mono text-[11px] font-bold">ADMIN</span>
                </button>
              )}

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={onOpenCart}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black text-xs rounded-xl shadow-lg hover:shadow-[#CCFF00]/20 transition active:scale-95 font-arabic font-extrabold"
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
                <span>
                  {cartTotalMAD > 0
                    ? `${cartTotalMAD} ${lang === 'ar' ? 'د.م' : 'MAD'}`
                    : lang === 'ar'
                    ? 'السلة'
                    : 'CART'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu (Arabic as Main) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden flex">
          <div className="w-4/5 max-w-sm bg-[#121212] h-full shadow-2xl p-6 flex flex-col justify-between text-white border-r border-[#262626] animate-fade-in" dir="rtl">
            <div>
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#222]">
                <div className="flex items-center gap-2.5">
                  <span dir="rtl" className="text-2xl font-black font-arabic-title text-[#CCFF00] tracking-normal">الدرب</span>
                  <DerbLogo className="h-7 w-auto drop-shadow-[0_0_10px_rgba(204,255,0,0.25)]" />
                  <span className="text-2xl font-black font-kvant text-white">DERB</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-[#222] rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Language Switcher */}
              <div className="py-3 flex items-center justify-between border-b border-[#222]">
                <span className="text-xs text-white/60 font-arabic font-bold">اللغة / Language</span>
                <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-lg border border-[#333]">
                  <button
                    onClick={() => setLang('ar')}
                    className={`px-2.5 py-1 text-xs rounded font-arabic font-bold transition ${
                      lang === 'ar' ? 'bg-[#CCFF00] text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 text-xs rounded font-sans font-bold transition ${
                      lang === 'en' ? 'bg-[#CCFF00] text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Mobile Auth button */}
              <div className="py-4 border-b border-[#222]">
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
                    <button onClick={logout} className="text-xs text-red-400 font-bold p-1 font-arabic">
                      تسجيل الخروج
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={login}
                    className="w-full py-2.5 bg-[#1F1F1F] border border-[#333] text-[#CCFF00] font-black text-xs rounded-xl flex items-center justify-center gap-2 font-arabic"
                  >
                    <LogIn className="w-4 h-4" /> تسجيل الدخول عبر Google
                  </button>
                )}
              </div>

              {/* Mobile Navigation Links (Arabic Main) */}
              <nav className="py-4 space-y-2 font-arabic">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-right py-2.5 text-sm font-black text-black bg-[#CCFF00] hover:bg-[#b8e600] transition flex items-center justify-between px-3 rounded-xl shadow-lg shadow-[#CCFF00]/10"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>لوحة التحكم والإدارة (Admin)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-black text-[#CCFF00] px-2 py-0.5 rounded font-black">
                      HUB
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenOrders();
                  }}
                  className="w-full text-right py-2.5 text-sm font-black text-[#CCFF00] hover:text-white transition flex items-center justify-between bg-[#181818] px-3 rounded-xl border border-[#282828]"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#CCFF00]" />
                    <span>تتبع الشحنة والطلبيات</span>
                  </span>
                  <span className="text-[10px] font-sans text-white/40">Track</span>
                </button>

                {navLinks.map((link) => {
                  const label = lang === 'ar' ? link.labelAr : link.labelEn;
                  const subLabel = lang === 'ar' ? link.labelEn : link.labelAr;
                  const badge = lang === 'ar' ? link.badgeAr : link.badgeEn;
                  return (
                    <button
                      key={link.sectionId}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onNavigateSection(link.sectionId);
                      }}
                      className="w-full text-right py-2.5 px-3 text-base font-bold text-white hover:text-[#CCFF00] hover:bg-[#181818] rounded-xl transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]/40 group-hover:bg-[#CCFF00]" />
                        <span>{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {badge && (
                          <span className="px-2 py-0.5 text-[10px] font-black bg-[#CCFF00] text-black rounded-sm">
                            {badge}
                          </span>
                        )}
                        <span className="text-[11px] text-white/40 font-sans">{subLabel}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Details */}
            <div className="border-t border-[#222] pt-4 text-xs text-white/60 space-y-2.5 font-arabic">
              <div className="flex items-center gap-2 text-[#CCFF00] font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>مشغل الدار البيضاء • الدفع عند الاستلام كاش</span>
              </div>
              <p className="text-[11px] text-white/40">قطن فاخر 500 غرام • استبدال مجاني خلال 14 يوماً في جميع مدن المغرب</p>
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
