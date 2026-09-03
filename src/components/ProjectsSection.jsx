import React, { useState, useMemo } from 'react';
import { useStudio } from '../context/StudioContext';
import ProjectCard from './ProjectCard';
import { Search, Sparkles, Filter, Grid } from 'lucide-react';

export default function ProjectsSection() {
  const { projects } = useStudio();
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
    <section id="projects" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-white" />
            Portfolio Showcase
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            SELECTED WORKS
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-xl font-light">
            A curated collection of elegant digital wedding invitations, crafted to celebrate your story in a truly memorable way.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs placeholder:text-zinc-500 font-mono"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-white text-black border-white font-medium shadow-md'
                : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs font-mono text-zinc-500 ml-auto hidden sm:block">
          Showing {filteredProjects.length} of {projects.length} Works
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
          <p className="font-mono text-zinc-400 text-sm">No projects matching your search criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
