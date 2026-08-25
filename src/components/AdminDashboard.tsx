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
  TrendingUp,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Phone,
  MessageSquare,
  Copy,
  Download,
  Search,
  Filter,
  X,
  ChevronDown,
  Check,
  Eye,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  Sliders,
  DollarSign,
  Layers,
  MapPin,
  Flame,
} from 'lucide-react';
import { Product, Order, CartItem, ProductColor } from '../types';
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
  fetchCustomProductsAdmin,
  saveProductAdmin,
  deleteProductAdmin,
} from '../lib/firebaseService';
import { MOROCCAN_CITIES } from '../data/products';
import { DerbLogo } from './DerbLogo';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateStoreSettings?: (settings: Partial<DBStoreSettings>) => void;
}

type AdminTab =
  | 'overview'
  | 'orders'
  | 'products'
  | 'promos'
  | 'settings'
  | 'reviews'
  | 'subscribers';

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

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<DBSubscriber[]>([]);
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [promos, setPromos] = useState<DBPromoCode[]>([]);
  const [storeSettings, setStoreSettings] = useState<DBStoreSettings>({
    id: 'global',
    announcementAr:
      'طاقة بلا حدود • الدفع عند الاستلام كاش في جميع مدن المغرب • قطن فاخر 500GSM • توصيل مجاني للطلبات فوق 500 درهم',
    announcementEn:
      'NO RULES JUST ENERGY • CASH ON DELIVERY MOROCCO • 500GSM LUXURY FLEECE • FREE 24H DELIVERY OVER 500 MAD',
    whatsappNumber: '+212 6 00 00 00 00',
    freeShippingThreshold: 500,
    isMaintenanceMode: false,
    updatedAt: new Date().toISOString(),
  });

  // Filters & Sub-states
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderCityFilter, setOrderCityFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Product Form Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{
    id: string;
    name: string;
    arabicName: string;
    slug: string;
    priceMAD: number;
    originalPriceMAD: number;
    category: Product['category'];
    categoryLabel: string;
    gsm: number;
    material: string;
    fit: string;
    stockCount: number;
    inStock: boolean;
    description: string;
    imageUrl: string;
    isNewArrival: boolean;
    isBestSeller: boolean;
    isLimitedEdition: boolean;
    featured: boolean;
  }>({
    id: '',
    name: '',
    arabicName: '',
    slug: '',
    priceMAD: 490,
    originalPriceMAD: 650,
    category: 'hoodies',
    categoryLabel: 'Heavyweight Hoodies',
    gsm: 500,
    material: '100% Moroccan Heavyweight Combed Cotton',
    fit: 'Boxy Oversized Drop Shoulder',
    stockCount: 25,
    inStock: true,
    description: 'Luxury streetwear crafted in Casablanca.',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85',
    isNewArrival: true,
    isBestSeller: false,
    isLimitedEdition: false,
    featured: true,
  });

  // Promo Code Form State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [promoForm, setPromoForm] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderMAD: number;
    description: string;
  }>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderMAD: 0,
    description: 'Special Drop Discount',
  });

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Load all store data
  const loadStoreData = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    try {
      const [fetchedOrders, fetchedSubs, fetchedReviews, fetchedPromos, fetchedSettings, customProds] =
        await Promise.all([
          fetchAllOrdersAdmin().catch(() => []),
          fetchAllSubscribersAdmin().catch(() => []),
          fetchAllReviews().catch(() => []),
          fetchAllPromoCodes().catch(() => []),
          fetchStoreSettings().catch(() => null),
          fetchCustomProductsAdmin().catch(() => []),
        ]);

      if (fetchedOrders) setOrders(fetchedOrders);
      if (fetchedSubs) setSubscribers(fetchedSubs);
      if (fetchedReviews) setReviews(fetchedReviews);
      if (fetchedPromos && fetchedPromos.length > 0) {
        setPromos(fetchedPromos);
      } else {
        // Default standard store promos if none yet in DB
        setPromos([
          {
            id: 'derb10',
            code: 'DERB10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderMAD: 0,
            description: '10% off entire order for new customers',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'morocco10',
            code: 'MOROCCO10',
            discountType: 'percentage',
            discountValue: 10,
            minOrderMAD: 300,
            description: '10% off for orders across Morocco',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'casa100',
            code: 'CASA100',
            discountType: 'fixed',
            discountValue: 100,
            minOrderMAD: 800,
            description: '100 MAD off for orders over 800 MAD',
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      if (fetchedSettings) {
        setStoreSettings(fetchedSettings);
      }

      if (customProds && customProds.length > 0) {
        // Merge or replace products
        const merged = [...products];
        customProds.forEach((cp) => {
          const idx = merged.findIndex((p) => p.id === cp.id);
          if (idx >= 0) {
            merged[idx] = cp;
          } else {
            merged.unshift(cp);
          }
        });
        onUpdateProducts(merged);
      }
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

  // Order actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatusAdmin(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
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
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(null);
      }
      notify('تم حذف الطلبية بنجاح');
    } catch (e) {
      console.error(e);
      notify('فشل حذف الطلبية');
    }
  };

  // Product actions
  const handleOpenNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      id: `derb-drop-${Date.now().toString().slice(-4)}`,
      name: '',
      arabicName: '',
      slug: '',
      priceMAD: 490,
      originalPriceMAD: 650,
      category: 'hoodies',
      categoryLabel: 'Heavyweight Hoodies',
      gsm: 500,
      material: '100% Moroccan Heavyweight Combed Cotton',
      fit: 'Boxy Oversized Drop Shoulder',
      stockCount: 30,
      inStock: true,
      description: 'قطن مغربي فاخر عالي الكثافة مع قصة معمارية عريضة.',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85',
      isNewArrival: true,
      isBestSeller: false,
      isLimitedEdition: false,
      featured: true,
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      arabicName: prod.arabicName,
      slug: prod.slug,
      priceMAD: prod.priceMAD,
      originalPriceMAD: prod.originalPriceMAD || prod.priceMAD,
      category: prod.category,
      categoryLabel: prod.categoryLabel,
      gsm: prod.gsm,
      material: prod.material,
      fit: prod.fit,
      stockCount: prod.stockCount,
      inStock: prod.inStock,
      description: prod.description,
      imageUrl: prod.images[0] || '',
      isNewArrival: Boolean(prod.isNewArrival),
      isBestSeller: Boolean(prod.isBestSeller),
      isLimitedEdition: Boolean(prod.isLimitedEdition),
      featured: Boolean(prod.featured),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.arabicName) {
      alert('يرجى إدخال اسم المنتج بالإنجليزية والعربية');
      return;
    }

    const newProd: Product = {
      id: productForm.id || `derb-${Date.now()}`,
      name: productForm.name,
      arabicName: productForm.arabicName,
      slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      priceMAD: Number(productForm.priceMAD),
      originalPriceMAD: Number(productForm.originalPriceMAD),
      category: productForm.category,
      categoryLabel: productForm.categoryLabel,
      tags: ['DERB Exclusive', `${productForm.gsm}GSM`, 'Casablanca Streetwear'],
      images: [
        productForm.imageUrl,
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
      ],
      colors: [
        { name: 'Onyx Black', hex: '#111111', bgClass: 'bg-black', imageIndex: 0 },
        { name: 'Acid Volt', hex: '#CCFF00', bgClass: 'bg-[#CCFF00]', imageIndex: 1 },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'Oversized'],
      rating: 4.9,
      reviewsCount: 18,
      inStock: productForm.inStock,
      stockCount: Number(productForm.stockCount),
      gsm: Number(productForm.gsm),
      material: productForm.material,
      fit: productForm.fit,
      description: productForm.description,
      details: [
        `${productForm.gsm}GSM Heavyweight Loopback Fleece`,
        'Double-layered ergonomic hood with no drawstrings',
        'Drop-shoulder boxy silhouette',
        'Pre-shrunk to maintain exact dimensions',
      ],
      careInstructions: [
        'Wash cold inside out at 30°C',
        'Do not tumble dry',
        'Iron on low heat avoiding high-density prints',
      ],
      isNewArrival: productForm.isNewArrival,
      isBestSeller: productForm.isBestSeller,
      isLimitedEdition: productForm.isLimitedEdition,
      featured: productForm.featured,
    };

    try {
      await saveProductAdmin(newProd);
      const updatedList = editingProduct
        ? products.map((p) => (p.id === newProd.id ? newProd : p))
        : [newProd, ...products];

      onUpdateProducts(updatedList);
      setIsProductModalOpen(false);
      notify(`تم حفظ المنتج "${newProd.name}" في الكتالوج بنجاح!`);
    } catch (err) {
      console.error(err);
      notify('فشل حفظ المنتج، يرجى إعادة المحاولة.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج من الكتالوج؟')) return;
    try {
      await deleteProductAdmin(productId);
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
      notify('تم حذف المنتج بنجاح من قاعدة البيانات.');
    } catch (e) {
      console.error(e);
      notify('فشل حذف المنتج.');
    }
  };

  // Promo code actions
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code) return;
    const cleanCode = promoForm.code.trim().toUpperCase();
    const newPromo: DBPromoCode = {
      id: cleanCode.toLowerCase(),
      code: cleanCode,
      discountType: promoForm.discountType,
      discountValue: Number(promoForm.discountValue),
      minOrderMAD: Number(promoForm.minOrderMAD),
      description: promoForm.description,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await savePromoCodeAdmin(newPromo);
      setPromos((prev) => [newPromo, ...prev.filter((p) => p.id !== newPromo.id)]);
      setIsPromoModalOpen(false);
      setPromoForm({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderMAD: 0,
        description: '',
      });
      notify(`تم تفعيل كود الخصم ${cleanCode} بنجاح!`);
    } catch (e) {
      console.error(e);
      notify('فشل إضافة كود الخصم');
    }
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

  // Store Settings actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStoreSettingsAdmin(storeSettings);
      if (onUpdateStoreSettings) {
        onUpdateStoreSettings(storeSettings);
      }
      notify('تم حفظ إعدادات المتجر والشريط الإخباري بنجاح!');
    } catch (e) {
      console.error(e);
      notify('فشل حفظ الإعدادات');
    }
  };

  // Review delete
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

  // Subscribers copy & download
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

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        !orderSearch ||
        order.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.shippingDetails?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.shippingDetails?.phone?.includes(orderSearch) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase());

      const matchStatus =
        orderStatusFilter === 'all' || order.status === orderStatusFilter;

      const matchCity =
        orderCityFilter === 'all' || order.shippingDetails?.city === orderCityFilter;

      return matchSearch && matchStatus && matchCity;
    });
  }, [orders, orderSearch, orderStatusFilter, orderCityFilter]);

  // Analytics Metrics
  const totalRevenueMAD = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalMAD || 0), 0);
  }, [orders]);

  const codPendingMAD = useMemo(() => {
    return orders
      .filter((o) => o.paymentMethod === 'cod' && o.status !== 'delivered')
      .reduce((sum, o) => sum + (o.totalMAD || 0), 0);
  }, [orders]);

  const totalStockCount = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
  }, [products]);

  const topCitiesCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    orders.forEach((o) => {
      const c = o.shippingDetails?.city || 'Other';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  if (!isOpen) return null;

  // ================= 1. GATEKEEPER SCREEN (If not authenticated as safrim629@gmail.com) =================
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="bg-[#121212] border border-[#2B2B2B] rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative overflow-hidden animate-fade-in text-center font-arabic">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Glowing Lock Emblem */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#CCFF00]/20 to-black border border-[#CCFF00]/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(204,255,0,0.2)]">
            <Lock className="w-10 h-10 text-[#CCFF00]" />
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-black font-kvant text-white">DERB</span>
            <span className="text-2xl font-black text-[#CCFF00]">الدرب</span>
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
                <span>
                  أنت مسجل حالياً بحساب ({user.email}) وهو غير مصرح له بالدخول للوحة الإدارة.
                </span>
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
            DERB Streetwear Security System • Zero Trust Policy
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. FULL AUTHORIZED ADMIN DASHBOARD =================
  return (
    <div className="fixed inset-0 z-50 bg-[#080808]/98 backdrop-blur-2xl flex flex-col overflow-hidden text-white font-sans">
      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#CCFF00] text-black px-6 py-2.5 rounded-2xl shadow-2xl font-bold font-arabic text-sm flex items-center gap-2 animate-fade-in border border-black/20">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <header className="bg-[#111111] border-b border-[#222] px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-xl bg-black border border-[#333] p-1 flex items-center justify-center">
            <DerbLogo className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-kvant text-white">DERB CONTROL HUB</span>
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

      {/* Main Admin Workspace (Sidebar Tabs + Content Area) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#0D0D0D] border-b md:border-b-0 md:border-r border-[#1F1F1F] p-3 sm:p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto font-arabic">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>نظرة عامة والتحليلات</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>الطلبيات والشحنات</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeTab === 'orders' ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>المنتجات والمخزون</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeTab === 'products' ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
              }`}
            >
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'promos'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-4 h-4" />
              <span>أكواد الخصم والعروض</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeTab === 'promos' ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
              }`}
            >
              {promos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>الشريط الإخباري والإعدادات</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>تقييمات الزبائن</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeTab === 'reviews' ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
              }`}
            >
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'bg-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/10'
                : 'text-white/70 hover:bg-[#161616] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>نادي الدرب والمشتركون</span>
            </div>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                activeTab === 'subscribers' ? 'bg-black text-[#CCFF00]' : 'bg-[#222] text-white/70'
              }`}
            >
              {subscribers.length}
            </span>
          </button>

          <div className="hidden md:block mt-auto pt-6 border-t border-[#1C1C1C] text-[11px] text-white/40 space-y-1">
            <div className="flex items-center gap-1 text-[#CCFF00] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-ping" />
              <span>قاعدة البيانات متصلة</span>
            </div>
            <div>Firestore ID: derb-ff5f5</div>
          </div>
        </aside>

        {/* Content View Body */}
        <main className="flex-1 bg-[#0A0A0A] p-4 sm:p-6 lg:p-8 overflow-y-auto font-arabic">
          {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white font-arabic">
                    لوحة الإدارة والتحليلات الرئيسية
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50">
                    متابعة شاملة للمبيعات، شحنات الكاش (COD)، ومخزون ملابس الشارع في المغرب.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewProductModal}
                    className="px-4 py-2.5 bg-[#CCFF00] text-black font-black rounded-xl text-xs flex items-center gap-2 transition hover:bg-[#b8e600]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة إصدار جديد</span>
                  </button>
                </div>
              </div>

              {/* 4 Big KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-white/50 text-xs">
                    <span>إجمالي المبيعات المؤكدة</span>
                    <DollarSign className="w-4 h-4 text-[#CCFF00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white mb-1">
                    {totalRevenueMAD.toLocaleString()} <span className="text-sm text-[#CCFF00]">MAD</span>
                  </div>
                  <div className="text-[11px] text-white/40 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>من {orders.length} طلبية مسجلة</span>
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-white/50 text-xs">
                    <span>مبالغ الكاش قيد التحصيل (COD)</span>
                    <Truck className="w-4 h-4 text-[#CCFF00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-[#CCFF00] mb-1">
                    {codPendingMAD.toLocaleString()} <span className="text-sm text-white">MAD</span>
                  </div>
                  <div className="text-[11px] text-white/40">
                    قيد الشحن والتوصيل مع موزعي المدن
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-white/50 text-xs">
                    <span>قطع المخزون المتوفرة</span>
                    <Layers className="w-4 h-4 text-[#CCFF00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white mb-1">
                    {totalStockCount} <span className="text-sm text-white/60">قطعة</span>
                  </div>
                  <div className="text-[11px] text-white/40">
                    موزعة على {products.length} تصميم بالمتجر
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-white/50 text-xs">
                    <span>مشتركو نادي الدرب (VIP)</span>
                    <Users className="w-4 h-4 text-[#CCFF00]" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-white mb-1">
                    {subscribers.length} <span className="text-sm text-white/60">عضو</span>
                  </div>
                  <div className="text-[11px] text-white/40">
                    جاهزون لإشعارات الإصدارات الحصرية
                  </div>
                </div>
              </div>

              {/* Grid: Top Moroccan Cities & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cities Distribution (5 cols) */}
                <div className="lg:col-span-5 bg-[#141414] border border-[#222] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#CCFF00]" />
                      <span>توزيع الطلبيات حسب المدن المغربية</span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {topCitiesCount.length === 0 ? (
                      <div className="text-xs text-white/40 py-6 text-center">
                        لا توجد طلبيات مسجلة بعد لعرض المدن
                      </div>
                    ) : (
                      topCitiesCount.map(([city, count]) => {
                        const pct = Math.round((count / (orders.length || 1)) * 100);
                        return (
                          <div key={city} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white/90">{city}</span>
                              <span className="font-mono text-white/60">
                                {count} طلب ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#222] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#CCFF00] rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(8, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Recent Orders List (7 cols) */}
                <div className="lg:col-span-7 bg-[#141414] border border-[#222] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#CCFF00]" />
                      <span>أحدث الطلبيات المستلمة</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#CCFF00] font-bold hover:underline"
                    >
                      عرض الكل ({orders.length})
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-xs text-white/40 py-10 text-center">
                      لم يتم تسجيل أي طلبية حتى الآن
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          onClick={() => {
                            setSelectedOrderDetails(order);
                            setActiveTab('orders');
                          }}
                          className="p-3 bg-[#1B1B1B] hover:bg-[#222] border border-[#2A2A2A] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#CCFF00]">
                                {order.trackingNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  order.status === 'delivered'
                                    ? 'bg-green-950 text-green-400 border border-green-700/50'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-950 text-blue-400 border border-blue-700/50'
                                    : 'bg-yellow-950 text-yellow-400 border border-yellow-700/50'
                                }`}
                              >
                                {order.status === 'delivered'
                                  ? 'تم التوصيل'
                                  : order.status === 'shipped'
                                  ? 'في الشحن'
                                  : 'مؤكدة'}
                              </span>
                            </div>
                            <div className="text-[11px] text-white/60 mt-0.5">
                              {order.shippingDetails?.fullName} • {order.shippingDetails?.city}
                            </div>
                          </div>

                          <div className="text-left">
                            <div className="font-mono font-black text-sm text-white">
                              {order.totalMAD} MAD
                            </div>
                            <div className="text-[10px] text-white/40 font-mono">
                              {order.items?.length || 1} قطع
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    إدارة الطلبيات والشحنات المغربية ({filteredOrders.length})
                  </h1>
                  <p className="text-xs text-white/50">
                    تحديث حالات التوصيل، التواصل عبر الواتساب مع الزبائن، ومتابعة شحنات الكاش (COD).
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute right-3 top-3 text-white/40" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="بحث برقم التتبع، الاسم، الهاتف..."
                    className="w-full pr-9 pl-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="confirmed">مؤكدة (Confirmed)</option>
                    <option value="processing">قيد التجهيز (Processing)</option>
                    <option value="shipped">خرج للتوصيل (Shipped)</option>
                    <option value="delivered">تم التوصيل بنجاح (Delivered)</option>
                  </select>
                </div>

                <div>
                  <select
                    value={orderCityFilter}
                    onChange={(e) => setOrderCityFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="all">جميع المدن</option>
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.arabicName || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Orders Table / Cards */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="bg-[#141414] rounded-2xl p-12 text-center border border-[#222] text-white/50 text-xs">
                    لا توجد طلبيات تطابق بحثك الحالي
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#141414] border border-[#222] hover:border-[#333] rounded-2xl p-4 sm:p-5 transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F1F1F] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-mono font-black text-sm text-[#CCFF00] bg-black/60 px-3 py-1 rounded-lg border border-[#333]">
                            {order.trackingNumber}
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              order.status === 'delivered'
                                ? 'bg-green-950 text-green-400 border border-green-600/50'
                                : order.status === 'shipped'
                                ? 'bg-blue-950 text-blue-400 border border-blue-600/50'
                                : 'bg-yellow-950 text-yellow-400 border border-yellow-600/50'
                            }`}
                          >
                            {order.status === 'delivered'
                              ? 'تم التوصيل'
                              : order.status === 'shipped'
                              ? 'قيد الشحن'
                              : order.status === 'processing'
                              ? 'قيد التجهيز'
                              : 'مؤكدة'}
                          </span>
                          <span className="text-xs text-white/40 font-mono">
                            {new Date(order.createdAt).toLocaleDateString('ar-MA')}
                          </span>
                        </div>

                        {/* Status Change Dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/50">تغيير الحالة:</span>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as Order['status'])
                            }
                            className="px-2.5 py-1 bg-[#222] border border-[#333] rounded-lg text-xs text-white focus:outline-none focus:border-[#CCFF00] font-bold"
                          >
                            <option value="confirmed">مؤكدة (Confirmed)</option>
                            <option value="processing">قيد التجهيز (Processing)</option>
                            <option value="shipped">في الطريق للتوصيل (Shipped)</option>
                            <option value="delivered">تم التوصيل واستلام الكاش (Delivered)</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer Details & Items Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                        {/* Customer Info (5 cols) */}
                        <div className="md:col-span-5 space-y-1.5">
                          <div className="font-bold text-white text-sm">
                            {order.shippingDetails?.fullName}
                          </div>
                          <div className="text-white/70 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                            <span>
                              {order.shippingDetails?.city} - {order.shippingDetails?.address}
                            </span>
                          </div>
                          <div className="text-white/70 flex items-center gap-2 font-mono">
                            <Phone className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                            <span>{order.shippingDetails?.phone}</span>
                          </div>

                          {/* 1-Click WhatsApp Button */}
                          <div className="pt-2 flex items-center gap-2">
                            <a
                              href={`https://wa.me/${(order.shippingDetails?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `مرحباً ${order.shippingDetails?.fullName || ''}، معكم خدمة الزبائن من DERB Streetwear بخصوص طلبيتكم رقم (${order.trackingNumber}) بمبلغ ${order.totalMAD} درهم (الدفع عند الاستلام). نود تأكيد موعد التوصيل في ${order.shippingDetails?.city}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366] hover:text-black font-bold rounded-lg text-[11px] flex items-center gap-1.5 transition"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>تواصل عبر الواتساب للتاكيد</span>
                            </a>
                          </div>
                        </div>

                        {/* Order Items (4 cols) */}
                        <div className="md:col-span-4 space-y-2 border-r md:border-r-0 md:border-l border-[#222] pr-0 md:pl-4">
                          <span className="font-bold text-white/70 block">
                            القطع المطلوبة ({order.items?.length || 0}):
                          </span>
                          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                            {order.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] bg-[#1C1C1C] p-1.5 rounded-lg"
                              >
                                <span className="truncate max-w-[150px] font-bold text-white">
                                  {item.product?.name || 'Streetwear Piece'}
                                </span>
                                <span className="font-mono text-[#CCFF00]">
                                  {item.selectedSize} | {item.quantity}x
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Total and Actions (3 cols) */}
                        <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end text-left">
                          <div>
                            <div className="text-[11px] text-white/50">المبلغ الإجمالي للدفع:</div>
                            <div className="font-mono font-black text-xl text-[#CCFF00]">
                              {order.totalMAD} MAD
                            </div>
                            <span className="text-[10px] text-white/40 font-mono">
                              {order.paymentMethod === 'cod' ? 'الدفع نقداً كاش عند الاستلام' : 'بطاقة بنكية'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-3">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-white/80 rounded-lg text-[11px] flex items-center gap-1 transition"
                            >
                              <Eye className="w-3 h-3 text-[#CCFF00]" />
                              <span>التفاصيل</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition"
                              title="حذف الطلبية"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: PRODUCTS & INVENTORY ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    إدارة المنتجات وقطع الشارع ({products.length})
                  </h1>
                  <p className="text-xs text-white/50">
                    إضافة إصدارات جديدة، تعديل الأسعار بالدرهم المغربي، ومتابعة كميات المخزون.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewProductModal}
                  className="px-4 py-2.5 bg-[#CCFF00] text-black font-black rounded-xl text-xs flex items-center gap-2 hover:bg-[#b8e600] transition font-arabic"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة إصدار / هودي جديد</span>
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#141414] border border-[#222] hover:border-[#CCFF00]/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition"
                  >
                    <div className="flex gap-3">
                      <div className="w-20 h-24 rounded-xl bg-black overflow-hidden shrink-0 border border-[#333]">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-[#CCFF00] text-black font-mono text-[9px] font-black rounded">
                            {product.gsm}GSM
                          </span>
                          {product.isLimitedEdition && (
                            <span className="px-1.5 py-0.5 bg-red-950 text-red-400 font-mono text-[8px] font-black rounded">
                              LIMITED
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-white text-xs truncate">
                          {product.name}
                        </h4>
                        <div className="text-[11px] text-[#CCFF00] font-arabic font-bold">
                          {product.arabicName}
                        </div>
                        <div className="font-mono text-sm font-black text-white">
                          {product.priceMAD} MAD
                        </div>
                      </div>
                    </div>

                    {/* Stock and Status */}
                    <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 text-[11px]">المخزون:</span>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            product.stockCount > 5
                              ? 'bg-green-950/60 text-green-400 border border-green-700/40'
                              : 'bg-red-950/60 text-red-400 border border-red-700/40'
                          }`}
                        >
                          {product.stockCount} قطعة
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-1.5 bg-[#222] hover:bg-[#333] text-white rounded-lg transition"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: PROMO CODES & DISCOUNTS ================= */}
          {activeTab === 'promos' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    أكواد الخصم وحملات التخفيض ({promos.length})
                  </h1>
                  <p className="text-xs text-white/50">
                    إنشاء وإدارة أكواد الكوبونات المعتمدة عند إتمام الشراء.
                  </p>
                </div>
                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="px-4 py-2.5 bg-[#CCFF00] text-black font-black rounded-xl text-xs flex items-center gap-2 hover:bg-[#b8e600] transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء كود خصم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promos.map((promo) => (
                  <div
                    key={promo.id}
                    className={`bg-[#141414] border rounded-2xl p-5 space-y-3 transition ${
                      promo.isActive ? 'border-[#2D2D2D] hover:border-[#CCFF00]/40' : 'border-red-900/40 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-lg text-[#CCFF00] bg-black px-3 py-1 rounded-lg border border-[#333]">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => handleTogglePromoStatus(promo)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          promo.isActive
                            ? 'bg-green-950 text-green-400 border border-green-700/50'
                            : 'bg-red-950 text-red-400 border border-red-700/50'
                        }`}
                      >
                        {promo.isActive ? 'نشط ومفعل' : 'معطل'}
                      </button>
                    </div>

                    <div className="space-y-1 text-xs text-white/70">
                      <div className="flex items-center justify-between">
                        <span>نسبة / قيمة الخصم:</span>
                        <span className="font-mono font-bold text-white">
                          {promo.discountType === 'percentage'
                            ? `${promo.discountValue}%`
                            : `${promo.discountValue} MAD`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>الحد الأدنى للطلب:</span>
                        <span className="font-mono text-white/60">
                          {promo.minOrderMAD ? `${promo.minOrderMAD} MAD` : 'بدون حد'}
                        </span>
                      </div>
                      {promo.description && (
                        <p className="text-[11px] text-white/40 pt-1">{promo.description}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#222] flex justify-end">
                      <button
                        onClick={() => handleDeletePromo(promo.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الكود</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: STORE SETTINGS & ANNOUNCEMENTS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-white">
                  إعدادات المتجر والشريط الإخباري
                </h1>
                <p className="text-xs text-white/50">
                  تعديل نص الشريط العلوي الأصفر (Notice Ticker) ورقم هاتف خدمة الواتساب.
                </p>
              </div>

              <form
                onSubmit={handleSaveSettings}
                className="bg-[#141414] border border-[#222] rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/80 block">
                    نص الشريط العلوي (باللغة العربية):
                  </label>
                  <textarea
                    rows={2}
                    value={storeSettings.announcementAr}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, announcementAr: e.target.value })
                    }
                    className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/80 block">
                    Top Ticker Notice (English):
                  </label>
                  <textarea
                    rows={2}
                    value={storeSettings.announcementEn}
                    onChange={(e) =>
                      setStoreSettings({ ...storeSettings, announcementEn: e.target.value })
                    }
                    className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/80 block">
                      رقم واتساب خدمة الزبائن (Moroccan WhatsApp):
                    </label>
                    <input
                      type="text"
                      value={storeSettings.whatsappNumber}
                      onChange={(e) =>
                        setStoreSettings({ ...storeSettings, whatsappNumber: e.target.value })
                      }
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/80 block">
                      الحد الأدنى للشحن المجاني (درهم مغربي):
                    </label>
                    <input
                      type="number"
                      value={storeSettings.freeShippingThreshold}
                      onChange={(e) =>
                        setStoreSettings({
                          ...storeSettings,
                          freeShippingThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 bg-[#0A0A0A] border border-[#333] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl text-sm transition font-kvant uppercase tracking-wider"
                >
                  حفظ الإعدادات في قاعدة البيانات
                </button>
              </form>
            </div>
          )}

          {/* ================= TAB 6: CUSTOMER REVIEWS ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    إدارة تقييمات الزبائن ({reviews.length})
                  </h1>
                  <p className="text-xs text-white/50">
                    مراجعة التعليقات المكتوبة من المشترين في المدن المغربية وحذف غير اللائق منها.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{rev.author}</div>
                        <div className="text-[10px] text-white/40 font-mono">
                          {rev.city} • {rev.productPurchased}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#CCFF00]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current text-[#CCFF00]' : 'text-[#333]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed bg-[#0F0F0F] p-3 rounded-xl border border-[#222]">
                      "{rev.arabicComment || rev.comment}"
                    </p>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف التقييم</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: VIP DROP SUBSCRIBERS ================= */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white">
                    أعضاء نادي الدرب والمشتركون في الإعلانات ({subscribers.length})
                  </h1>
                  <p className="text-xs text-white/50">
                    قائمة الإيميلات المسجلة للحصول على إشعارات الكبسولات والإصدارات المحدودة.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySubscribers}
                    className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#CCFF00]" />
                    <span>نسخ جميع الإيميلات</span>
                  </button>
                  <button
                    onClick={handleDownloadSubscribersCSV}
                    className="px-3.5 py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل كملف CSV</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
                <div className="p-3 bg-[#1B1B1B] border-b border-[#222] grid grid-cols-12 text-xs font-bold text-white/60">
                  <span className="col-span-8">البريد الإلكتروني للزبون</span>
                  <span className="col-span-4 text-left">تاريخ الاشتراك</span>
                </div>
                <div className="divide-y divide-[#1C1C1C] max-h-96 overflow-y-auto">
                  {subscribers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-white/40">
                      لا يوجد مشتركون مسجلون بعد
                    </div>
                  ) : (
                    subscribers.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3 grid grid-cols-12 text-xs hover:bg-[#181818] transition items-center"
                      >
                        <span className="col-span-8 font-mono text-[#CCFF00] truncate">
                          {sub.email}
                        </span>
                        <span className="col-span-4 font-mono text-white/40 text-left text-[11px]">
                          {new Date(sub.subscribedAt).toLocaleDateString('ar-MA')}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 font-arabic">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-lg font-black text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة أو هودي جديد في الكتالوج'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-white/50 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">
                    اسم المنتج بالإنجليزية (e.g. DERB Heavy Boxy Hoodie):
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">
                    الاسم باللغة العربية (e.g. هودي الدرب بوكسي قطن ثقيل):
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.arabicName}
                    onChange={(e) =>
                      setProductForm({ ...productForm, arabicName: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">السعر بالدرهم (MAD):</label>
                  <input
                    type="number"
                    required
                    value={productForm.priceMAD}
                    onChange={(e) =>
                      setProductForm({ ...productForm, priceMAD: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">وزن القطن (GSM):</label>
                  <input
                    type="number"
                    required
                    value={productForm.gsm}
                    onChange={(e) =>
                      setProductForm({ ...productForm, gsm: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">الكمية بالمخزون:</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockCount}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockCount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">رابط صورة المنتج (Image URL):</label>
                <input
                  type="url"
                  required
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">وصف وتفاصيل القطعة:</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, inStock: e.target.checked })
                    }
                    className="accent-[#CCFF00]"
                  />
                  <span>متوفر للشراء</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isNewArrival}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isNewArrival: e.target.checked })
                    }
                    className="accent-[#CCFF00]"
                  />
                  <span>إصدار جديد</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isLimitedEdition}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isLimitedEdition: e.target.checked })
                    }
                    className="accent-[#CCFF00]"
                  />
                  <span>كمية محدودة</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, featured: e.target.checked })
                    }
                    className="accent-[#CCFF00]"
                  />
                  <span>مميز بالواجهة</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl"
                >
                  حفظ المنتج في المتجر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE PROMO CODE ================= */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 font-arabic">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-lg font-black text-white">إنشاء كود خصم جديد</h3>
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="p-1 text-white/50 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">كود الخصم (e.g. DROP20):</label>
                <input
                  type="text"
                  required
                  placeholder="VIP2026"
                  value={promoForm.code}
                  onChange={(e) =>
                    setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })
                  }
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono uppercase focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">نوع التخفيض:</label>
                  <select
                    value={promoForm.discountType}
                    onChange={(e) =>
                      setPromoForm({
                        ...promoForm,
                        discountType: e.target.value as 'percentage' | 'fixed',
                      })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (MAD)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">القيمة:</label>
                  <input
                    type="number"
                    required
                    value={promoForm.discountValue}
                    onChange={(e) =>
                      setPromoForm({ ...promoForm, discountValue: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">
                  الحد الأدنى للطلب بالدرهم (0 = بدون حد):
                </label>
                <input
                  type="number"
                  value={promoForm.minOrderMAD}
                  onChange={(e) =>
                    setPromoForm({ ...promoForm, minOrderMAD: Number(e.target.value) })
                  }
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">وصف مختصر:</label>
                <input
                  type="text"
                  placeholder="خصم خاص لأعضاء الدرب"
                  value={promoForm.description}
                  onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl"
                >
                  تفعيل الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ORDER FULL DETAILS ================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 font-arabic">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-mono text-[#CCFF00]">
                  {selectedOrderDetails.trackingNumber}
                </span>
                <span className="text-xs text-white/50">تفاصيل الشحنة الكاملة</span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 text-white/50 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#181818] rounded-xl border border-[#262626] space-y-1.5">
                <div className="font-bold text-white text-sm">
                  {selectedOrderDetails.shippingDetails?.fullName}
                </div>
                <div className="text-white/70">
                  📍 {selectedOrderDetails.shippingDetails?.city} -{' '}
                  {selectedOrderDetails.shippingDetails?.address}
                </div>
                <div className="text-white/70 font-mono">
                  📞 {selectedOrderDetails.shippingDetails?.phone}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-bold text-white/80 block">القطع والقياسات المطلوبة:</span>
                <div className="space-y-2">
                  {selectedOrderDetails.items?.map((item, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-[#181818] rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product?.images[0]}
                          alt={item.product?.name}
                          className="w-10 h-10 rounded-lg object-cover bg-black"
                        />
                        <div>
                          <div className="font-bold text-white">{item.product?.name}</div>
                          <div className="text-[10px] text-white/50">
                            القياس: {item.selectedSize} • اللون: {item.selectedColor?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-left font-mono font-bold text-white">
                        {item.quantity}x • {item.product?.priceMAD * item.quantity} MAD
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-black rounded-xl border border-[#222] space-y-1 font-mono text-xs">
                <div className="flex justify-between text-white/60">
                  <span>المجموع الفرعي:</span>
                  <span>{selectedOrderDetails.subtotalMAD || selectedOrderDetails.totalMAD} MAD</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>رسوم التوصيل:</span>
                  <span>
                    {selectedOrderDetails.shippingFeeMAD ? `${selectedOrderDetails.shippingFeeMAD} MAD` : 'مجاني (0 MAD)'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#CCFF00] pt-1 border-t border-[#222]">
                  <span>المبلغ الإجمالي للكاش:</span>
                  <span>{selectedOrderDetails.totalMAD} MAD</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-5 py-2 bg-[#CCFF00] text-black font-black rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
