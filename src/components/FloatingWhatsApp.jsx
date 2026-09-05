import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WhatsApp } from './Icons';

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const phone = '919731696952';
  const defaultMessage = 'Hi AM Studio! I would like to inquire about creating an interactive digital wedding invitation website.';

  useEffect(() => {
    // Show button after 300px scroll or 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 1500);
    const tooltipTimer = setTimeout(() => setShowTooltip(true), 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 select-none">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-white/20 text-white text-xs py-2 px-3.5 rounded-2xl shadow-2xl animate-fade-in">
          <span>Need a wedding invite? <strong>Chat with us!</strong></span>
          <button 
            onClick={() => setShowTooltip(false)} 
            className="text-zinc-400 hover:text-white ml-1 p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AM Studio on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Subtle glowing ring animation */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25 pointer-events-none" />
        
        <WhatsApp className="w-7 h-7 text-white fill-white relative z-10" />

        {/* Unread badge (1) */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] flex items-center justify-center border-2 border-black shadow">
          1
        </span>
      </a>
    </div>
  );
}
