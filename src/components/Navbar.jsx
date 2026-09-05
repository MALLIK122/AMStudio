import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../context/StudioContext';
import { ShieldCheck, Menu, X, ArrowUpRight, Globe, ChevronDown } from 'lucide-react';

import AMLogo from './AMLogo';

export default function Navbar() {
  const { 
    profile, 
    isAdminLoggedIn, 
    currentView, 
    setCurrentView,
    language,
    setLanguage,
    t,
    SUPPORTED_LANGUAGES,
  } = useStudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentLangObj = (SUPPORTED_LANGUAGES || []).find(l => l.code === language) || { code: 'en', label: 'English', shortLabel: 'EN' };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        
        {/* Brand Studio Mark with Creative AM Logo */}
        <button 
          onClick={() => {
            setCurrentView('public');
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group text-left"
        >
          <AMLogo size="sm" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'features')}
          </button>
          <button 
            onClick={() => scrollToSection('process')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'howItWorks')}
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'invitations')}
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'packages')}
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'faq')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            {t('nav', 'contact')}
          </button>

          {/* Desktop Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/50 text-xs font-mono tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-semibold">{currentLangObj.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-zinc-950/95 border border-white/15 backdrop-blur-xl shadow-2xl p-1.5 space-y-1 z-50 animate-fade-in">
                {(SUPPORTED_LANGUAGES || []).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${
                      language === lang.code
                        ? 'bg-white text-black font-bold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    <span className={`text-[10px] font-mono ${language === lang.code ? 'text-zinc-700' : 'text-zinc-500'}`}>
                      {lang.shortLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Control Switch */}
          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider border transition-all ${
              currentView === 'admin'
                ? 'bg-white text-black border-white font-semibold'
                : 'border-white/20 text-zinc-400 hover:text-white hover:border-white/50'
            }`}
            title="Studio Admin Management Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentView === 'admin' ? (language === 'kn' ? 'ಸೈಟ್ ನೋಡಿ' : language === 'te' ? 'సైట్ చూడండి' : 'View Site') : t('nav', 'admin')}</span>
          </button>

          {/* Get In Touch CTA */}
          <button
            onClick={() => scrollToSection('pricing')}
            className="px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-white text-black hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 shadow-lg shadow-white/5"
          >
            <span>{t('nav', 'bookInvite')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Menu Trigger & Quick Lang Switch */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Fast Language Toggle */}
          <div className="flex items-center rounded-lg bg-white/5 border border-white/15 p-0.5">
            {(SUPPORTED_LANGUAGES || []).map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                  language === lang.code
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lang.shortLabel}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
            className="p-2 rounded-lg border border-white/15 text-zinc-300 hover:text-white"
            aria-label="Toggle Admin"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black/95 backdrop-blur-xl px-6 py-6 space-y-4 animate-fade-in">
          {/* Mobile Language Selector Pill Bar */}
          <div className="pb-3 border-b border-white/10">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Select Language / ಭಾಷೆ / భాష</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(SUPPORTED_LANGUAGES || []).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                    language === lang.code
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-zinc-900 border-white/10 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'features')}
          </button>
          <button 
            onClick={() => scrollToSection('process')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'howItWorks')}
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'invitations')}
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'packages')}
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'faq')}
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            {t('nav', 'contact')}
          </button>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCurrentView(currentView === 'admin' ? 'public' : 'admin');
              }}
              className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{currentView === 'admin' ? (language === 'kn' ? 'ಸೈಟ್ ನೋಡಿ' : language === 'te' ? 'సైట్ చూడండి' : 'View Site') : t('nav', 'admin')}</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black"
            >
              {t('nav', 'bookInvite')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
