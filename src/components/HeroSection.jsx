import React from 'react';
import { useStudio } from '../context/StudioContext';
import Hero3D from './Hero3D';
import { ArrowDown, ArrowUpRight, Sparkles, Layers, Terminal } from 'lucide-react';

export default function HeroSection() {
  const { profile } = useStudio();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      
      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-6 sm:py-12">
        {/* Left: Hero Typography & Pitch */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 z-10 text-center lg:text-left">

          {/* Social Proof Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[11px] sm:text-xs font-mono tracking-wider text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>5-Star Rated by Couples • 24-48h Delivery • Kannada & English</span>
          </div>

          <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.08] sm:leading-[1.04] break-words">
            {profile.heroHeading || "BEAUTIFULLY CRAFTED WEDDING INVITATION WEBSITES MADE JUST FOR YOU."}
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Crafting breathtaking, interactive digital wedding invitation websites with animated timelines, romantic audio, Google Maps navigation, and RSVP tracking for your unforgettable celebration.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Invitations</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => scrollToSection('pricing')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/25 hover:border-white text-white font-semibold text-xs font-mono tracking-wider uppercase bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <span>View Packages</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 hover:border-white/40 text-zinc-300 hover:text-white font-semibold text-xs font-mono tracking-wider uppercase bg-black/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <span>Contact Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: 3D Interactive WebGL Element */}
        <div className="lg:col-span-6 flex items-center justify-center relative w-full overflow-hidden">
          <div className="w-full max-w-[320px] sm:max-w-md lg:max-w-lg aspect-square relative flex items-center justify-center">
            {/* Ambient subtle backdrop radial glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
            
            {/* The 3D Canvas */}
            <Hero3D />
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt Bar */}
      <div className="flex items-center justify-start pt-6 border-t border-white/10 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Scroll to Inspect Works</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
