import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const { t } = useStudio();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = t('faq', 'items') || [];

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>{t('faq', 'tag')}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {t('faq', 'title')}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          {t('faq', 'subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-panel border border-white/10 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-white">
                    {faq.q}
                  </h3>
                </div>
                <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white text-black' : 'text-zinc-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-2 text-zinc-300 text-xs sm:text-sm font-light leading-relaxed border-t border-white/5 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
