import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Trash2,
  Phone,
  MessageSquare,
  MapPin,
  X,
} from 'lucide-react';
import { Order } from '../../types';
import { MOROCCAN_CITIES } from '../../data/products';

interface OrdersTabProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onDelete: (orderId: string) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateStatus,
  onDelete,
}) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderCityFilter, setOrderCityFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        !orderSearch ||
        order.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.shippingDetails?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.shippingDetails?.phone?.includes(orderSearch) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchCity = orderCityFilter === 'all' || order.shippingDetails?.city === orderCityFilter;
      return matchSearch && matchStatus && matchCity;
    });
  }, [orders, orderSearch, orderStatusFilter, orderCityFilter]);

  return (
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">تغيير الحالة:</span>
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                    className="px-2.5 py-1 bg-[#222] border border-[#333] rounded-lg text-xs text-white focus:outline-none focus:border-[#CCFF00] font-bold"
                  >
                    <option value="confirmed">مؤكدة (Confirmed)</option>
                    <option value="processing">قيد التجهيز (Processing)</option>
                    <option value="shipped">في الطريق للتوصيل (Shipped)</option>
                    <option value="delivered">تم التوصيل واستلام الكاش (Delivered)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
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
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${(order.shippingDetails?.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `مرحباً ${order.shippingDetails?.fullName || ''}، معكم خدمة الزبائن من PHILOSTORYA Streetwear بخصوص طلبيتكم رقم (${order.trackingNumber}) بمبلغ ${order.totalMAD} درهم (الدفع عند الاستلام). نود تأكيد موعد التوصيل في ${order.shippingDetails?.city}.`
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
                      onClick={() => onDelete(order.id)}
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
                  {selectedOrderDetails.shippingDetails?.city} -{' '}
                  {selectedOrderDetails.shippingDetails?.address}
                </div>
                <div className="text-white/70 font-mono">
                  {selectedOrderDetails.shippingDetails?.phone}
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-white/80 block">القطع والقياسات المطلوبة:</span>
                <div className="space-y-2">
                  {selectedOrderDetails.items?.map((item, i) => (
                    <div key={i} className="p-2.5 bg-[#181818] rounded-xl flex items-center justify-between">
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
