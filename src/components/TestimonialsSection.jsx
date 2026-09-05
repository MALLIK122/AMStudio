import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Star, Heart } from 'lucide-react';

export default function TestimonialsSection() {
  const { t } = useStudio();
  const reviews = t('testimonials', 'items') || [];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono tracking-widest text-zinc-200 uppercase font-medium">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>{t('testimonials', 'tag')}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {t('testimonials', 'title')}
        </h2>
        <p className="text-zinc-200 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
          {t('testimonials', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-zinc-100 text-xs sm:text-sm font-normal leading-relaxed mb-6 italic">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-white text-sm sm:text-base">
                  {rev.couple}
                </div>
                <div className="text-xs font-mono text-zinc-300 font-medium">
                  {rev.location}
                </div>
              </div>
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-zinc-200 font-medium">
                {rev.weddingType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
