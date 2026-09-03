import React from 'react';

/**
 * AM Studio Official Creative Logo
 * Pure White geometric 'A' & 'M' with architectural angles and high-contrast monochrome aesthetic.
 */
export default function AMLogo({ size = "md", withText = true, className = "" }) {
  const sizeMap = {
    xs: { box: "w-8 h-8", font: "text-xs" },
    sm: { box: "w-10 h-10", font: "text-sm" },
    md: { box: "w-12 h-12", font: "text-base" },
    lg: { box: "w-20 h-20", font: "text-xl" },
    xl: { box: "w-28 h-28", font: "text-3xl" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Emblem with Botanical Serif Monogram */}
      <div className={`relative ${currentSize.box} rounded-2xl bg-black/90 flex items-center justify-center p-1.5 shadow-2xl transition-all duration-300 group-hover:scale-105 border border-white/20 group-hover:border-white group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] overflow-hidden`}>
        <img
          src="/am-logo-transparent.png"
          alt="AM Studio Official Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
          loading="eager"
        />

        {/* Glossy subtle ambient sheen */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
      </div>

      {withText && (
        <div>
          <div className={`font-display font-black tracking-wider text-white flex items-center gap-1.5 ${currentSize.font}`}>
            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">AM</span>
            <span className="font-light text-zinc-300">STUDIO</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 -mt-0.5">
            Design &amp; Engineering
          </p>
        </div>
      )}
    </div>
  );
}
