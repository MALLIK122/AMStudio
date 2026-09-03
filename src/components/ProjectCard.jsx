import React, { useRef, useState } from 'react';
import { ExternalLink, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export default function ProjectCard({ project }) {
  const { setSelectedProject } = useStudio();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D Perspective Card Tilt Calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max ±8 degrees
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -6 : 0}px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-white/30 flex flex-col justify-between transition-colors duration-300"
    >
      {/* Top subtle highlight glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* 1. Image Preview Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";
          }}
        />

        {/* Floating Category & Year Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider bg-black/80 backdrop-blur-md text-white border border-white/15 rounded-md">
            {project.category || "Showcase"}
          </span>
          {project.featured && (
            <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider bg-white text-black font-semibold rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 text-[11px] font-mono text-zinc-400 bg-black/80 backdrop-blur-md border border-white/10 rounded-md">
            {project.year || "2026"}
          </span>
        </div>

        {/* Subtle bottom gradient to text */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
      </div>

      {/* 2. Direct Action Links Under Image */}
      <div className="px-6 py-3.5 bg-zinc-900/90 border-y border-white/10 flex items-center justify-between gap-3">
        {/* Live To See The Project Button */}
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide transition-all shadow-sm group/btn"
          >
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            <span>Live to see the project</span>
          </a>
        ) : (
          <span className="text-xs text-zinc-500 font-mono italic">Demo in private preview</span>
        )}


        {/* Case Study Details Trigger */}
        <button
          onClick={() => setSelectedProject(project)}
          title="Project Case Study & Breakdown"
          className="p-2 rounded-lg border border-white/15 bg-black/60 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Description & Metadata Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => setSelectedProject(project)}
            className="font-display text-xl font-bold text-white tracking-tight cursor-pointer hover:underline decoration-white/30 transition-all flex items-center justify-between gap-2"
          >
            <span>{project.title}</span>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </h3>

          {project.subtitle && (
            <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              {project.subtitle}
            </p>
          )}

          <p className="text-zinc-300 text-sm mt-3.5 line-clamp-3 leading-relaxed font-light">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
