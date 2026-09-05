import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Sparkles, UploadCloud } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function ProjectForm({ project, initialType = 'website', onSave, onCancel }) {
  const { githubToken } = useStudio();
  const [workType, setWorkType] = useState(() => {
    if (project?.isPoster) return 'poster';
    if (project?.category && (
      project.category.toLowerCase().includes('poster') ||
      project.category.toLowerCase().includes('card') ||
      project.category.toLowerCase().includes('baby shower')
    )) return 'poster';
    if (initialType === 'poster') return 'poster';
    return 'website';
  });

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: workType === 'poster' ? 'Wedding Cards & Posters' : 'Wedding Websites',
    description: '',
    imageUrl: '',
    liveUrl: '',
    featured: false,
    tags: '',
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (project) {
      const isPost = Boolean(
        project.isPoster ||
        (project.category && (
          project.category.toLowerCase().includes('poster') ||
          project.category.toLowerCase().includes('card') ||
          project.category.toLowerCase().includes('baby shower')
        ))
      );
      setWorkType(isPost ? 'poster' : 'website');
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        category: project.category || (isPost ? 'Wedding Cards & Posters' : 'Wedding Websites'),
        description: project.description || '',
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        featured: Boolean(project.featured),
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
        year: project.year || new Date().getFullYear().toString(),
      });
    } else if (initialType === 'poster') {
      setWorkType('poster');
      setFormData(prev => ({ ...prev, category: 'Wedding Cards & Posters' }));
    }
  }, [project, initialType]);

  // Handle local image file upload (auto-compresses with canvas to keep size light & fast)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size exceeds 15MB. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1280;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setFormData(prev => ({ ...prev, imageUrl: optimizedDataUrl }));
      };
      img.src = uploadEvent.target?.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please provide a title.');
      return;
    }
    if (workType === 'website' && !formData.liveUrl.trim()) {
      alert('Please provide the live website URL.');
      return;
    }

    const payload = {
      ...formData,
      isPoster: workType === 'poster',
      liveUrl: (formData.liveUrl && formData.liveUrl.trim()) || formData.imageUrl || '#',
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags,
      longDescription: formData.description,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-3xl p-6 md:p-8 my-auto shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              {project ? (workType === 'poster' ? 'Edit Poster / Card' : 'Edit Website Project') : (workType === 'poster' ? 'Add New Poster / Card' : 'Add New Wedding Website')}
            </h3>
            <p className="text-zinc-300 text-xs font-mono mt-0.5 font-medium">
              {workType === 'poster' ? 'Publish a new poster, wedding card, baby shower or event flyer template' : 'Enter wedding invitation details, live link, and visual cover'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work Type Switcher: Website vs Poster/Card */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <button
            type="button"
            onClick={() => {
              setWorkType('website');
              if (formData.category.includes('Poster') || formData.category.includes('Card')) {
                setFormData(prev => ({ ...prev, category: 'Wedding Websites' }));
              }
            }}
            className={`py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              workType === 'website'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Wedding Website</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setWorkType('poster');
              if (!formData.category.includes('Poster') && !formData.category.includes('Card')) {
                setFormData(prev => ({ ...prev, category: 'Wedding Cards & Posters' }));
              }
            }}
            className={`py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              workType === 'poster'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Poster / Card Design</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                {workType === 'poster' ? 'Poster / Card Title *' : 'Project Title *'}
              </label>
              <input
                type="text"
                required
                placeholder={workType === 'poster' ? 'e.g. Save The Date | Jonathan & Juliana' : 'e.g. Arjun & Ananya | Luxury Wedding Invitation'}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                {workType === 'poster' ? 'Theme / Subtitle' : 'Subtitle / Pitch'}
              </label>
              <input
                type="text"
                placeholder={workType === 'poster' ? 'e.g. Luxury Gold Floral Invitation Card' : 'e.g. Royal Palace Celebration Portal'}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                {workType === 'poster' ? 'Poster Category' : 'Invitation Category / Style'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono cursor-pointer"
              >
                {workType === 'poster' ? (
                  <>
                    <option value="Wedding Cards & Posters" className="bg-zinc-900 text-white">Wedding Cards & Posters</option>
                    <option value="Baby Shower & Family" className="bg-zinc-900 text-white">Baby Shower & Family</option>
                    <option value="Event & Party Posters" className="bg-zinc-900 text-white">Event & Party Posters</option>
                    <option value="Business & Promotion" className="bg-zinc-900 text-white">Business & Promotion</option>
                    <option value="Custom Poster" className="bg-zinc-900 text-white">Custom Poster / Other</option>
                  </>
                ) : (
                  <>
                    <option value="Wedding Websites" className="bg-zinc-900 text-white">Wedding Websites</option>
                    <option value="Luxury Invitation" className="bg-zinc-900 text-white">Luxury Invitation</option>
                    <option value="Royal Celebration" className="bg-zinc-900 text-white">Royal Celebration</option>
                    <option value="Modern Minimal" className="bg-zinc-900 text-white">Modern Minimal</option>
                    <option value="Traditional" className="bg-zinc-900 text-white">Traditional</option>
                    <option value="Floral Design" className="bg-zinc-900 text-white">Floral Design</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Year
              </label>
              <input
                type="text"
                placeholder="2026"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Image URL & File Upload */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
              {workType === 'poster' ? 'Poster Design Image *' : 'Project Preview Visual *'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  type="text"
                  required={!formData.imageUrl}
                  placeholder={workType === 'poster' ? 'Upload poster below or paste URL (/images/posters/...)' : 'Paste image URL (https://... or /images/...) or upload file'}
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              <div className="md:col-span-4">
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-mono text-zinc-200 hover:text-white font-medium transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Poster File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {formData.imageUrl && (
              <div className={`relative w-full ${workType === 'poster' ? 'h-52' : 'h-36'} rounded-xl overflow-hidden border border-white/10 bg-zinc-950 mt-2 flex items-center justify-center`}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Live URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold">
                {workType === 'poster' ? 'Live Link / External URL (Optional)' : 'Live to see the project URL *'}
              </label>
              {workType === 'poster' && (
                <span className="text-[11px] font-mono text-zinc-400">Optional for posters</span>
              )}
            </div>
            <input
              type={workType === 'poster' ? 'text' : 'url'}
              required={workType === 'website'}
              placeholder={workType === 'poster' ? 'Defaults to high-res poster view or WhatsApp order link' : 'https://wedding-invite-tau-one.vercel.app'}
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
              {workType === 'poster' ? 'Poster Description & Occasion *' : 'Project Description *'}
            </label>
            <textarea
              rows={3}
              required
              placeholder={workType === 'poster' ? 'Describe the poster theme, color palette, print resolution, and occasion highlights...' : 'Describe the wedding invitation theme, couple story, RSVP features, venue, and special highlights...'}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm resize-none"
            />
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-white focus:ring-0 cursor-pointer accent-white"
            />
            <label htmlFor="featured" className="text-xs font-mono uppercase tracking-wider text-zinc-200 cursor-pointer font-medium flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Mark as Featured Project</span>
            </label>
          </div>

          {/* Auto-Deploy to GitHub & Vercel live indicator */}
          {githubToken ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automatic Live Sync Active: Changes will be pushed to GitHub &amp; deployed live across all devices.</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs font-mono text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span>Connect your GitHub token in the "GitHub &amp; Vercel Live" tab to automatically push changes to all other devices.</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-zinc-200 hover:text-white text-xs font-mono uppercase font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>{project ? 'Update Project' : 'Publish Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
