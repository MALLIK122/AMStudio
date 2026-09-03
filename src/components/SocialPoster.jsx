import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { 
  Download, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Smartphone, 
  Heart,
  Send,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { WhatsApp } from './Icons';
import AMLogo from './AMLogo';

export default function SocialPoster() {
  const { setCurrentView, profile } = useStudio();
  const [copied, setCopied] = useState(false);

  const getPosterUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/#poster`;
    }
    return 'https://amstudio.vercel.app/#poster';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getPosterUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/am-studio-poster.jpg';
    link.download = 'AM-Studio-Wedding-Invitations-Poster.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = () => {
    const text = `💍 *AM STUDIO — Digital Wedding Invitations That Tell Your Story*\n\nReplace paper with timeless, interactive wedding invitation websites.\n\n✨ *Key Highlights:*\n• 📱 100% Mobile Friendly on All Devices\n• 📍 One-Tap Google Maps Navigation\n• 📅 Events & Complete Schedule Timeline\n• 🎁 Interactive RSVP & Wishes\n• 🎵 Background Music & Love Story Gallery\n\n👉 *View our Official Poster & Showcase:* ${getPosterUrl()}\n\n📞 *Contact / WhatsApp:* +91 97316 96952\n✉️ *Email:* amstudio.support.in@gmail.com\n📍 *Davanagere, Karnataka*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleBackToHome = () => {
    setCurrentView('public');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    setCurrentView('public');
    if (typeof window !== 'undefined') {
      window.location.hash = 'contact';
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black py-8 sm:py-12 px-4 sm:px-6 md:px-12 relative overflow-x-hidden">
      
      {/* Top Floating Control Bar */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10 sticky top-4 z-40 backdrop-blur-xl">
        {/* Left: Back Button */}
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono uppercase text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Studio</span>
        </button>

        {/* Center: Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Official Social Media Poster</span>
        </div>

        {/* Right Actions: Download & Share */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Copy Shareable Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono uppercase border border-white/20 hover:border-white/40 text-zinc-200 hover:text-white transition-all bg-zinc-900/60"
            title="Copy poster web link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Share to WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono uppercase bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium transition-all shadow-lg shadow-emerald-950/40"
          >
            <WhatsApp className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Direct Download Image */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono uppercase bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-lg"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Poster</span>
          </button>
        </div>
      </div>

      {/* Main Poster Stage */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: High Resolution Poster Artwork View */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[620px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative group bg-zinc-950">
            {/* Ambient gold-tinted glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-amber-400/10 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-700 pointer-events-none" />
            
            <img 
              src="/am-studio-poster.jpg" 
              alt="AM Studio - Digital Wedding Invitations That Tell Your Story"
              className="w-full h-auto object-cover relative z-10 block"
            />
          </div>

          <p className="text-zinc-500 text-xs font-mono mt-4 text-center">
            Click "Download Poster" above to save the full high-resolution version for Instagram, WhatsApp &amp; Facebook.
          </p>
        </div>

        {/* Right Column: Quick Interactive Actions & Live Demos */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Book CTA Box */}
          <div className="p-6 rounded-2xl glass-panel border border-white/15 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <h3 className="font-display text-lg font-bold text-white tracking-tight">
                BOOK YOUR INVITATION
              </h3>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-light">
              Ready to create an invitation as unique as your love story? Start your wedding journey with AM Studio today.
            </p>
            <button
              onClick={handleBookNow}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all shadow-md"
            >
              <span>Send Request on Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/919731696952?text=${encodeURIComponent("Hello AM Studio! I saw your Digital Wedding Invitations poster and would like to book an invitation for our wedding.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/20 hover:border-white/40 text-white text-xs uppercase tracking-wider font-semibold transition-all hover:bg-white/5"
            >
              <WhatsApp className="w-3.5 h-3.5" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

          {/* Live Templates Listed in Poster */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Featured In Poster:
            </h4>
            <div className="space-y-3">
              <a
                href="https://wedding-invite-tau-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-white">Royal Elegance (Arjun &amp; Ananya)</p>
                  <p className="text-[11px] text-zinc-400 font-light">Palace architecture &amp; luxury gold</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>

              <a
                href="https://m-invitation-demo2-2l1o.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-white">Modern Love (Arjun &amp; Meera)</p>
                  <p className="text-[11px] text-zinc-400 font-light">Minimalist string-lights night style</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>

              <a
                href="https://m-invitation-demo1.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
              >
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-white">Traditional &amp; Floral Charm</p>
                  <p className="text-[11px] text-zinc-400 font-light">Interactive celebration portal &amp; RSVP</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Official Studio Contact Coordinates */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3 text-xs text-zinc-400">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Studio Coordinates:
            </h4>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-zinc-200">amstudio.support.in@gmail.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-zinc-200">+91 97316 96952</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-zinc-200">Davanagere, Karnataka</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
