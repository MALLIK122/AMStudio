import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { WhatsApp } from './Icons';

export default function PricingSection() {
  const { t, language, profile } = useStudio();
  const phone = (profile.phone || '9731696952').replace(/\D/g, '');
  const cleanPhone = phone.length === 10 ? `91${phone}` : phone;

  const plans = t('pricing', 'plans') || [];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{t('pricing', 'tag')}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {t('pricing', 'title')}
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          {t('pricing', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {plans.map((pkg, idx) => {
          const isPopular = pkg.popular || pkg.id === 'gold';
          const whatsappMsg = `Hi AM Studio! I would like to book the ${pkg.name} (${pkg.price}). Please share the next steps!`;

          return (
            <div
              key={pkg.id || idx}
              className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isPopular 
                  ? 'bg-zinc-950 border-2 border-white shadow-2xl shadow-white/10 lg:-translate-y-2' 
                  : 'glass-panel border border-white/15 hover:border-white/40'
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('pricing', 'popular') || 'Most Popular'}</span>
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 uppercase">
                      {pkg.period || 'one-time'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                    {pkg.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                  {(pkg.features || []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300 font-light">
                      <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 ${
                  isPopular
                    ? 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                    : 'border border-white/20 text-white hover:bg-white hover:text-black'
                }`}
              >
                <WhatsApp className="w-4 h-4 text-green-500" />
                <span>{t('pricing', 'bookNow')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-5 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              {language === 'kn' ? '100% ತೃಪ್ತಿಯ ಭರವಸೆ' : language === 'te' ? '100% సంతృప్తి హామీ' : '100% Satisfaction Guarantee'}
            </div>
            <div className="text-[11px] text-zinc-400 font-light">
              {language === 'kn' 
                ? 'ನಿಮ್ಮ ಲೈವ್ ಪ್ರಿವ್ಯೂ ಪರಿಪೂರ್ಣವಾಗುವವರೆಗೆ ಮ್ಯೂಸಿಕ್, ಫೋಟೋ ಮತ್ತು ವಿವರಗಳ ಮೇಲೆ ಅನ್‌ಲಿಮಿಟೆಡ್ ಬದಲಾವಣೆಗಳು.'
                : language === 'te'
                ? 'మీ లైవ్ ప్రివ్యూ పరిపూర్ణమయ్యే వరకు సంగీతం, ఫోటోలు మరియు వివరాలపై అపరిమిత మార్పులు.'
                : 'Unlimited revisions on music, photos & content until you are completely thrilled with your live preview.'}
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 mx-auto sm:mx-0">
          {language === 'kn' ? 'ವಿಶೇಷ ಅಗತ್ಯತೆಗಳಿವೆಯೇ?' : language === 'te' ? 'ప్రత్యేక అవసరాలు ఉన్నాయా?' : 'Need custom requirements?'}{' '}
          <a href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent("Hi AM Studio! I have custom requirements for our wedding invitation website.")}`} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-zinc-200 font-semibold">
            {language === 'kn' ? 'ನಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಿ' : language === 'te' ? 'మాతో మాట్లాడండి' : 'Chat with us'}
          </a>
        </div>
      </div>
    </section>
  );
}
