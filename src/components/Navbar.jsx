import React, { useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { ShieldCheck, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

import AMLogo from './AMLogo';

export default function Navbar() {
  const { profile, isAdminLoggedIn, currentView, setCurrentView } = useStudio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        <nav className="hidden md:flex items-center gap-7">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('process')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Invitations
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Packages
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            FAQ
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-sm tracking-wide text-zinc-400 hover:text-white transition-colors duration-200"
          >
            Contact
          </button>

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
            <span>{currentView === 'admin' ? 'View Site' : 'Admin'}</span>
          </button>

          {/* Get In Touch CTA */}
          <button
            onClick={() => scrollToSection('pricing')}
            className="px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-white text-black hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 shadow-lg shadow-white/5"
          >
            <span>Book Invitation</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-3">
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
          <button 
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            Features & Sound
          </button>
          <button 
            onClick={() => scrollToSection('process')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            How It Works (4 Steps)
          </button>
          <button 
            onClick={() => scrollToSection('projects')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            Selected Invitations
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            Pricing & Packages
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            Frequently Asked Questions
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-2 text-base font-medium text-zinc-300 hover:text-white"
          >
            Contact Studio
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
              <span>{currentView === 'admin' ? 'Return to Showcase' : 'Studio Admin Panel'}</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black"
            >
              Get In Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
