import React, { useEffect } from 'react';
import { X, ExternalLink, Sparkles, Layers, Clock } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { WhatsApp } from './Icons';

export default function ProjectModal() {
  const { selectedProject, setSelectedProject, t } = useStudio();

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

        {/* Media & Content */}
        {(() => {
          const isPoster = Boolean(
            selectedProject.isPoster ||
            (selectedProject.category && (
              selectedProject.category.toLowerCase().includes('poster') ||
              selectedProject.category.toLowerCase().includes('card') ||
              selectedProject.category.toLowerCase().includes('flyer') ||
              selectedProject.category.toLowerCase().includes('baby shower')
            ))
          );

          const whatsappMessage = isPoster
            ? `Hi AM Studio! I want to order/customize the "${selectedProject.title}" design (${selectedProject.category}). Please share details and pricing!`
            : `Hi AM Studio! I would like to order a wedding invitation website styled like "${selectedProject.title}". Please share details and pricing!`;

          if (isPoster) {
            return (
              <div className="flex flex-col lg:flex-row items-stretch max-h-[85vh] overflow-y-auto">
                {/* Left: Full Poster High-Res View */}
                <div className="lg:w-1/2 bg-black/90 p-4 sm:p-6 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                  <div className="relative max-h-[65vh] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="max-h-[65vh] w-auto object-contain mx-auto"
                    />
                  </div>
                </div>

                {/* Right: Details & Direct WhatsApp Actions */}
                <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded text-xs font-mono uppercase tracking-wider bg-white/15 text-white border border-white/20 font-semibold">
                        {selectedProject.category}
                      </span>
                      <span className="text-xs font-mono text-zinc-300 font-medium">
                        {selectedProject.year || '2026'}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {selectedProject.title}
                    </h2>

                    {selectedProject.subtitle && (
                      <p className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
                        {selectedProject.subtitle}
                      </p>
                    )}

                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-semibold">
                        {t('projectModal', 'overview') || 'Design Overview'}
                      </h4>
                      <p className="text-sm text-zinc-100 leading-relaxed font-normal">
                        {selectedProject.longDescription || selectedProject.description}
                      </p>
                    </div>

                    {selectedProject.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {(Array.isArray(selectedProject.tags) ? selectedProject.tags : []).map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-200">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={`https://wa.me/919731696952?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
                    >
                      <WhatsApp className="w-4 h-4 fill-current" />
                      <span>Order This Poster on WhatsApp</span>
                    </a>

                    <a
                      href={selectedProject.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-mono font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full Size</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          }

          // Default Layout for Digital Invitation Websites
          return (
            <>
              {/* Hero Media */}
              <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const src = e.target.src || '';
                    if (src.includes('project-3') && !src.includes('githubusercontent')) {
                      e.target.src = "https://raw.githubusercontent.com/MALLIK122/AMStudio/main/public/images/project-3.jpg";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-wrap items-end justify-between gap-3 sm:gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/20">
                        {selectedProject.category}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono text-zinc-200 font-medium">
                        {selectedProject.year}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight break-words">
                      {selectedProject.title}
                    </h2>
                  </div>

                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xl"
                    >
                      <ExternalLink className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      <span>{t('projectModal', 'visitLive') || 'Live to see the project'}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                {/* Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold tracking-wide transition-all shadow"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t('projectModal', 'visitLive') || 'Launch Live Site'}</span>
                      </a>
                    )}

                    <a
                      href={`https://wa.me/919731696952?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 text-xs font-bold tracking-wide transition-all"
                    >
                      <WhatsApp className="w-4 h-4 fill-current" />
                      <span>{t('contact', 'directWhatsApp') || 'Inquire on WhatsApp'}</span>
                    </a>
                  </div>
                </div>

                {/* Description Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-medium">
                    {t('projectModal', 'overview') || 'Project Overview'}
                  </h4>
                  <p className="text-base text-zinc-100 leading-relaxed font-normal">
                    {selectedProject.longDescription || selectedProject.description}
                  </p>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
