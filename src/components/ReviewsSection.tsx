import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote, Plus, X, MessageSquare, Send } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '../data/products';
import { GraffitiCrown } from './GraffitiEmblems';
import { useAuth } from '../context/AuthContext';
import { addCustomerReview, fetchAllReviews, DBReview } from '../lib/firebaseService';

export const ReviewsSection: React.FC = () => {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState<any[]>(CUSTOMER_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('');
  const [cityName, setCityName] = useState<string>('Casablanca');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [arabicComment, setArabicComment] = useState<string>('');
  const [productPurchased, setProductPurchased] = useState<string>('Casablanca Heavyweight 500GSM Hoodie');
  const [fitFeedback, setFitFeedback] = useState<string>('Perfect Boxy Fit');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load reviews from Firestore
  useEffect(() => {
    async function load() {
      try {
        const firestoreReviews = await fetchAllReviews();
        if (firestoreReviews && firestoreReviews.length > 0) {
          // Merge custom reviews at the beginning
          setReviews([...firestoreReviews, ...CUSTOMER_REVIEWS]);
        }
      } catch (err) {
        console.error('Error loading reviews from Firestore:', err);
      }
    }
    load();
  }, []);

  const handleOpenModal = () => {
    if (user?.displayName && !authorName) {
      setAuthorName(user.displayName);
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const newReview: DBReview = {
        id: `rev_${Date.now()}`,
        userId: user?.uid || 'guest',
        author: authorName,
        city: cityName,
        rating,
        comment,
        ...(arabicComment.trim() ? { arabicComment: arabicComment.trim() } : {}),
        productPurchased,
        fitFeedback,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      await addCustomerReview(newReview);
      setReviews((prev) => [newReview, ...prev]);
      setSuccessMsg('Thank you! Your verified review is now live.');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg(null);
        setComment('');
        setArabicComment('');
      }, 1500);
    } catch (err) {
      console.error('Error saving review to Firestore:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-2 font-kvant">
              <GraffitiCrown size={18} /> VERIFIED MOROCCAN BUYERS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              WHAT THE STREETS ARE SAYING
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black text-xs font-black uppercase rounded-xl transition shadow-lg flex items-center gap-1.5 cursor-pointer font-kvant"
            >
              <Plus className="w-4 h-4" /> Write a Review
            </button>

            <div className="flex items-center gap-2 p-3 bg-[#141414] rounded-2xl border border-[#262626] shadow-md">
              <div className="flex text-[#CCFF00]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-black text-sm text-white font-kvant">4.95 / 5.0</span>
              <span className="text-xs text-white/50">• {reviews.length}+ Reviews in Morocco</span>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev, index) => (
            <div
              key={rev.id || index}
              className="p-6 bg-[#141414] rounded-3xl border border-[#242424] hover:border-[#CCFF00]/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Verified */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#CCFF00]">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-black bg-[#CCFF00] px-2 py-0.5 rounded uppercase font-kvant flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                </div>

                <Quote className="w-6 h-6 text-[#CCFF00]/30 mb-2" />

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic mb-3">
                  "{rev.comment}"
                </p>

                {rev.arabicComment && (
                  <p dir="rtl" className="text-xs sm:text-sm text-[#CCFF00] font-arabic font-bold mb-4 text-right tracking-normal leading-relaxed">
                    « {rev.arabicComment} »
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#222] flex items-center justify-between">
                <div>
                  <span className="font-black text-xs text-white block">
                    {rev.author}
                  </span>
                  <span className="text-[11px] text-[#CCFF00] font-mono block">
                    {rev.city} • {rev.date || rev.createdAt}
                  </span>
                  <span className="text-[10px] text-white/40 block mt-0.5">
                    Ordered: {rev.productPurchased}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-1 bg-[#1F1F1F] text-white font-mono rounded-lg border border-[#2C2C2C]">
                  {rev.fitFeedback || 'True to Size'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Submitting a Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#202020] text-white/70 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-black text-[#CCFF00] uppercase tracking-wider mb-2 font-kvant">
                <MessageSquare className="w-4 h-4" /> Share Your Fit Feedback
              </div>
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-4">
                Leave a Verified Review
              </h3>

              {successMsg ? (
                <div className="p-4 bg-[#1C1C1C] border border-[#CCFF00] rounded-2xl text-[#CCFF00] font-bold text-center">
                  {successMsg}
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/70 font-bold mb-1">Your Name / الاسم *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yassine B."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full p-2.5 bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-white/70 font-bold mb-1">City / المدينة *</label>
                      <select
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        className="w-full p-2.5 bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                      >
                        <option value="Casablanca">Casablanca (الدار البيضاء)</option>
                        <option value="Rabat">Rabat (الرباط)</option>
                        <option value="Marrakech">Marrakech (مراكش)</option>
                        <option value="Tangier">Tangier (طنجة)</option>
                        <option value="Fes">Fes (فاس)</option>
                        <option value="Agadir">Agadir (أكادير)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 font-bold mb-1">Rating / النجوم *</label>
                      <div className="flex items-center gap-1 pt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="text-lg focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 cursor-pointer ${
                                star <= rating ? 'text-[#CCFF00] fill-current' : 'text-white/20'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 font-bold mb-1">Product Purchased *</label>
                    <input
                      type="text"
                      value={productPurchased}
                      onChange={(e) => setProductPurchased(e.target.value)}
                      className="w-full p-2.5 bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-bold mb-1">Review in English / French *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your thoughts on the GSM cotton weight, boxy cut, embroidery..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2.5 bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl text-white focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-bold mb-1">تعليق بالدارجة المغربية (اختياري)</label>
                    <input
                      dir="rtl"
                      type="text"
                      placeholder="مثال: التوب واعر بزاف والتقطيعة Oversized مثالية"
                      value={arabicComment}
                      onChange={(e) => setArabicComment(e.target.value)}
                      className="w-full p-2.5 bg-[#1C1C1C] border border-[#2C2C2C] rounded-xl text-white font-arabic focus:outline-none focus:border-[#CCFF00]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer font-kvant mt-4"
                  >
                    {submitting ? 'Posting Review...' : 'Submit Verified Review'}
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
