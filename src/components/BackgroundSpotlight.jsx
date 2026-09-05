import React, { useEffect, useState, useRef } from 'react';

/**
 * BackgroundSpotlight Component
 * Illuminates ONLY the background in white wherever the user moves their cursor (desktop)
 * or touches the screen with a finger (mobile).
 *
 * Keeps the grill / grid pattern crisp and visible.
 * Does not alter card colors or foreground content.
 */
export default function BackgroundSpotlight() {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [active, setActive] = useState(false);
  
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const rafId = useRef(null);

  useEffect(() => {
    let isTracking = false;

    const updatePosition = () => {
      // Smooth lerp interpolation for 60/120fps fluid motion
      const ease = 0.22;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      setPos({
        x: Math.round(currentPos.current.x),
        y: Math.round(currentPos.current.y),
      });

      rafId.current = requestAnimationFrame(updatePosition);
    };

    const handlePointerMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isTracking) {
        currentPos.current = { x: e.clientX, y: e.clientY };
        isTracking = true;
      }
      setActive(true);
    };

    const handlePointerLeave = () => {
      setActive(false);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        targetPos.current = { x: touch.clientX, y: touch.clientY };
        currentPos.current = { x: touch.clientX, y: touch.clientY };
        isTracking = true;
        setActive(true);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        targetPos.current = { x: touch.clientX, y: touch.clientY };
        setActive(true);
      }
    };

    const handleTouchEnd = () => {
      setActive(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    rafId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Dynamic White Spotlight illuminating only the background under cursor/touch */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(380px circle at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.18) 28%, rgba(255, 255, 255, 0.03) 60%, transparent 80%)`,
        }}
      />

      {/* 2. Grill / Grid Pattern overlay so the grill lines remain crisp and illuminated */}
      <div className="absolute inset-0 bg-grid-pattern opacity-80 pointer-events-none" />
    </div>
  );
}
