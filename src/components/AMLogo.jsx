import React, { useState, useRef } from 'react';

/**
 * AM Studio Official Creative Logo
 * Pure White geometric 'A' & 'M' with botanical serif monogram.
 * Features an interactive spotlight: wherever cursor or mobile finger is on the emblem,
 * ONLY that localized spot turns jet black with a crisp white lens.
 */
export default function AMLogo({ 
  size = "md", 
  withText = true, 
  className = "",
  interactive = true, 
}) {
  const sizeMap = {
    xs: { box: "w-8 h-8", font: "text-xs", radius: 13 },
    sm: { box: "w-10 h-10", font: "text-sm", radius: 16 },
    md: { box: "w-12 h-12", font: "text-base", radius: 19 },
    lg: { box: "w-20 h-20", font: "text-xl", radius: 28 },
    xl: { box: "w-28 h-28", font: "text-3xl", radius: 36 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const [isActive, setIsActive] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 });
  const emblemRef = useRef(null);

  const updateSpot = (clientX, clientY) => {
    if (!emblemRef.current) return;
    const rect = emblemRef.current.getBoundingClientRect();
    setSpotPos({
      x: Math.round(clientX - rect.left),
      y: Math.round(clientY - rect.top),
    });
    setIsActive(true);
  };

  const handleMouseMove = (e) => {
    if (!interactive) return;
    updateSpot(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e) => {
    if (!interactive) return;
    updateSpot(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsActive(false);
  };

  const handleTouchStart = (e) => {
    if (!interactive || !e.touches || e.touches.length === 0) return;
    updateSpot(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!interactive || !e.touches || e.touches.length === 0) return;
    updateSpot(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsActive(false);
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Emblem with Botanical Serif Monogram */}
      <div 
        ref={emblemRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative ${currentSize.box} rounded-2xl bg-black/90 flex items-center justify-center p-1.5 shadow-2xl transition-transform duration-200 hover:scale-105 border border-white/20 hover:border-white overflow-hidden ${interactive ? 'cursor-pointer' : ''}`}
      >
        {/* Base White Logo */}
        <img
          src="/am-logo-transparent.png"
          alt="AM Studio Official Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] select-none pointer-events-none"
          loading="eager"
        />

        {/* Interactive Inverted Spot: Only where cursor/finger is, turns black */}
        {interactive && (
          <>
            {/* White backdrop lens inside the spot */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-100 ease-out"
              style={{
                opacity: isActive ? 1 : 0,
                clipPath: isActive 
                  ? `circle(${currentSize.radius}px at ${spotPos.x}px ${spotPos.y}px)` 
                  : 'circle(0px at 0 0)',
                WebkitClipPath: isActive 
                  ? `circle(${currentSize.radius}px at ${spotPos.x}px ${spotPos.y}px)` 
                  : 'circle(0px at 0 0)',
                backgroundColor: '#ffffff',
              }}
            />

            {/* Black logo pixels inside that spot only */}
            <img
              src="/am-logo-transparent.png"
              alt="AM Studio Logo Spot"
              className="w-full h-full object-contain absolute inset-0 p-1.5 pointer-events-none select-none transition-opacity duration-100 ease-out"
              style={{
                filter: 'brightness(0)',
                opacity: isActive ? 1 : 0,
                clipPath: isActive 
                  ? `circle(${currentSize.radius}px at ${spotPos.x}px ${spotPos.y}px)` 
                  : 'circle(0px at 0 0)',
                WebkitClipPath: isActive 
                  ? `circle(${currentSize.radius}px at ${spotPos.x}px ${spotPos.y}px)` 
                  : 'circle(0px at 0 0)',
              }}
            />
          </>
        )}

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
