import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Sparkles, UploadCloud } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function ProjectForm({ project, onSave, onCancel }) {
  const { githubToken } = useStudio();
  const [autoDeploy, setAutoDeploy] = useState(Boolean(githubToken));
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Luxury Invitation',
    description: '',
    imageUrl: '',
    liveUrl: '',
    featured: false,
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        subtitle: project.subtitle || '',
        category: project.category || 'Luxury Invitation',
        description: project.description || '',
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        featured: Boolean(project.featured),
        year: project.year || new Date().getFullYear().toString(),
      });
    }
  }, [project]);

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
      alert('Please provide a project title.');
      return;
    }
    if (!formData.liveUrl.trim()) {
      alert('Please provide the live project URL.');
      return;
    }

    const payload = {
      ...formData,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : formData.tags,
      longDescription: formData.description,
    };

    onSave(payload, autoDeploy);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-3xl p-6 md:p-8 my-auto shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              {project ? 'Edit Project' : 'Add New Showcase Project'}
            </h3>
            <p className="text-zinc-400 text-xs font-mono mt-0.5">
              Enter wedding invitation details, live link, and visual cover
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun & Ananya | Luxury Wedding Invitation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Subtitle / Pitch
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Palace Celebration Portal"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Invitation Category / Style
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm font-mono cursor-pointer"
              >
                <option value="Luxury Invitation" className="bg-zinc-900 text-white">Luxury Invitation</option>
                <option value="Royal Celebration" className="bg-zinc-900 text-white">Royal Celebration</option>
                <option value="Modern Minimal" className="bg-zinc-900 text-white">Modern Minimal</option>
                <option value="Traditional" className="bg-zinc-900 text-white">Traditional</option>
                <option value="Floral Design" className="bg-zinc-900 text-white">Floral Design</option>
                <option value="Custom Design" className="bg-zinc-900 text-white">Custom Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
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
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Project Preview Visual
            </label>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-8">
                <input
                  type="text"
                  placeholder="Paste image URL (https://... or /images/...) or upload file"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
              <div className="md:col-span-4">
                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer text-xs font-mono text-zinc-300 hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Local File</span>
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
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Live to see the project URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://wedding-invite-tau-one.vercel.app"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Project Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the wedding invitation theme, couple story, RSVP features, venue, and special highlights..."
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
            <label htmlFor="featured" className="text-xs font-mono uppercase tracking-wider text-zinc-300 cursor-pointer flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Mark as Featured Project</span>
            </label>
          </div>

          {/* Auto-Deploy to GitHub & Vercel toggle */}
          {githubToken ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <input
                type="checkbox"
                id="autoDeploy"
                checked={autoDeploy}
                onChange={(e) => setAutoDeploy(e.target.checked)}
                className="w-4 h-4 rounded border-emerald-500/40 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
              />
              <label htmlFor="autoDeploy" className="text-xs font-mono uppercase tracking-wider text-emerald-300 cursor-pointer flex items-center gap-2">
                <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Deploy to GitHub &amp; Vercel (Live on all devices)</span>
              </label>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-950/10 text-[11px] font-mono text-amber-300/90 flex items-center justify-between">
              <span>💡 Connect GitHub token in "GitHub &amp; Vercel Live" tab to auto-deploy projects across all devices.</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-white/15 text-zinc-300 hover:text-white text-xs font-mono uppercase transition-colors"
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
