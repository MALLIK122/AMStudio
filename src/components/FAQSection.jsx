import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How long does it take to create our wedding invitation website?",
      kannada: "ವೆಬ್‌ಸೈಟ್ ಮಾಡಲು ಎಷ್ಟು ದಿನ ಬೇಕಾಗುತ್ತದೆ?",
      a: "Our standard turnaround time is just 24 to 48 hours! Once you provide your wedding dates, events itinerary, photos, and music preferences, we deliver an interactive live mobile preview link for your approval.",
    },
    {
      q: "Can we add background songs of our choice?",
      kannada: "ನಮ್ಮಿಷ್ಟದ ಹಾಡುಗಳನ್ನು (Background Music) ಹಾಕಬಹುದೇ?",
      a: "Yes, absolutely! You can choose any romantic track, Kannada traditional instrumental (Nadaswaram / Flute / Veena), or Bollywood melody. When guests open or scroll the link, your audio plays smoothly.",
    },
    {
      q: "How do we share the digital invitation with our guests?",
      kannada: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಅತಿಥಿಗಳಿಗೆ ಕಳುಹಿಸುವುದು ಹೇಗೆ?",
      a: "It's as simple as sharing a link! When you paste your invitation link into WhatsApp, Instagram, or SMS, it automatically generates a rich preview card with your couple photo, names, and wedding date.",
    },
    {
      q: "How long does the invitation website stay live?",
      kannada: "ಮದುವೆ ನಂತರ ವೆಬ್‌ಸೈಟ್ ಎಷ್ಟು ದಿನ ಲೈವ್ ಇರುತ್ತದೆ?",
      a: "All packages include a minimum of 1 full year of active cloud hosting. Our Bespoke package includes lifetime archival so you can revisit your wedding website on anniversaries!",
    },
    {
      q: "Do you design wedding invitations in Kannada?",
      kannada: "ಕನ್ನಡದಲ್ಲಿ ಆಮಂತ್ರಣ ಪತ್ರಿಕೆ ಡಿಸೈನ್ ಮಾಡುತ್ತೀರಾ?",
      a: "Yes! We specialize in authentic Kannada wedding invitation typography with traditional shlokas, muhurtham details, and family lineage alongside contemporary English formatting.",
    },
    {
      q: "Can we update timings or venue details if there is a change later?",
      kannada: "ನಂತರ ವೆನ್ಯೂ ಅಥವಾ ಸಮಯ ಬದಲಾದರೆ ಅಪ್ಡೇಟ್ ಮಾಡಬಹುದೇ?",
      a: "Yes, with zero hassle! Because it is a live web application, any change you request is updated instantaneously on the live link. No need to reprint or resend anything to guests.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
          <span>Clear Answers</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          Everything you need to know about our digital wedding invitation creations.
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
                  <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1">
                    {faq.q}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400">
                    {faq.kannada}
                  </p>
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
