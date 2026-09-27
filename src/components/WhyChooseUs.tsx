import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Award, Zap } from 'lucide-react';
import { GraffitiCrown } from './GraffitiEmblems';
import { useLanguage } from '../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { t } = useLanguage();

  const guarantees = [
    {
      icon: Award,
      titleKey: 'why.quality.title',
      descKey: 'why.quality.desc',
    },
    {
      icon: Truck,
      titleKey: 'why.cod.title',
      descKey: 'why.cod.desc',
    },
    {
      icon: RotateCcw,
      titleKey: 'why.exchange.title',
      descKey: 'why.exchange.desc',
    },
    {
      icon: ShieldCheck,
      titleKey: 'why.craft.title',
      descKey: 'why.craft.desc',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#0A0A0A] border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#CCFF00] mb-2 font-kvant">
            <GraffitiCrown size={18} /> {t('why.subtitle')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
            {t('why.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className="p-6 bg-[#141414] rounded-3xl border border-[#242424] hover:border-[#CCFF00]/30 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] text-[#CCFF00] flex items-center justify-center mb-4 border border-[#2C2C2C]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-base text-white mb-1 font-display uppercase">
                    {t(g.titleKey)}
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {t(g.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
