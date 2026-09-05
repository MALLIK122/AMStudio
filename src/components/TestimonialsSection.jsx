import React from 'react';
import { Star, Heart, Sparkles } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      couple: 'Arjun & Ananya',
      location: 'Bangalore, Karnataka',
      weddingType: 'Luxury Traditional Wedding',
      quote: 'Our guests were blown away by the live music and Google Maps directions! Many of our relatives from abroad said it was the most elegant invitation they had ever seen. The 24h delivery was unbelievable!',
      kannada: 'ನಮ್ಮ ಮದುವೆಗೆ AM Studio ಮಾಡಿಕೊಟ್ಟ ವೆಬ್‌ಸೈಟ್ ನೋಡಿ ಎಲ್ಲ ಅತಿಥಿಗಳು ಆಶ್ಚರ್ಯಪಟ್ಟರು! ಮ್ಯೂಸಿಕ್ ಮತ್ತು ಮ್ಯಾಪ್ಸ್ ಅದ್ಭುತವಾಗಿತ್ತು.',
      rating: 5,
    },
    {
      couple: 'Praveen & Sneha',
      location: 'Davanagere, Karnataka',
      weddingType: 'Grand Palace Celebration',
      quote: 'The RSVP feature saved us so much time managing catering counts. Sharing the link on WhatsApp with our photo card looked 100 times better than boring PDF cards. Highly recommended!',
      kannada: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಫೋಟೋ ಕಾರ್ಡ್ ಪ್ರಿವ್ಯೂ ನೋಡಿ ಎಲ್ಲರೂ ತುಂಬಾ ಮೆಚ್ಚಿಕೊಂಡರು. RSVP ಫೀಚರ್‌ನಿಂದ ನಮಗೆ ತುಂಬಾ ಸಹಾಯವಾಯಿತು.',
      rating: 5,
    },
    {
      couple: 'Rohan & Meera',
      location: 'Coorg / Mysore',
      weddingType: 'Destination Resort Wedding',
      quote: 'From the romantic background song to the multi-event Haldi and Sangeet timelines, everything was crafted to absolute perfection. The team accommodated all our photo tweaks instantly!',
      kannada: 'ಮೆಹಂದಿ, ಸಂಗೀತ ಮತ್ತು ಮುಹೂರ್ತದ ವೇಳಾಪಟ್ಟಿ ಹಾಗೂ ರೋಮ್ಯಾಂಟಿಕ್ ಹಾಡು ಅತ್ಯಂತ ಸುಂದರವಾಗಿ ಮೂಡಿಬಂದಿತ್ತು.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Couple Testimonials</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          CELEBRATED BY REAL COUPLES
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          Hear what couples and their families have to say about their AM Studio digital invitations.
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
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm italic font-serif leading-relaxed mb-3">
                &ldquo;{rev.kannada}&rdquo;
              </p>

              <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="font-display font-bold text-white text-sm sm:text-base">
                  {rev.couple}
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  {rev.location}
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-300">
                {rev.weddingType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
