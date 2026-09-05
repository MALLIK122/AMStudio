import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import ProjectCard from './ProjectCard';
import { Search, Sparkles, Filter, Grid } from 'lucide-react';

export default function ProjectsSection() {
  const { projects, t, language } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        project.title.toLowerCase().includes(q) ||
        (project.subtitle && project.subtitle.toLowerCase().includes(q)) ||
        (project.description && project.description.toLowerCase().includes(q)) ||
        (project.tags && project.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative overflow-hidden">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6 border-b border-white/10 pb-6 sm:pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-300 font-semibold uppercase mb-2 sm:mb-3">
            <span className="w-2 h-2 rounded-full bg-white" />
            {t('projects', 'tag')}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white break-words">
            {t('projects', 'title')}
          </h2>
          <p className="text-zinc-200 text-xs sm:text-sm md:text-base mt-2 max-w-xl font-normal leading-relaxed">
            {t('projects', 'subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === 'kn' ? 'ಆಮಂತ್ರಣಗಳನ್ನು ಹುಡುಕಿ...' : language === 'te' ? 'ఆహ్వానాలను వెతకండి...' : 'Search invitations...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs placeholder:text-zinc-400 text-zinc-100 font-mono"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-white text-black border-white font-semibold shadow-md'
                : 'bg-zinc-900/60 border-white/15 text-zinc-200 hover:text-white hover:border-white/40 font-medium'
            }`}
          >
            {cat === 'All' ? (t('projects', 'all') || 'All') : cat}
          </button>
        ))}
        <span className="text-xs font-mono text-zinc-300 font-medium ml-auto hidden sm:block">
          {language === 'kn'
            ? `${projects.length} ರಲ್ಲಿ ${filteredProjects.length} ಆಮಂತ್ರಣಗಳು`
            : language === 'te'
            ? `${projects.length} లో ${filteredProjects.length} ఆహ్వానాలు`
            : `Showing ${filteredProjects.length} of ${projects.length} Works`}
        </span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-panel rounded-2xl border border-white/10 p-12">
          <p className="font-mono text-zinc-200 text-sm font-medium">
            {language === 'kn' ? 'ಯಾವುದೇ ಆಮಂತ್ರಣಗಳು ದೊರೆತಿಲ್ಲ.' : language === 'te' ? 'ఫలితాలు ఏవీ కనుగొనబడలేదు.' : 'No projects matching your search criteria.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold"
          >
            {language === 'kn' ? 'ಫಿಲ್ಟರ್ ರಿಸೆಟ್ ಮಾಡಿ' : language === 'te' ? 'ఫిల్టర్‌లను రీసెట్ చేయండి' : 'Reset Filters'}
          </button>
        </div>
      )}
    </section>
  );
}
