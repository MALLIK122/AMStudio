import React, { useEffect } from 'react';
import { X, ExternalLink, Sparkles, Layers, Clock } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export default function ProjectModal() {
  const { selectedProject, setSelectedProject } = useStudio();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedProject]);

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Click outside to close */}
      <div 
        className="fixed inset-0" 
        onClick={() => setSelectedProject(null)} 
      />

      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 my-auto">
        {/* Header Close button */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 z-20 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-white text-zinc-300 hover:text-black transition-all border border-white/20"
          aria-label="Close Project Details"
        >
          <X className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        {/* Hero Media */}
        <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
          <img
            src={selectedProject.imageUrl}
            alt={selectedProject.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
                  {selectedProject.category}
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
                  {selectedProject.year}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight break-words">
                {selectedProject.title}
              </h2>
            </div>

            {/* Quick Live Link */}
            {selectedProject.liveUrl && (
              <a
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xl"
              >
                <ExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                <span>Live to see the project</span>
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold tracking-wide transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Site</span>
                </a>
              )}
            </div>
          </div>

          {/* Description Breakdown */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Project Overview</h4>
            <p className="text-base text-zinc-200 leading-relaxed font-normal">
              {selectedProject.longDescription || selectedProject.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
