import React from 'react';
import { Star, Trash2 } from 'lucide-react';
import { DBReview } from '../../lib/firebaseService';

interface ReviewsTabProps {
  reviews: DBReview[];
  onDeleteReview: (reviewId: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, onDeleteReview }) => {
  return (
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
          <div key={rev.id} className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-3">
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
                onClick={() => onDeleteReview(rev.id)}
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
  );
};
