import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Truck,
  Layers,
  MapPin,
} from 'lucide-react';
import { Product, Order } from '../../types';

interface OverviewTabProps {
  orders: Order[];
  products: Product[];
  subscribers: { id: string; email: string; subscribedAt: string }[];
  onOpenNewProduct: () => void;
  onSwitchTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  orders,
  products,
  subscribers,
  onOpenNewProduct,
  onSwitchTab,
  onSelectOrder,
}) => {
  const totalRevenueMAD = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalMAD || 0), 0),
    [orders]
  );

  const codPendingMAD = useMemo(
    () =>
      orders
        .filter((o) => o.paymentMethod === 'cod' && o.status !== 'delivered')
        .reduce((sum, o) => sum + (o.totalMAD || 0), 0),
    [orders]
  );

  const totalStockCount = useMemo(
    () => products.reduce((sum, p) => sum + (p.stockCount || 0), 0),
    [products]
  );

  const topCitiesCount = useMemo(() => {
    const counts: { [key: string]: number } = {};
    orders.forEach((o) => {
      const c = o.shippingDetails?.city || 'Other';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  return (
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
            onClick={onOpenNewProduct}
            className="px-4 py-2.5 bg-[#CCFF00] text-black font-black rounded-xl text-xs flex items-center gap-2 transition hover:bg-[#b8e600]"
          >
            <span className="w-4 h-4">+</span>
            <span>إضافة إصدار جديد</span>
          </button>
        </div>
      </div>

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
          <div className="text-[11px] text-white/40">قيد الشحن والتوصيل مع موزعي المدن</div>
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
            <span>مشتركو نادي فيلوستوريا (VIP)</span>
            <Users className="w-4 h-4 text-[#CCFF00]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mb-1">
            {subscribers.length} <span className="text-sm text-white/60">عضو</span>
          </div>
          <div className="text-[11px] text-white/40">جاهزون لإشعارات الإصدارات الحصرية</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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

        <div className="lg:col-span-7 bg-[#141414] border border-[#222] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#CCFF00]" />
              <span>أحدث الطلبيات المستلمة</span>
            </h3>
            <button
              onClick={() => onSwitchTab('orders')}
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
                    onSelectOrder(order);
                    onSwitchTab('orders');
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
  );
};
