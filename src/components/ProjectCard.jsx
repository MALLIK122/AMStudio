import React, { useRef, useState } from 'react';
import { ExternalLink, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { WhatsApp } from './Icons';

export default function ProjectCard({ project }) {
  const { setSelectedProject, t, language } = useStudio();
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
      {(() => {
        const isPoster = Boolean(
          project.isPoster ||
          (project.category && (
            project.category.toLowerCase().includes('poster') ||
            project.category.toLowerCase().includes('card') ||
            project.category.toLowerCase().includes('flyer') ||
            project.category.toLowerCase().includes('baby shower')
          ))
        );

        const whatsappText = isPoster
          ? `Hi AM Studio! I would like to order/customize the "${project.title}" poster design (${project.category}). Can you share price and turnaround time?`
          : `Hi AM Studio! I loved the "${project.title}" wedding invitation design. Can you share pricing and options for our celebration?`;

        return (
          <>
            <div 
              className="relative aspect-[16/10] overflow-hidden bg-zinc-950 cursor-pointer" 
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover object-center filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                onError={(e) => {
                  const src = e.target.src || '';
                  if (src.includes('project-3') && !src.includes('githubusercontent')) {
                    e.target.src = "https://raw.githubusercontent.com/MALLIK122/AMStudio/main/public/images/project-3.jpg";
                  } else {
                    e.target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
                  }
                }}
              />

              {/* Floating Category & Year Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider bg-black/85 backdrop-blur-md text-white border border-white/20 rounded-lg font-medium">
                  {project.category || "Showcase"}
                </span>
                {project.featured && (
                  <span className="px-2.5 py-1 text-xs font-mono tracking-wider bg-white text-black font-semibold rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t('projects', 'featured') || 'Featured'}
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 text-xs font-mono text-zinc-200 font-semibold bg-black/85 backdrop-blur-md border border-white/20 rounded-lg">
                  {project.year || "2026"}
                </span>
              </div>

              {/* Subtle bottom gradient to text */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
            </div>

            {/* 2. Direct Action Links Under Image */}
            <div className="px-5 py-3.5 bg-zinc-900/90 border-y border-white/10 flex items-center justify-between gap-2.5">
              {project.liveUrl && !isPoster ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide transition-all shadow-sm group/btn"
                >
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  <span>{t('projects', 'viewLive') || 'Live to see the project'}</span>
                </a>
              ) : (
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold tracking-wide transition-all shadow-sm group/btn cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  <span>{t('projects', 'viewLive') || 'Live to see the project'}</span>
                </button>
              )}

              {/* WhatsApp Direct Inquiry Button */}
              <a
                href={`https://wa.me/919731696952?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={isPoster ? "Order this poster on WhatsApp" : "Inquire about this design on WhatsApp"}
                className="p-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 transition-all flex items-center justify-center"
              >
                <WhatsApp className="w-4 h-4 fill-current" />
              </a>

              {/* Case Study Details Trigger */}
              <button
                onClick={() => setSelectedProject(project)}
                title="View Full Details"
                className="p-2 rounded-lg border border-white/15 bg-black/60 hover:bg-white/10 text-zinc-200 hover:text-white transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </>
        );
      })()}

      {/* 3. Description & Metadata Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => setSelectedProject(project)}
            className="font-display text-xl font-bold text-white tracking-tight cursor-pointer hover:underline decoration-white/30 transition-all flex items-center justify-between gap-2"
          >
            <span>{project.title}</span>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </h3>

          {project.subtitle && (
            <p className="text-xs font-mono text-zinc-300 mt-1 tracking-normal font-medium">
              {project.subtitle}
            </p>
          )}

          <p className="text-zinc-200 text-sm mt-3.5 line-clamp-3 leading-relaxed font-normal">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
