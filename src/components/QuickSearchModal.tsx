import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const popularTags = ['All', '500GSM', 'Hoodies', 'Tees', 'Cargo', 'Arabic Typography', 'Limited'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.arabicName.includes(searchTerm) ||
        p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTag =
        selectedTag === 'All' ||
        p.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())) ||
        (selectedTag === '500GSM' && p.gsm >= 500);

      return matchesSearch && matchesTag;
    });
  }, [products, searchTerm, selectedTag]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div className="bg-[#121212] border border-[#2A2A2A] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-[#222] bg-[#161616] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#CCFF00]" />
          <input
            type="text"
            autoFocus
            placeholder="Search 500GSM hoodies, oversized tees, tactical cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-sm sm:text-base font-semibold bg-transparent focus:outline-none text-white placeholder:text-white/40"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-white/40 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-[#222] rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="p-3 bg-[#181818] border-b border-[#242424] flex gap-1.5 overflow-x-auto pb-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-black uppercase transition font-kvant flex-shrink-0 ${
                selectedTag === tag
                  ? 'bg-[#CCFF00] text-black shadow-sm'
                  : 'bg-[#121212] border border-[#2A2A2A] text-white/70 hover:border-[#CCFF00]/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2.5">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-white/40 text-xs">
              No matching streetwear pieces found for "{searchTerm}".
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center gap-3.5 p-3 bg-[#181818] rounded-xl border border-[#262626] hover:border-[#CCFF00]/40 hover:shadow-lg cursor-pointer transition group"
              >
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-14 h-16 object-cover rounded-lg bg-[#0A0A0A] group-hover:scale-105 transition"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#CCFF00] uppercase font-kvant">
                      {prod.categoryLabel}
                    </span>
                    <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-mono text-white/80">
                      {prod.gsm}GSM
                    </span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-[#CCFF00] transition">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-white/50 font-arabic truncate">
                    {prod.arabicName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-[#CCFF00] font-kvant block">
                    {prod.priceMAD} <span className="text-[10px] text-white">MAD</span>
                  </span>
                  <div className="flex items-center gap-1 text-[#CCFF00] text-[10px] justify-end">
                    <Star className="w-3 h-3 fill-[#CCFF00]" />
                    <span>{prod.rating}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#CCFF00] group-hover:translate-x-0.5 transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
