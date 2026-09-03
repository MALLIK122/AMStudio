import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Box, Code2, Palette, Terminal, Award, CheckCircle2 } from 'lucide-react';

const serviceIcons = [
  Box,
  Code2,
  Palette,
  Terminal
];

export default function AboutSection() {
  const { profile } = useStudio();

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
      
      {/* Studio Ethos & Manifesto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-white" />
            Studio Manifesto
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            WHERE ARCHITECTURAL DISCIPLINE MEETS REAL-TIME CODE.
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-6 text-zinc-300 font-light leading-relaxed text-base md:text-lg">
          <p>
            {profile.bio}
          </p>
          <p className="text-zinc-400 text-sm md:text-base">
            Every project that leaves AM Studio adheres to three foundational tenets:
            zero performance degradation, immaculate typographic hierarchy, and visual tactility that commands attention.
          </p>

          {/* Stats Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            {profile.stats?.map((stat, i) => (
              <div key={i} className="p-4 rounded-xl glass-panel border border-white/10">
                <div className="font-display text-2xl md:text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services / Capabilities Section */}
      <div id="services" className="pt-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2">
              Our Capabilities
            </div>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">
              SPECIALIZED DISCIPLINES
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.services?.map((srv, idx) => {
            const Icon = serviceIcons[idx % serviceIcons.length] || Box;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-white/10 glass-panel-hover flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-white mb-2">
                    {srv.title}
                  </h4>
                  <p className="text-zinc-400 text-xs md:text-sm font-light leading-relaxed">
                    {srv.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Production Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
