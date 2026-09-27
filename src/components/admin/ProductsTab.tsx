import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Product } from '../../types';

interface ProductsTabProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onSaveProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

interface ProductForm {
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
}

const defaultForm: ProductForm = {
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
};

export const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  onUpdateProducts,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setForm({
      ...defaultForm,
      id: `derb-drop-${Date.now().toString().slice(-4)}`,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setForm({
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
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.arabicName) return;

    const newProd: Product = {
      id: form.id || `derb-${Date.now()}`,
      name: form.name,
      arabicName: form.arabicName,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      priceMAD: Number(form.priceMAD),
      originalPriceMAD: Number(form.originalPriceMAD),
      category: form.category,
      categoryLabel: form.categoryLabel,
      tags: ['PHILOSTORYA Exclusive', `${form.gsm}GSM`, 'Casablanca Streetwear'],
      images: [
        form.imageUrl,
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
      ],
      colors: [
        { name: 'Onyx Black', hex: '#111111', bgClass: 'bg-black', imageIndex: 0 },
        { name: 'Acid Volt', hex: '#CCFF00', bgClass: 'bg-[#CCFF00]', imageIndex: 1 },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'Oversized'],
      rating: 4.9,
      reviewsCount: 18,
      inStock: form.inStock,
      stockCount: Number(form.stockCount),
      gsm: Number(form.gsm),
      material: form.material,
      fit: form.fit,
      description: form.description,
      details: [
        `${form.gsm}GSM Heavyweight Loopback Fleece`,
        'Double-layered ergonomic hood with no drawstrings',
        'Drop-shoulder boxy silhouette',
        'Pre-shrunk to maintain exact dimensions',
      ],
      careInstructions: [
        'Wash cold inside out at 30°C',
        'Do not tumble dry',
        'Iron on low heat avoiding high-density prints',
      ],
      isNewArrival: form.isNewArrival,
      isBestSeller: form.isBestSeller,
      isLimitedEdition: form.isLimitedEdition,
      featured: form.featured,
    };

    try {
      await onSaveProduct(newProd);
      const updatedList = editingProduct
        ? products.map((p) => (p.id === newProd.id ? newProd : p))
        : [newProd, ...products];
      onUpdateProducts(updatedList);
      setIsModalOpen(false);
    } catch {
      // Error handled by parent
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج من الكتالوج؟')) return;
    try {
      await onDeleteProduct(productId);
      onUpdateProducts(products.filter((p) => p.id !== productId));
    } catch {
      // Error handled by parent
    }
  };

  return (
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
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-[#CCFF00] text-black font-black rounded-xl text-xs flex items-center gap-2 hover:bg-[#b8e600] transition font-arabic"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة إصدار / هودي جديد</span>
        </button>
      </div>

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
                <h4 className="font-bold text-white text-xs truncate">{product.name}</h4>
                <div className="text-[11px] text-[#CCFF00] font-arabic font-bold">
                  {product.arabicName}
                </div>
                <div className="font-mono text-sm font-black text-white">
                  {product.priceMAD} MAD
                </div>
              </div>
            </div>
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
                  onClick={() => handleEdit(product)}
                  className="p-1.5 bg-[#222] hover:bg-[#333] text-white rounded-lg transition"
                  title="تعديل المنتج"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#333] rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4 font-arabic">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-lg font-black text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة قطعة أو هودي جديد في الكتالوج'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-white/50 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">اسم المنتج بالإنجليزية:</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">الاسم باللغة العربية:</label>
                  <input
                    type="text"
                    required
                    value={form.arabicName}
                    onChange={(e) => setForm({ ...form, arabicName: e.target.value })}
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
                    value={form.priceMAD}
                    onChange={(e) => setForm({ ...form, priceMAD: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">وزن القطن (GSM):</label>
                  <input
                    type="number"
                    required
                    value={form.gsm}
                    onChange={(e) => setForm({ ...form, gsm: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80 block">الكمية بالمخزون:</label>
                  <input
                    type="number"
                    required
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">رابط صورة المنتج (Image URL):</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white font-mono focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white/80 block">وصف وتفاصيل القطعة:</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-2.5 bg-[#1A1A1A] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-[#CCFF00]" />
                  <span>متوفر للشراء</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="accent-[#CCFF00]" />
                  <span>إصدار جديد</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.isLimitedEdition} onChange={(e) => setForm({ ...form, isLimitedEdition: e.target.checked })} className="accent-[#CCFF00]" />
                  <span>كمية محدودة</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-[#1A1A1A] rounded-xl cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#CCFF00]" />
                  <span>مميز بالواجهة</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold">
                  إلغاء
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-black rounded-xl">
                  حفظ المنتج في المتجر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
