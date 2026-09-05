import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Palette, Send, Eye, Share2, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const { t, language } = useStudio();

  const stepIcons = [Palette, Send, Eye, Share2];
  const steps = t('howItWorks', 'steps') || [];

  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{t('howItWorks', 'tag')}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {t('howItWorks', 'title')}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          {t('howItWorks', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = stepIcons[idx] || Palette;
          return (
            <div 
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -bottom-4 -right-2 text-7xl font-display font-black text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.07] transition-colors">
                {item.step || `0${idx + 1}`}
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-8 h-8 rounded-lg bg-white text-black font-mono font-bold text-xs flex items-center justify-center shadow-lg">
                    {item.step || `0${idx + 1}`}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <span>
                  {language === 'kn' ? `ಹಂತ ${idx + 1} / 4` : language === 'te' ? `దశ ${idx + 1} / 4` : `Step ${idx + 1} of 4`}
                </span>
                {idx < 3 && <ArrowRight className="w-3 h-3 text-zinc-600 hidden lg:block ml-auto" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
