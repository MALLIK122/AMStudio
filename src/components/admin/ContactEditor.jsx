import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Save, CheckCircle2, Mail, Phone, MapPin, Globe, Sparkles } from 'lucide-react';

export default function ContactEditor() {
  const { profile, updateProfile } = useStudio();
  const [formData, setFormData] = useState({
    name: profile.name || 'AM Studio',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    availabilityStatus: profile.availabilityStatus || 'Available for Commissions',
    isAvailable: Boolean(profile.isAvailable),
    bio: profile.bio || '',
    heroHeading: profile.heroHeading || '',
    heroSubheading: profile.heroSubheading || '',
    socials: {
      github: profile.socials?.github || '',
      twitter: profile.socials?.twitter || '',
      linkedin: profile.socials?.linkedin || '',
      instagram: profile.socials?.instagram || '',
      dribbble: profile.socials?.dribbble || '',
    }
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-tight">
            Studio Information & Contact Channels
          </h3>
          <p className="text-zinc-200 text-xs font-mono mt-1 font-medium">
            Update studio metadata, contact details, and commission availability
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-mono font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Saved to Live Site!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Brand & Status */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            Studio Identity & Availability
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Studio Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Availability Badge Text
              </label>
              <input
                type="text"
                placeholder="e.g. Available for Q3/Q4 Commissions"
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 text-white focus:ring-0 cursor-pointer accent-white"
            />
            <label htmlFor="isAvailable" className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-medium cursor-pointer">
              Show "Available for Commissions" beacon in header
            </label>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-white" />
            Direct Communication Coordinates
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Studio Official Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Direct Telephone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Studio Bio / Manifesto */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold">
            Studio Manifesto / Bio Text
          </h4>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
            placeholder="Studio background, ethos, and philosophy..."
          />
        </div>

        {/* Social Media Channels */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-200 font-bold flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-white" />
            Social & Distribution Links
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.socials.github}
                onChange={(e) => setFormData({
                  ...formData,
                  socials: { ...formData.socials, github: e.target.value }
                })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={formData.socials.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socials: { ...formData.socials, twitter: e.target.value }
                })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.socials.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socials: { ...formData.socials, linkedin: e.target.value }
                })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socials.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socials: { ...formData.socials, instagram: e.target.value }
                })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                Dribbble URL
              </label>
              <input
                type="url"
                value={formData.socials.dribbble}
                onChange={(e) => setFormData({
                  ...formData,
                  socials: { ...formData.socials, dribbble: e.target.value }
                })}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact & Studio Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
