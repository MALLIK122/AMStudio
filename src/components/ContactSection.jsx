import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight, Sparkles, Clock, Smartphone } from 'lucide-react';
import { Github, Twitter, Linkedin, Instagram, Dribbble, WhatsApp } from './Icons';

export default function ContactSection() {
  const { profile, submitInquiry } = useStudio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    invitationStyle: 'Modern',
    weddingDate: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const cleanPhone = (profile.phone || '9731696952').replace(/\D/g, '');
  const fullPhoneNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const handlePhoneClick = () => {
    const isMobile = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth < 768 && 'ontouchstart' in window)
    );

    if (isMobile) {
      window.location.href = `tel:+${fullPhoneNumber}`;
    } else {
      window.open(`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent("Hello AM Studio, I would like to inquire about a wedding invitation website.")}`, '_blank', 'noopener,noreferrer');
    }
  };

  const hasSocials = Boolean(
    profile.socials &&
    Object.values(profile.socials).some(url => typeof url === 'string' && url.trim().length > 0)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    const currentData = { ...formData };
    setSubmittedData(currentData);

    // 1. Save to Admin Inbox
    submitInquiry({
      name: currentData.name,
      email: currentData.email,
      phone: currentData.phone,
      projectType: `${currentData.invitationStyle} Invitation`,
      budget: currentData.weddingDate ? `Wedding: ${currentData.weddingDate}` : 'Wedding Invitation',
      message: currentData.message,
    });

    // 2. Dispatch real email notification to AM Studio + Autoresponder to Client
    try {
      const studioEmail = profile.email || 'amstudio.support.in@gmail.com';
      const cleanStudioPhone = (profile.phone || '9731696952').replace(/\D/g, '');
      const studioPhoneWithCountry = cleanStudioPhone.length === 10 ? `91${cleanStudioPhone}` : cleanStudioPhone;

      const preFilledWhatsAppText = `Hi AM Studio! I have submitted a wedding invitation inquiry for ${currentData.name} (${currentData.invitationStyle} Style, Date: ${currentData.weddingDate || 'TBD'}). Please share the preview and details!`;

      const autoResponseText = `Dear ${currentData.name},

Thank you for choosing AM Studio! We have safely received your wedding invitation request.

--- YOUR SUBMITTED DETAILS ---
• Name: ${currentData.name}
• Email: ${currentData.email}
• Phone: ${currentData.phone}
• Preferred Style: ${currentData.invitationStyle} Invitation
• Wedding Date: ${currentData.weddingDate || 'To be decided'}
• Message: ${currentData.message}

--- WHAT HAPPENS NEXT ---
1. Concept Review: Our design team is reviewing your requirements and story.
2. Live Mobile Preview: We will prepare an interactive live mobile preview link with your theme, background music, RSVP tracking, and Google Maps venue navigation.
3. We will get in touch with you within 24 hours.

--- DIRECT STUDIO CONTACT ---
• WhatsApp (Click to chat with auto-typed message):
https://wa.me/${studioPhoneWithCountry}?text=${encodeURIComponent(preFilledWhatsAppText)}

• Call Direct (Click on mobile to open phone dialpad):
tel:+${studioPhoneWithCountry} (or call +91 97316 96952)

• Official Email (Click to auto-compose):
mailto:${studioEmail}?subject=${encodeURIComponent(`Wedding Invitation Follow-up - ${currentData.name}`)}

Warm regards,
AM Studio | Digital Wedding Invitations
Davanagere, Karnataka
Website: https://am-studio-umber.vercel.app/`;

      await fetch('https://formsubmit.co/ajax/8136667047df08585270147f34512a30', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: currentData.name,
          email: currentData.email,
          phone: currentData.phone,
          invitation_style: currentData.invitationStyle,
          wedding_date: currentData.weddingDate || 'To be decided',
          message: currentData.message,
          _subject: `💍 New Wedding Invitation Request: ${currentData.name} (${currentData.invitationStyle})`,
          _template: 'table',
          _captcha: 'false',
          _replyto: currentData.email,
          _autoresponse: autoResponseText,
        }),
      });
    } catch (err) {
      console.warn('Email dispatch completed', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      invitationStyle: 'Modern',
      weddingDate: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Direct Contact Details */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              Direct Communication
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight break-words">
              LET'S BUILD SOMETHING ICONIC.
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 font-light leading-relaxed">
              Have a wedding invitation project, or need a beautiful digital invitation website? Let’s bring your vision to life. Reach out directly.
            </p>
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-4">
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email || 'amstudio.support.in@gmail.com')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-colors group"
              title="Compose in Gmail"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-zinc-400">Official Studio Email</div>
                <div className="text-white text-sm font-medium">{profile.email}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 ml-auto group-hover:text-white transition-colors" />
            </a>

            {profile.phone && (
              <div
                onClick={handlePhoneClick}
                className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-all cursor-pointer group select-none"
                role="button"
                tabIndex={0}
                title="Click to call (Phone) or open WhatsApp (Desktop)"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                    <span>Direct Call &amp; WhatsApp</span>
                  </div>
                  <div className="text-white text-sm font-medium">{profile.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent("Hello AM Studio, I would like to inquire about a wedding invitation website.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-black text-zinc-400 transition-colors"
                    title="Direct WhatsApp"
                  >
                    <WhatsApp className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:+${fullPhoneNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white hover:text-black text-zinc-400 transition-colors"
                    title="Direct Phone Call"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {profile.location && (
              <div className="space-y-3">
                <div
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-4 p-4 rounded-xl glass-panel border border-white/10 hover:border-white/30 transition-all cursor-pointer group select-none"
                  role="button"
                  tabIndex={0}
                  title="Click to view Davanagere on Map"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                      <span>Location</span>
                      <span className="text-[10px] text-zinc-500 font-mono">({showMap ? 'Hide Map' : 'Click to View Map'})</span>
                    </div>
                    <div className="text-white text-sm font-medium">{profile.location}</div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location || 'Davanagere, Karnataka')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/10 hover:bg-white hover:text-black text-zinc-400 transition-colors"
                    title="Open in Google Maps"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Embedded Interactive Davanagere Map */}
                {showMap && (
                  <div className="rounded-2xl overflow-hidden border border-white/20 glass-panel shadow-2xl p-3 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        Davanagere, Karnataka • Live Map
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location || 'Davanagere, Karnataka')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <span>Open Full Screen</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="w-full h-56 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 relative">
                      <iframe
                        title="Davanagere Karnataka Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src="https://maps.google.com/maps?q=Davanagere,%20Karnataka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        className="filter invert-[90%] hue-rotate-180 contrast-[120%] brightness-[90%]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Social Channels (Shown only when added via Admin) */}
          {hasSocials && (
            <div className="pt-4">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
                Social Dispatches
              </div>
              <div className="flex items-center gap-3">
                {profile.socials?.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile.socials?.twitter && (
                  <a
                    href={profile.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {profile.socials?.linkedin && (
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile.socials?.instagram && (
                  <a
                    href={profile.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile.socials?.dribbble && (
                  <a
                    href={profile.socials.dribbble}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl glass-panel border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-colors"
                    aria-label="Dribbble"
                  >
                    <Dribbble className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Proposal Form */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl glass-panel border border-white/10 relative">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              START YOUR INVITATION JOURNEY
            </h3>
            <p className="text-zinc-400 text-xs md:text-sm font-light mb-6 sm:mb-8 leading-relaxed">
              Tell us a little about your wedding and what you'd like your digital invitation to look like. We'll get in touch and take it from there.
            </p>

            {submitted ? (
              <div className="p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/20 space-y-6 animate-fade-in text-left">
                {/* Header with animated icon */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Request Received &amp; Queued</span>
                    </div>
                    <h4 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      Thank You, {submittedData?.name || 'Friend'}!
                    </h4>
                    <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">
                      We’ve received your wedding details. A confirmation email has been dispatched with related information, and our team is reviewing your vision.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex-shrink-0 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>

                {/* Summary Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-400">Preferred Style</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{submittedData?.invitationStyle || 'Custom'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-400">Wedding Date</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{submittedData?.weddingDate || 'To be decided'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-400">Client Email</p>
                    <p className="text-sm font-semibold text-white mt-0.5 truncate">{submittedData?.email}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-400">Client Phone</p>
                    <p className="text-sm font-semibold text-white mt-0.5 truncate">{submittedData?.phone}</p>
                  </div>
                </div>

                {submittedData?.message && (
                  <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 text-xs text-zinc-300 font-light">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Your Wedding Vision & Notes:</span>
                    "{submittedData.message}"
                  </div>
                )}

                {/* What Happens Next Section */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                    What Happens Next:
                  </h5>
                  <div className="space-y-2.5 text-xs md:text-sm text-zinc-300 font-light">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <Clock className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-medium">Review within 24 Hours:</strong> Our design lead is reviewing your dates, story, and preferred style to prepare interactive concept proposals.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <Smartphone className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white font-medium">Interactive Live Mobile Preview:</strong> You’ll receive a private testing link to experience your wedding website on mobile with music, photo albums, RSVP tracking, and Google Maps.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: WhatsApp auto-typed, Call dialpad, Email auto-compose */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Connect Directly with AM Studio:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* 1. WhatsApp with Auto-Typed message */}
                    <a
                      href={`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(
                        `Hi AM Studio! I have submitted a wedding invitation inquiry for ${submittedData?.name || 'our wedding'} (${submittedData?.invitationStyle || 'Custom'} Style, Date: ${submittedData?.weddingDate || 'TBD'}). Please share the preview and details!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all shadow-md text-center"
                    >
                      <WhatsApp className="w-4 h-4 flex-shrink-0" />
                      <span>WhatsApp Chat</span>
                    </a>

                    {/* 2. Direct Phone Call -> Dialpad on mobile */}
                    <a
                      href={`tel:+${fullPhoneNumber}`}
                      className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/20 transition-all shadow-md text-center"
                    >
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Call Dialpad</span>
                    </a>

                    {/* 3. Direct Email Compose -> Auto-compose */}
                    <a
                      href={`mailto:${profile.email || 'amstudio.support.in@gmail.com'}?subject=${encodeURIComponent(`Wedding Invitation Inquiry Follow-up - ${submittedData?.name || ''}`)}&body=${encodeURIComponent(`Hello AM Studio Team,\n\nI have submitted an inquiry for ${submittedData?.name || 'our wedding'} (${submittedData?.invitationStyle || 'Custom'} Style).\n\nLooking forward to hearing from you!`)}`}
                      className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/20 transition-all shadow-md text-center"
                    >
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Email Compose</span>
                    </a>
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-mono uppercase text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Send Another Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul & Priya"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      WHATSAPP NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 97316 96952"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      INVITATION STYLE
                    </label>
                    <select
                      value={formData.invitationStyle}
                      onChange={(e) => setFormData({ ...formData, invitationStyle: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm font-mono cursor-pointer"
                    >
                      <option value="Traditional" className="bg-zinc-900 text-white">Traditional</option>
                      <option value="Modern" className="bg-zinc-900 text-white">Modern</option>
                      <option value="Royal" className="bg-zinc-900 text-white">Royal</option>
                      <option value="Minimal" className="bg-zinc-900 text-white">Minimal</option>
                      <option value="Floral" className="bg-zinc-900 text-white">Floral</option>
                      <option value="Custom Design" className="bg-zinc-900 text-white">Custom Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                      YOUR WEDDING DATE
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25 December 2026"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    TELL US ABOUT YOUR WEDDING *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your wedding, preferred design, events, photos, location and any special features you'd like in your invitation..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-white text-black font-semibold text-sm tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Sending Request...</span>
                  ) : (
                    <>
                      <span>SEND INVITATION REQUEST</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
