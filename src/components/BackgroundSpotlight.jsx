import React, { useEffect, useRef } from 'react';

/**
 * BackgroundSpotlight - Multi-Node Viscous Fluid Light System
 *
 * Renders an organic, flowing white liquid spotlight that streams and elongates
 * behind the cursor on desktop and finger touches on mobile.
 *
 * Core Architectural Highlights:
 * 1. 6-Node Viscous Fluid Physics:
 *    - Head follows target with swift elastic spring
 *    - Mid nodes trail with organic fluid drag
 *    - Tail nodes follow with liquid momentum and dissipation
 *    - Stretches into a glowing liquid trail during movement
 *    - Coalesces smoothly into a cohesive glowing pool when resting
 * 2. 120 FPS Native Performance:
 *    - Directly modifies DOM styles via Ref (zero React re-render overhead)
 * 3. Grill / Grid Pattern Preservation ("grill hage erli"):
 *    - Layered dual-grid ensures razor-sharp grid lines both in dark background and over bright fluid light
 * 4. Card Color Integrity:
 *    - Cards remain completely untouched in their original sleek dark styling
 * 5. Mobile Touch Support:
 *    - Passive touch tracking with natural lingering fade-out
 */
export default function BackgroundSpotlight() {
  const spotlightRef = useRef(null);

  // 6 chained fluid nodes
  const nodes = useRef([
    { x: -1000, y: -1000 }, // 0: Head
    { x: -1000, y: -1000 }, // 1: Neck
    { x: -1000, y: -1000 }, // 2: Chest
    { x: -1000, y: -1000 }, // 3: Core
    { x: -1000, y: -1000 }, // 4: Tail
    { x: -1000, y: -1000 }, // 5: Drop
  ]);

  const target = useRef({ x: -1000, y: -1000 });
  const isInitialized = useRef(false);
  const rafId = useRef(null);
  const fadeTimeout = useRef(null);

  useEffect(() => {
    // Initial center position
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    target.current = { x: initX, y: initY };
    nodes.current.forEach((node) => {
      node.x = initX;
      node.y = initY;
    });

    const spotlightEl = spotlightRef.current;

    // Fluid spring constants for each node (from head to drop)
    const springEasing = [0.28, 0.20, 0.15, 0.11, 0.08, 0.05];

    // High-performance direct RAF animation loop (60-120 FPS, zero React reconciliation)
    const renderFluid = () => {
      const pts = nodes.current;

      // 0. Head chases target position
      pts[0].x += (target.current.x - pts[0].x) * springEasing[0];
      pts[0].y += (target.current.y - pts[0].y) * springEasing[0];

      // 1-5. Subsequent nodes chase the preceding node with fluid viscosity
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * springEasing[i];
        pts[i].y += (pts[i - 1].y - pts[i].y) * springEasing[i];
      }

      // Update multi-point radial gradient directly on the DOM element (perfect middle size)
      if (spotlightEl) {
        spotlightEl.style.background = `
          radial-gradient(140px circle at ${Math.round(pts[0].x)}px ${Math.round(pts[0].y)}px, rgba(255, 255, 255, 0.46) 0%, rgba(255, 255, 255, 0.18) 40%, transparent 75%),
          radial-gradient(165px circle at ${Math.round(pts[1].x)}px ${Math.round(pts[1].y)}px, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.14) 45%, transparent 80%),
          radial-gradient(185px circle at ${Math.round(pts[2].x)}px ${Math.round(pts[2].y)}px, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.10) 50%, transparent 85%),
          radial-gradient(155px circle at ${Math.round(pts[3].x)}px ${Math.round(pts[3].y)}px, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.07) 45%, transparent 80%),
          radial-gradient(125px circle at ${Math.round(pts[4].x)}px ${Math.round(pts[4].y)}px, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 75%),
          radial-gradient(95px circle at ${Math.round(pts[5].x)}px ${Math.round(pts[5].y)}px, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 35%, transparent 70%)
        `;
      }

      rafId.current = requestAnimationFrame(renderFluid);
    };

    const showSpotlight = () => {
      if (fadeTimeout.current) {
        clearTimeout(fadeTimeout.current);
        fadeTimeout.current = null;
      }
      if (spotlightEl) {
        spotlightEl.style.opacity = '1';
      }
    };

    const hideSpotlight = (delayMs = 0) => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
      if (delayMs > 0) {
        fadeTimeout.current = setTimeout(() => {
          if (spotlightEl) spotlightEl.style.opacity = '0';
        }, delayMs);
      } else {
        if (spotlightEl) spotlightEl.style.opacity = '0';
      }
    };

    // Desktop Pointer Events
    const handlePointerMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!isInitialized.current) {
        nodes.current.forEach((n) => {
          n.x = e.clientX;
          n.y = e.clientY;
        });
        isInitialized.current = true;
      }
      showSpotlight();
    };

    const handlePointerLeave = () => {
      hideSpotlight(300);
    };

    // Mobile Touch Events
    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        target.current = { x: touch.clientX, y: touch.clientY };
        if (!isInitialized.current) {
          nodes.current.forEach((n) => {
            n.x = touch.clientX;
            n.y = touch.clientY;
          });
          isInitialized.current = true;
        }
        showSpotlight();
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        target.current = { x: touch.clientX, y: touch.clientY };
        showSpotlight();
      }
    };

    const handleTouchEnd = () => {
      // Allow fluid nodes to coalesce gracefully before fading out on mobile
      hideSpotlight(1200);
    };

    // Register listeners with passive: true for butter-smooth scrolling
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    rafId.current = requestAnimationFrame(renderFluid);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 
        Fluid Liquid Light Layer:
        6 multi-point trailing nodes that dynamically stretch into a flowing stream when moving,
        and coalesce into a warm, bright pool when stationary.
      */}
      <div 
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{ opacity: 0 }}
      />

      {/* 
        Grill Pattern 1 (Dark Lines): 
        Cuts through the white fluid light with sharp 40px lines so the grill never washes out.
      */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-60" 
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.55) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 1px, transparent 1px)
          `,
        }}
      />

      {/* 
        Grill Pattern 2 (Faint White Lines): 
        Preserves the visible architectural grill across the rest of the dark background.
      */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80 pointer-events-none" />
    </div>
  );
}
