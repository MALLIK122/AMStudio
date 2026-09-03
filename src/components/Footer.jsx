import React from 'react';
import { useStudio } from '../context/StudioContext';
import { ArrowUp, ShieldCheck } from 'lucide-react';
import AMLogo from './AMLogo';

export default function Footer() {
  const { profile, setCurrentView, currentView } = useStudio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-black py-12 sm:py-16 px-4 sm:px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left: Branding & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <AMLogo size="sm" />
          <p className="text-zinc-500 text-xs font-mono">
            &copy; {new Date().getFullYear()} AM Studio. All rights reserved.
          </p>
        </div>


        {/* Right: Admin Switch & Back to Top */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setCurrentView(currentView === 'admin' ? 'public' : 'admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors px-3 py-1.5 rounded border border-white/5 hover:border-white/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white text-zinc-400 hover:text-black transition-all border border-white/10"
            title="Return to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
