import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Zap } from 'lucide-react';
import { GraffitiCrown } from './GraffitiEmblems';
import { subscribeToNewsletter } from '../lib/firebaseService';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await subscribeToNewsletter(email);
      setIsSubscribed(true);
    } catch (err) {
      console.error('Newsletter error:', err);
      // Still show success to user
      setIsSubscribed(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="py-16 sm:py-20 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] border border-[#262626] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Background Decorative Neon Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1C] border border-[#2E2E2E] text-[#CCFF00] text-xs font-black uppercase tracking-wider font-kvant">
              <GraffitiCrown size={16} /> VIP DROP ACCESS
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              UNLOCK 10% OFF YOUR FIRST DROP
            </h2>

            <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto">
              Join the DERB Collective. Receive notifications 2 hours before limited 500GSM drops go live.
            </p>

            {isSubscribed ? (
              <div className="p-4 bg-[#181818] rounded-2xl border border-[#CCFF00]/40 text-center animate-fade-in max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 font-black text-sm text-[#CCFF00] font-kvant">
                  <Check className="w-5 h-5" /> You're on the Casablanca VIP list!
                </div>
                <p className="text-xs text-white/80 mt-1">
                  Use coupon code <strong className="text-[#CCFF00] underline font-mono">MOROCCO10</strong> at checkout for 10% OFF.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-[#181818] text-white border border-[#2C2C2C] rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-[#CCFF00] hover:bg-[#B8E600] text-black font-black uppercase text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer font-kvant"
                >
                  <span>Claim 10%</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <span className="block text-[11px] text-white/40 pt-1">
              No spam. Unsubscribe anytime. Casablanca, Morocco.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
