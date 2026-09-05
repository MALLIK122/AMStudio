import React from 'react';
import { Palette, Send, Eye, Share2, ArrowRight, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      icon: Palette,
      title: 'Choose Your Aesthetic',
      kannada: 'ಡಿಸೈನ್ ಆಯ್ಕೆ ಮಾಡಿ',
      description: 'Explore our selected live invitation designs or share your unique vision—whether royal heritage, destination modern, or minimalist floral.',
    },
    {
      step: '02',
      icon: Send,
      title: 'Share Details & Photos',
      kannada: 'ವಿವರ ಮತ್ತು ಫೋಟೋ ಹಂಚಿಕೊಳ್ಳಿ',
      description: 'Send your dates, muhurtham timings, venue locations, couple portraits, and favorite background song directly via WhatsApp or our simple form.',
    },
    {
      step: '03',
      icon: Eye,
      title: 'Live Mobile Preview in 24-48h',
      kannada: '24-48 ಗಂಟೆಗಳಲ್ಲಿ ಲೈವ್ ಪ್ರಿವ್ಯೂ',
      description: 'Receive an interactive private link to test on your phone. Review music playback, maps navigation, countdown, and request any fine-tune edits.',
    },
    {
      step: '04',
      icon: Share2,
      title: 'One-Click WhatsApp Launch',
      kannada: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಹಂಚಿಕೊಳ್ಳಿ',
      description: 'Your invitation is live! Broadcast to all your family and friends across WhatsApp and social media with an automated gorgeous photo preview card.',
    },
  ];

  return (
    <section id="process" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Effortless Creation</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          HOW WE BRING YOUR INVITATION TO LIFE
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          From initial consultation to guest broadcast in 4 simple, stress-free steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -bottom-4 -right-2 text-7xl font-display font-black text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.07] transition-colors">
                {item.step}
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="w-8 h-8 rounded-lg bg-white text-black font-mono font-bold text-xs flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-white/30 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <div className="text-[11px] font-mono text-zinc-400 mb-2.5 font-medium">
                  {item.kannada}
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                <span>Step {idx + 1} of 4</span>
                {idx < 3 && <ArrowRight className="w-3 h-3 text-zinc-600 hidden lg:block ml-auto" />}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
