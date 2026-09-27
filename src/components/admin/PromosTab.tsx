import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { DBPromoCode } from '../../lib/firebaseService';

interface PromosTabProps {
  promos: DBPromoCode[];
  onSavePromo: (promo: DBPromoCode) => Promise<void>;
  onToggleStatus: (promo: DBPromoCode) => void;
  onDeletePromo: (promoId: string) => void;
}

interface PromoForm {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderMAD: number;
  description: string;
}

export const PromosTab: React.FC<PromosTabProps> = ({
  promos,
  onSavePromo,
  onToggleStatus,
  onDeletePromo,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<PromoForm>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderMAD: 0,
    description: 'Special Drop Discount',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) return;
    const cleanCode = form.code.trim().toUpperCase();
    const newPromo: DBPromoCode = {
      id: cleanCode.toLowerCase(),
      code: cleanCode,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderMAD: Number(form.minOrderMAD),
      description: form.description,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    try {
      await onSavePromo(newPromo);
      setIsModalOpen(false);
      setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderMAD: 0, description: '' });
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            أكواد الخصم وحملات التخفيض ({promos.length})
          </h1>
          <p className="text-xs text-white/50">إنشاء وإدارة أكواد الكوبونات المعتمدة عند إتمام الشراء.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
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
                onClick={() => onToggleStatus(promo)}
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
                  {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${promo.discountValue} MAD`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>الحد الأدنى للطلب:</span>
                <span className="font-mono text-white/60">
                  {promo.minOrderMAD ? `${promo.minOrderMAD} MAD` : 'بدون حد'}
                </span>
              </div>
              {promo.description && <p className="text-[11px] text-white/40 pt-1">{promo.description}</p>}
            </div>
            <div className="pt-2 border-t border-[#222] flex justify-end">
              <button
                onClick={() => onDeletePromo(promo.id)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الكود</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 font-arabic">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-lg font-black text-white">إنشاء كود خصم جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-white/50 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">كود الخصم (e.g. DROP20):</label>
                <input
                  type="text"
                  required
                  placeholder="VIP2026"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono uppercase focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">نوع التخفيض:</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'fixed' })}
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
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">الحد الأدنى للطلب بالدرهم (0 = بدون حد):</label>
                <input
                  type="number"
                  value={form.minOrderMAD}
                  onChange={(e) => setForm({ ...form, minOrderMAD: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">وصف مختصر:</label>
                <input
                  type="text"
                  placeholder="خصم خاص لأعضاء فيلوستوريا"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold">
                  إلغاء
                </button>
                <button type="submit" className="px-5 py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl">
                  تفعيل الكود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
