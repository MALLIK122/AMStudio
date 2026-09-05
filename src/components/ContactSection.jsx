import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight, Sparkles, Clock, Smartphone } from 'lucide-react';
import { Github, Twitter, Linkedin, Instagram, Dribbble, WhatsApp } from './Icons';

export default function ContactSection() {
  const { profile, submitInquiry, t, language } = useStudio();

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

  const getWhatsAppAlertText = (data) => {
    if (!data) return '';
    return [
      '*AM STUDIO - NEW CLIENT INQUIRY*',
      '----------------------------------------',
      `*Client Name:* ${data.name}`,
      `*Phone:* ${data.phone}`,
      `*Email:* ${data.email}`,
      `*Service / Style:* ${data.invitationStyle}`,
      `*Event Date:* ${data.weddingDate || 'Not specified'}`,
      '',
      '*Client Message / Requirements:*',
      `"${data.message}"`,
      '----------------------------------------',
      '_Dispatched via AM Studio Website_'
    ].join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    const currentData = { ...formData };
    setSubmittedData(currentData);

    // 1. Save to Admin Inbox (CMS)
    submitInquiry({
      name: currentData.name,
      email: currentData.email,
      phone: currentData.phone,
      projectType: currentData.invitationStyle,
      budget: currentData.weddingDate ? `Date: ${currentData.weddingDate}` : 'Wedding / Event',
      message: currentData.message,
    });

    // 2. Dispatch real-time formatted WhatsApp Alert directly to AM Studio (+91 97316 96952)
    const alertMessage = getWhatsAppAlertText(currentData);
    const studioPhone = fullPhoneNumber || '919731696952';
    const waAlertUrl = `https://wa.me/${studioPhone}?text=${encodeURIComponent(alertMessage)}`;
    
    try {
      window.open(waAlertUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Auto WhatsApp dispatch notice:', err);
    }

    // 3. Fallback Mailto notification
    try {
      const studioEmail = profile.email || 'amstudio.support.in@gmail.com';
      const mailtoAdmin = `mailto:${studioEmail}?subject=${encodeURIComponent(`New Client Inquiry - ${currentData.name}`)}&body=${encodeURIComponent(alertMessage)}`;

      const hiddenIframe = document.createElement('iframe');
      hiddenIframe.style.display = 'none';
      hiddenIframe.src = mailtoAdmin;
      document.body.appendChild(hiddenIframe);
      setTimeout(() => hiddenIframe.remove(), 1000);
    } catch (err) {
      console.warn('Mail notification fallback:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setSubmittedData(null);
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
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-300 font-semibold uppercase mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              {t('contact', 'tag')}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight break-words">
              {t('contact', 'title')}
            </h2>
            <p className="text-zinc-200 text-xs sm:text-sm md:text-base mt-3 sm:mt-4 font-normal leading-relaxed">
              {t('contact', 'subtitle')}
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
                <div className="text-xs font-mono uppercase text-zinc-300 font-medium">
                  {language === 'kn' ? 'ಅಧಿಕೃತ ಸ್ಟುಡಿಯೋ ಇಮೇಲ್' : language === 'te' ? 'అధికారిక స్టూడియో ఈమెయిల్' : 'Official Studio Email'}
                </div>
                <div className="text-white text-sm font-semibold">{profile.email}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 ml-auto group-hover:text-white transition-colors" />
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
                  <div className="text-xs font-mono uppercase text-zinc-300 font-medium flex items-center gap-1.5">
                    <span>Direct Call &amp; WhatsApp</span>
                  </div>
                  <div className="text-white text-sm font-semibold">{profile.phone}</div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent("Hello AM Studio, I would like to inquire about a wedding invitation website.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/15 hover:bg-emerald-500 hover:border-emerald-500 hover:text-black text-zinc-300 transition-colors"
                    title="Direct WhatsApp"
                  >
                    <WhatsApp className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:+${fullPhoneNumber}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/15 hover:bg-white hover:text-black text-zinc-300 transition-colors"
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
                    <div className="text-xs font-mono uppercase text-zinc-300 font-medium flex items-center gap-1.5">
                      <span>Location</span>
                      <span className="text-[10px] text-zinc-400 font-mono">({showMap ? 'Hide Map' : 'Click to View Map'})</span>
                    </div>
                    <div className="text-white text-sm font-semibold">{profile.location}</div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location || 'Davanagere, Karnataka')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg border border-white/15 hover:bg-white hover:text-black text-zinc-300 transition-colors"
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
              {language === 'kn' ? 'ವೆಡ್ಡಿಂಗ್ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಪೋಸ್ಟರ್ ಬುಕ್ ಮಾಡಿ' : language === 'te' ? 'వెడ్డింగ్ వెబ్‌సైట్ లేదా పోస్టర్ ఆర్డర్ చేయండి' : 'ORDER YOUR WEDDING WEBSITE OR CUSTOM POSTER'}
            </h3>
            <p className="text-zinc-200 text-xs md:text-sm font-normal mb-6 sm:mb-8 leading-relaxed">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ಮದುವೆ ವೆಬ್‌ಸೈಟ್, ವೆಡ್ಡಿಂಗ್ ಕಾರ್ಡ್, ಬೇಬಿ ಶವರ್ ಅಥವಾ ಯಾವುದೇ ಬಗೆಯ ಪೋಸ್ಟರ್ ಬಗ್ಗೆ ವಿವರ ತಿಳಿಸಿ. ನಾವು 24 ಗಂಟೆಗಳಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'
                : language === 'te'
                ? 'మీ వివాహ వెబ్‌సైట్, వెడ్డింగ్ కార్డ్స్, బేబీ షవర్ లేదా ఏదైనా పోస్టర్ వివరాలను పంపండి. 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తాము.'
                : "Tell us about your wedding website, invitation card, baby shower poster, or custom event flyer. We'll get in touch with live previews in 24 hours."}
            </p>

            {submitted ? (
              <div className="p-5 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/20 space-y-6 animate-fade-in text-left">
                {/* Header with animated icon */}
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>{language === 'kn' ? 'ಮನವಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ' : language === 'te' ? 'వినతి స్వీకరించబడింది' : 'Request Received & Queued'}</span>
                    </div>
                    <h4 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                      {language === 'kn' ? `ಧನ್ಯವಾದಗಳು, ${submittedData?.name || 'ಸ್ನೇಹಿತರೆ'}!` : language === 'te' ? `ధన్యవాదాలు, ${submittedData?.name || 'మిత్రమా'}!` : `Thank You, ${submittedData?.name || 'Friend'}!`}
                    </h4>
                    <p className="text-zinc-200 text-xs md:text-sm font-normal leading-relaxed">
                      {t('contact', 'successMsg')}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex-shrink-0 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                </div>

                {/* Real-time WhatsApp Notification to AM Studio (+91 97316 96952) */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>
                        {language === 'kn'
                          ? 'AM Studio ವಾಟ್ಸಾಪ್ ಅಧಿಸೂಚನೆ'
                          : language === 'te'
                          ? 'AM Studio వాట్సాప్ అలర్ట్ నోటిఫికేషన్'
                          : 'AM Studio WhatsApp Notification'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300 font-semibold">
                      +91 97316 96952
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {language === 'kn'
                      ? 'ನಿಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಗಳನ್ನು ನೇರವಾಗಿ AM Studio ಮೊಬೈಲ್ ನಂಬರ್‌ಗೆ ವಾಟ್ಸಾಪ್ ಮುಖಾಂತರ ತಕ್ಷಣ ರವಾನಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ.'
                      : language === 'te'
                      ? 'మీ ప్రాజెక్ట్ వివరాలను నేరుగా AM Studio మొబైల్ నంబర్‌కు వాట్సాప్ ద్వారా వెంటనే పంపడానికి క్రింది బటన్ నొక్కండి.'
                      : 'To guarantee immediate delivery to AM Studio designers, click below to forward this inquiry directly to WhatsApp.'}
                  </p>

                  <a
                    href={`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(getWhatsAppAlertText(submittedData))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg"
                  >
                    <WhatsApp className="w-4 h-4 fill-current" />
                    <span>
                      {language === 'kn'
                        ? 'ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ರವಾನಿಸಿ (+91 97316 96952)'
                        : language === 'te'
                        ? 'వాట్సాಪ್ మెసేజ్ పంపండి (+91 97316 96952)'
                        : 'Send WhatsApp Alert to AM Studio (+91 97316 96952)'}
                    </span>
                  </a>
                </div>

                {/* Summary Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-300 font-medium">
                      {language === 'kn' ? 'ಶೈಲಿ' : language === 'te' ? 'శైలి' : 'Preferred Style'}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">{submittedData?.invitationStyle || 'Custom'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-300 font-medium">
                      {language === 'kn' ? 'ದಿನಾಂಕ' : language === 'te' ? 'తేదీ' : 'Wedding Date'}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">{submittedData?.weddingDate || 'To be decided'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-300 font-medium">Email</p>
                    <p className="text-sm font-semibold text-white mt-0.5 truncate">{submittedData?.email}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-mono uppercase text-zinc-300 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-white mt-0.5 truncate">{submittedData?.phone}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="text-xs font-mono uppercase text-zinc-300 font-medium">Instant One-Touch Connect:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href={`https://wa.me/${fullPhoneNumber}?text=${encodeURIComponent(
                        `Hi AM Studio! I have submitted an inquiry for ${submittedData?.name || 'our wedding'} (${submittedData?.invitationStyle || 'Custom'} Style, Date: ${submittedData?.weddingDate || 'TBD'}). Can you share custom design samples?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all shadow-md text-center"
                    >
                      <WhatsApp className="w-4 h-4 flex-shrink-0" />
                      <span>{t('contact', 'directWhatsApp')}</span>
                    </a>

                    <a
                      href={`tel:+${fullPhoneNumber}`}
                      className="flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/20 transition-all shadow-md text-center"
                    >
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t('contact', 'directCall')}</span>
                    </a>

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
                      onClick={handleResetForm}
                      className="text-xs font-mono uppercase text-zinc-300 hover:text-white font-medium transition-colors underline underline-offset-4"
                    >
                      {language === 'kn' ? 'ಮತ್ತೊಂದು ಮನವಿ ಕಳುಹಿಸಿ' : language === 'te' ? 'మరొక వినతి పంపండి' : 'Send Another Request'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                      {t('contact', 'nameLabel')} *
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
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                      {t('contact', 'emailLabel')} *
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
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                      {t('contact', 'phoneLabel')} *
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
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                      {language === 'kn' ? 'ಪ್ರಾಜೆಕ್ಟ್ / ಸೇವೆ ಆಯ್ಕೆಮಾಡಿ' : language === 'te' ? 'ప్రాజెక్ట్ / సేవ రకం' : 'SERVICE / PROJECT TYPE'}
                    </label>
                    <select
                      value={formData.invitationStyle}
                      onChange={(e) => setFormData({ ...formData, invitationStyle: e.target.value })}
                      className="w-full glass-input px-4 py-3 rounded-xl text-sm font-mono cursor-pointer"
                    >
                      <option value="Wedding Invitation Website" className="bg-zinc-900 text-white">Wedding Invitation Website</option>
                      <option value="Wedding Card / Save The Date Poster" className="bg-zinc-900 text-white">Wedding Card / Save The Date Poster</option>
                      <option value="Baby Shower Invitation Poster" className="bg-zinc-900 text-white">Baby Shower Invitation Poster</option>
                      <option value="Grand Opening / Event Poster" className="bg-zinc-900 text-white">Grand Opening / Event Poster</option>
                      <option value="Birthday / Party / Concert Poster" className="bg-zinc-900 text-white">Birthday / Party / Concert Poster</option>
                      <option value="Business / Marketing Flyer" className="bg-zinc-900 text-white">Business / Marketing Flyer</option>
                      <option value="Custom Design / Other" className="bg-zinc-900 text-white">Custom Poster / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                      {t('contact', 'dateLabel')}
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
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-200 font-semibold mb-2">
                    {t('contact', 'messageLabel')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      language === 'kn' 
                        ? 'ನಿಮ್ಮ ಮದುವೆ, ಕಾರ್ಯಕ್ರಮಗಳು, ಫೋಟೋಗಳು, ಸ್ಥಳ ಮತ್ತು ವಿಶೇಷ ಬಯಕೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ...'
                        : language === 'te'
                        ? 'మీ వివాహం, కార్యక్రమాలు, ఫోటోలు, స్థలం మరియు ప్రత్యేక వివరాల గురించి తెలియజేయండి...'
                        : "Tell us about your wedding, preferred design, events, photos, location and any special features you'd like in your invitation..."
                    }
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
                    <span>{t('contact', 'sending')}</span>
                  ) : (
                    <>
                      <span>{t('contact', 'sendBtn')}</span>
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
