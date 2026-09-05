import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { WhatsApp } from './Icons';

export default function PricingSection() {
  const phone = '919731696952';

  const packages = [
    {
      name: 'Silver / Classic',
      kannada: 'ಸಿಲ್ವರ್ / ಕ್ಲಾಸಿಕ್ ಪ್ಯಾಕೇಜ್',
      price: '₹1,999',
      popular: false,
      tagline: 'Ideal for intimate weddings and focused single-ceremony announcements.',
      features: [
        'Single-page luxury interactive invitation',
        'Couple story & high-res portrait hero',
        'Auspicious Muhurtham live countdown',
        '1-Click Google Maps venue navigation',
        'Rich WhatsApp & social media sharing card',
        '100% responsive across mobile & desktop',
        '1 Year high-speed cloud hosting',
        '24-48 Hours fast delivery',
      ],
      whatsappMsg: 'Hi AM Studio! I would like to book the Silver / Classic Wedding Invitation package (₹1,999). Please share the next steps!',
    },
    {
      name: 'Gold / Royal',
      kannada: 'ಗೋಲ್ಡ್ / ರಾಯಲ್ ಪ್ಯಾಕೇಜ್',
      price: '₹3,999',
      popular: true,
      tagline: 'Our most loved package for complete multi-day grand celebrations.',
      features: [
        'Everything in Silver / Classic package',
        'Multi-event itinerary (Haldi, Mehendi, Sangeet, Muhurtham, Reception)',
        'Custom romantic background audio & music playback',
        'Real-time RSVP guest attendance & headcount tracking',
        'Animated floral & aesthetic scroll reveals',
        'One-click Add to Google / Apple Calendar',
        'Unlimited revisions & instant timing updates',
        'Dedicated VIP designer support',
      ],
      whatsappMsg: 'Hi AM Studio! I would like to book the Gold / Royal Wedding Invitation package (₹3,999). Please share the theme options and details!',
    },
    {
      name: 'Diamond / Bespoke Luxury',
      kannada: 'ಡೈಮಂಡ್ / ಬೆಸ್ಪೋಕ್ ಲಕ್ಸುರಿ',
      price: '₹6,999',
      popular: false,
      tagline: 'The ultimate royal celebration portal with custom domain & 3D elements.',
      features: [
        'Everything in Gold / Royal package',
        'Custom personalized domain (e.g. arjunwedsmeera.in)',
        'Interactive 3D WebGL animations & immersive entrance',
        'Dining Table Standee QR Code printable artwork',
        'Guest Photo Upload Wall & Digital Wishes Book',
        'Dual-language support (ಕನ್ನಡ + English)',
        'Express 24h turnaround guarantee',
        'Lifetime digital keepsake cloud archive',
      ],
      whatsappMsg: 'Hi AM Studio! I would like to book the Diamond / Bespoke Luxury package with custom domain (₹6,999). Please connect with me!',
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Transparent Investment</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          SIMPLE, HONEST WEDDING PACKAGES
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          No hidden fees. Every package includes mobile optimization, cloud hosting, Google Maps, and dedicated support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              pkg.popular 
                ? 'bg-zinc-950 border-2 border-white shadow-2xl shadow-white/10 lg:-translate-y-2' 
                : 'glass-panel border border-white/15 hover:border-white/40'
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-white text-black text-[11px] font-mono font-bold uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Most Popular</span>
              </div>
            )}

            <div>
              <div className="mb-6">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <div className="text-xs font-mono text-zinc-400 font-medium mb-3">
                  {pkg.kannada}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {pkg.price}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 uppercase">
                    All Inclusive
                  </span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {pkg.tagline}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 mb-8">
                {pkg.features.map((feat, fIdx) => (
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
              href={`https://wa.me/${phone}?text=${encodeURIComponent(pkg.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3.5 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-200 ${
                pkg.popular
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                  : 'border border-white/20 text-white hover:bg-white hover:text-black'
              }`}
            >
              <WhatsApp className="w-4 h-4 text-green-500" />
              <span>Book via WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-12 p-5 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3 mx-auto sm:mx-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white font-bold">
              100% Satisfaction Guarantee
            </div>
            <div className="text-[11px] text-zinc-400 font-light">
              Unlimited revisions on music, photos & content until you are completely thrilled with your live preview.
            </div>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 mx-auto sm:mx-0">
          Need custom requirements? <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Hi AM Studio! I have custom requirements for our wedding invitation website.")}`} target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-zinc-200 font-semibold">Chat with us</a>
        </div>
      </div>
    </section>
  );
}
