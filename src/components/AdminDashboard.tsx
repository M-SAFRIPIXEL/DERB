import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  AlertTriangle,
  Package,
  ShoppingBag,
  Tag,
  Megaphone,
  Star,
  Users,
  BarChart3,
  RefreshCw,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Product, Order, CartItem } from '../types';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import {
  fetchAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  fetchAllSubscribersAdmin,
  DBSubscriber,
  deleteReviewAdmin,
  fetchAllReviews,
  DBReview,
  fetchStoreSettings,
  saveStoreSettingsAdmin,
  DBStoreSettings,
  fetchAllPromoCodes,
  savePromoCodeAdmin,
  deletePromoCodeAdmin,
  DBPromoCode,
  saveProductAdmin,
  deleteProductAdmin,
} from '../lib/firebaseService';
import { DerbLogo } from './DerbLogo';

import { OverviewTab } from './admin/OverviewTab';
import { OrdersTab } from './admin/OrdersTab';
import { ProductsTab } from './admin/ProductsTab';
import { PromosTab } from './admin/PromosTab';
import { SettingsTab } from './admin/SettingsTab';
import { ReviewsTab } from './admin/ReviewsTab';
import { SubscribersTab } from './admin/SubscribersTab';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateStoreSettings?: (settings: Partial<DBStoreSettings>) => void;
}

type AdminTab = 'overview' | 'orders' | 'products' | 'promos' | 'settings' | 'reviews' | 'subscribers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  onUpdateStoreSettings,
}) => {
  const { user, isAdmin, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<DBSubscriber[]>([]);
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [promos, setPromos] = useState<DBPromoCode[]>([]);
  const [storeSettings, setStoreSettings] = useState<DBStoreSettings>({
    id: 'global',
    announcementAr: 'طاقة بلا حدود • الدفع عند الاستلام كاش في جميع مدن المغرب • قطن فاخر 500GSM • توصيل مجاني للطلبات فوق 500 درهم',
    announcementEn: 'NO RULES JUST ENERGY • CASH ON DELIVERY MOROCCO • 500GSM LUXURY FLEECE • FREE 24H DELIVERY OVER 500 MAD',
    whatsappNumber: '+212 710-960721',
    freeShippingThreshold: 500,
    isMaintenanceMode: false,
    updatedAt: new Date().toISOString(),
  });

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const loadStoreData = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      const [fetchedOrders, fetchedSubs, fetchedReviews, fetchedPromos, fetchedSettings] =
        await Promise.all([
          fetchAllOrdersAdmin().catch(() => []),
          fetchAllSubscribersAdmin().catch(() => []),
          fetchAllReviews().catch(() => []),
          fetchAllPromoCodes().catch(() => []),
          fetchStoreSettings().catch(() => null),
        ]);

      if (fetchedOrders) setOrders(fetchedOrders);
      if (fetchedSubs) setSubscribers(fetchedSubs);
      if (fetchedReviews) setReviews(fetchedReviews);
      if (fetchedPromos && fetchedPromos.length > 0) {
        setPromos(fetchedPromos);
      } else {
        setPromos([
          {
            id: 'philostorya10', code: 'PHILOSTORYA10', discountType: 'percentage', discountValue: 10,
            minOrderMAD: 0, description: '10% off entire order for new customers',
            isActive: true, createdAt: new Date().toISOString(),
          },
          {
            id: 'morocco10', code: 'MOROCCO10', discountType: 'percentage', discountValue: 10,
            minOrderMAD: 300, description: '10% off for orders across Morocco',
            isActive: true, createdAt: new Date().toISOString(),
          },
          {
            id: 'casa100', code: 'CASA100', discountType: 'fixed', discountValue: 100,
            minOrderMAD: 800, description: '100 MAD off for orders over 800 MAD',
            isActive: true, createdAt: new Date().toISOString(),
          },
        ]);
      }
      if (fetchedSettings) setStoreSettings(fetchedSettings);
    } catch (e) {
      console.error('Error loading admin store data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadStoreData();
    }
  }, [isOpen, isAdmin]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      notify(`تم تحديث حالة الطلبية بنجاح إلى: ${newStatus.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      notify('فشل في تحديث حالة الطلبية، يرجى المحاولة ثانية');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الطلبية نهائياً؟')) return;
    try {
      await deleteOrderAdmin(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      notify('تم حذف الطلبية بنجاح');
    } catch (e) {
      console.error(e);
      notify('فشل حذف الطلبية');
    }
  };

  const handleSaveProduct = async (product: Product) => {
    await saveProductAdmin(product);
    notify(`تم حفظ المنتج "${product.name}" في الكتالوج بنجاح!`);
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProductAdmin(productId);
    notify('تم حذف المنتج بنجاح من قاعدة البيانات.');
  };

  const handleSavePromo = async (promo: DBPromoCode) => {
    await savePromoCodeAdmin(promo);
    setPromos((prev) => [promo, ...prev.filter((p) => p.id !== promo.id)]);
    notify(`تم تفعيل كود الخصم ${promo.code} بنجاح!`);
  };

  const handleTogglePromoStatus = async (promo: DBPromoCode) => {
    const updated = { ...promo, isActive: !promo.isActive };
    try {
      await savePromoCodeAdmin(updated);
      setPromos((prev) => prev.map((p) => (p.id === promo.id ? updated : p)));
      notify(`تم تحديث حالة الكود ${promo.code}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (!window.confirm('هل تريد حذف كود الخصم هذا؟')) return;
    try {
      await deletePromoCodeAdmin(promoId);
      setPromos((prev) => prev.filter((p) => p.id !== promoId));
      notify('تم حذف كود الخصم');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSettings = async (settings: DBStoreSettings) => {
    await saveStoreSettingsAdmin(settings);
    if (onUpdateStoreSettings) onUpdateStoreSettings(settings);
    notify('تم حفظ إعدادات المتجر والشريط الإخباري بنجاح!');
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('هل تريد حذف هذا التقييم؟')) return;
    try {
      await deleteReviewAdmin(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      notify('تم حذف التقييم بنجاح');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopySubscribers = () => {
    const emails = subscribers.map((s) => s.email).join('\n');
    navigator.clipboard.writeText(emails);
    notify(`تم نسخ ${subscribers.length} بريد إلكتروني للحافظة!`);
  };

  const handleDownloadSubscribersCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Email,Subscribed Date\n' +
      subscribers.map((s) => `"${s.email}","${s.subscribedAt}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `derb_vip_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-[#121212] border border-[#2B2B2B] rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative overflow-hidden animate-fade-in text-center font-arabic">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CCFF00]/20 to-black border border-[#CCFF00]/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
            <Lock className="w-10 h-10 text-[#CCFF00]" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-black font-kvant text-white">PHILOSTORYA</span>
            <span className="text-2xl font-black text-[#CCFF00]">فيلوستوريا</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            منطقة الإدارة الحصرية • Restricted Area
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mb-6 leading-relaxed">
            تم تخصيص هذه اللوحة لإدارة جميع عناصر المتجر والطلبيات والمخزون، وهي محصورة ومحمية حصرياً للمشرف:
          </p>
          <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#333] mb-6 flex items-center justify-center gap-2 text-xs font-mono text-[#CCFF00]">
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span className="font-bold">{ADMIN_EMAIL}</span>
          </div>
          {user ? (
            <div className="space-y-4">
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>أنت مسجل حالياً بحساب ({user.email}) وهو غير مصرح له بالدخول للوحة الإدارة.</span>
              </div>
              <button
                onClick={logout}
                className="w-full py-3 bg-[#222] hover:bg-[#333] text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج والتبديل لحساب {ADMIN_EMAIL}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl text-sm transition flex items-center justify-center gap-2 font-kvant uppercase tracking-wider shadow-lg shadow-[#CCFF00]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول بحساب المشرف (Google Login)</span>
            </button>
          )}
          <div className="mt-6 pt-4 border-t border-[#222] text-[11px] text-white/40">
            PHILOSTORYA Streetwear Security System • Zero Trust Policy
          </div>
        </div>
      </div>
    );
  }

  const sidebarTabs: { id: AdminTab; icon: React.ReactNode; label: string; count?: number }[] = [
    { id: 'overview', icon: <BarChart3 className="w-4 h-4" />, label: 'نظرة عامة والتحليلات' },
    { id: 'orders', icon: <Package className="w-4 h-4" />, label: 'الطلبيات والشحنات', count: orders.length },
    { id: 'products', icon: <ShoppingBag className="w-4 h-4" />, label: 'المنتجات والمخزون', count: products.length },
    { id: 'promos', icon: <Tag className="w-4 h-4" />, label: 'أكواد الخصم والعروض', count: promos.length },
    { id: 'settings', icon: <Megaphone className="w-4 h-4" />, label: 'الشريط الإخباري والإعدادات' },
    { id: 'reviews', icon: <Star className="w-4 h-4" />, label: 'تقييمات الزبائن', count: reviews.length },
    { id: 'subscribers', icon: <Users className="w-4 h-4" />, label: 'نادي فيلوستوريا والمشتركون', count: subscribers.length },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#080808]/98 backdrop-blur-2xl flex flex-col overflow-hidden text-white font-sans">
      {actionSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#CCFF00] text-black px-6 py-2.5 rounded-2xl shadow-2xl font-bold font-arabic text-sm flex items-center gap-2 animate-fade-in border border-black/20">
          <span>{actionSuccess}</span>
        </div>
      )}

      <header className="bg-[#111111] border-b border-[#222] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#333] p-1 flex items-center justify-center">
            <DerbLogo className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-kvant text-white">PHILOSTORYA CONTROL HUB</span>
              <span className="px-2 py-0.5 bg-[#CCFF00] text-black text-[10px] font-black rounded font-arabic">
                المسؤول العام
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <UserCheck className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="font-mono text-[#CCFF00]">{user?.email}</span>
              <span className="text-white/30">•</span>
              <span className="text-[11px] font-mono">الدار البيضاء: {new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadStoreData}
            disabled={refreshing}
            className="p-2 sm:px-3 sm:py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white/80 hover:text-[#CCFF00] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="تحديث البيانات من فايربيز"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#CCFF00]' : ''}`} />
            <span className="hidden sm:inline font-arabic">تحديث البيانات</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 sm:px-3 sm:py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black rounded-xl text-xs font-black transition flex items-center gap-1.5 font-arabic"
          >
            <span>العودة للمتجر</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-64 bg-[#0D0D0D] border-b md:border-b-0 md:border-r border-[#1F1F1F] p-3 sm:p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto font-arabic">
          {sidebarTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                  : 'text-white/70 hover:bg-[#161616] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    activeTab === tab.id ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <div className="hidden md:block mt-auto pt-6 border-t border-[#1C1C1C] text-[11px] text-white/40 space-y-1">
            <div className="flex items-center gap-1 text-[#CCFF00] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span>قاعدة البيانات متصلة</span>
            </div>
            <div>Firestore ID: derb-ff5f5</div>
          </div>
        </aside>

        <main className="flex-1 bg-[#0A0A0A] p-4 sm:p-6 lg:p-8 overflow-y-auto font-arabic">
          {activeTab === 'overview' && (
            <OverviewTab
              orders={orders}
              products={products}
              subscribers={subscribers}
              onOpenNewProduct={() => setActiveTab('products')}
              onSwitchTab={(tab) => setActiveTab(tab as AdminTab)}
              onSelectOrder={(order) => {
                setOrders((prev) => [...prev]);
                setActiveTab('orders');
              }}
            />
          )}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onDelete={handleDeleteOrder}
            />
          )}
          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              onUpdateProducts={onUpdateProducts}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {activeTab === 'promos' && (
            <PromosTab
              promos={promos}
              onSavePromo={handleSavePromo}
              onToggleStatus={handleTogglePromoStatus}
              onDeletePromo={handleDeletePromo}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={storeSettings}
              onUpdateSettings={setStoreSettings}
              onSaveSettings={handleSaveSettings}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} onDeleteReview={handleDeleteReview} />
          )}
          {activeTab === 'subscribers' && (
            <SubscribersTab
              subscribers={subscribers}
              onCopySubscribers={handleCopySubscribers}
              onDownloadCSV={handleDownloadSubscribersCSV}
            />
          )}
        </main>
      </div>
    </div>
  );
};
