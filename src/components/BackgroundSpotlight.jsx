import React, { useEffect, useRef } from 'react';

/**
 * BackgroundSpotlight - Fluid Liquid Light Simulator
 *
 * Simulates high-viscosity liquid light that organically flows and streams
 * behind the mouse cursor on desktop and finger touches on mobile.
 *
 * Keeps the grill/grid pattern crisp, does not affect cards or foreground UI.
 */
export default function BackgroundSpotlight() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Fluid Chain Points (Liquid trail with trailing momentum)
    const TRAIL_LENGTH = 14;
    const trail = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 0,
      alpha: 0,
    }));

    // Interactive State
    let targetX = width / 2;
    let targetY = height / 2;
    let isActive = false;
    let globalAlpha = 0; // Smooth fade in/out
    let prevX = targetX;
    let prevY = targetY;
    let speed = 0;

    // Small fluid droplets spawned during motion
    const droplets = [];

    // Pointer & Touch Listeners
    const handlePointerMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isActive = true;
    };

    const handlePointerLeave = () => {
      isActive = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
        // Snap head to touch start for instant response
        trail[0].x = targetX;
        trail[0].y = targetY;
        isActive = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
        isActive = true;
      }
    };

    const handleTouchEnd = () => {
      isActive = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Animation Loop
    let animationFrameId;
    let time = 0;

    const render = () => {
      time += 1;

      // Smooth global opacity transition
      const targetAlpha = isActive ? 1 : 0;
      globalAlpha += (targetAlpha - globalAlpha) * (isActive ? 0.12 : 0.04);

      // Measure cursor speed
      const dx = targetX - prevX;
      const dy = targetY - prevY;
      speed = Math.hypot(dx, dy);
      prevX = targetX;
      prevY = targetY;

      // Update Head Point with elastic fluid spring
      const headEase = 0.24;
      trail[0].x += (targetX - trail[0].x) * headEase;
      trail[0].y += (targetY - trail[0].y) * headEase;

      // Update Trailing Fluid Chain with viscous wave propagation
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        const leader = trail[i - 1];
        const follower = trail[i];

        // Damping ease progressively softens towards the tail
        const ease = Math.max(0.12, 0.38 - i * 0.022);

        // Organic fluid wave wobble based on motion
        const wobbleX = Math.sin(time * 0.06 + i * 0.8) * Math.min(speed * 0.05, 6);
        const wobbleY = Math.cos(time * 0.06 + i * 0.8) * Math.min(speed * 0.05, 6);

        follower.x += (leader.x + wobbleX - follower.x) * ease;
        follower.y += (leader.y + wobbleY - follower.y) * ease;
      }

      // Spawn fluid droplets when moving fast enough
      if (isActive && speed > 5 && droplets.length < 25) {
        droplets.push({
          x: trail[0].x + (Math.random() - 0.5) * 20,
          y: trail[0].y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2 - dx * 0.05,
          vy: (Math.random() - 0.5) * 2 - dy * 0.05,
          radius: 20 + Math.random() * 30,
          life: 1,
          decay: 0.03 + Math.random() * 0.02,
        });
      }

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      if (globalAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = globalAlpha;

        // 1. Draw Trailing Fluid Droplets
        for (let i = droplets.length - 1; i >= 0; i--) {
          const d = droplets[i];
          d.x += d.vx;
          d.y += d.vy;
          d.life -= d.decay;

          if (d.life <= 0) {
            droplets.splice(i, 1);
            continue;
          }

          const dropGrad = ctx.createRadialGradient(
            d.x,
            d.y,
            0,
            d.x,
            d.y,
            d.radius * (1 + (1 - d.life) * 0.5)
          );
          const dropAlpha = d.life * 0.22;
          dropGrad.addColorStop(0, `rgba(255, 255, 255, ${dropAlpha})`);
          dropGrad.addColorStop(0.5, `rgba(255, 255, 255, ${dropAlpha * 0.4})`);
          dropGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = dropGrad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius * (1 + (1 - d.life) * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Draw Viscous Fluid Stream (from tail to head for smooth layering)
        for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
          const point = trail[i];
          const progress = 1 - i / TRAIL_LENGTH; // 1 at head, ~0.07 at tail

          // Head is large and bright, tail is narrower and softer
          const baseRadius = 140 + progress * 160; // 150px to 300px
          const dynamicRadius = baseRadius + Math.min(speed * 0.4, 40);

          const coreAlpha = (0.04 + progress * 0.38); // 0.04 to 0.42

          const grad = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            dynamicRadius
          );

          grad.addColorStop(0, `rgba(255, 255, 255, ${coreAlpha})`);
          grad.addColorStop(0.3, `rgba(255, 255, 255, ${coreAlpha * 0.5})`);
          grad.addColorStop(0.65, `rgba(255, 255, 255, ${coreAlpha * 0.12})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(point.x, point.y, dynamicRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Fluid Liquid Light Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block pointer-events-none" 
      />

      {/* 2. Grill / Grid Pattern overlay: fluid light streams organically under the grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-85 pointer-events-none" />
    </div>
  );
}
