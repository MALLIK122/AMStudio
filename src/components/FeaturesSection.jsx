import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { 
  Music, 
  MapPin, 
  Clock, 
  CheckSquare, 
  Share2, 
  QrCode, 
  Languages, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';

export default function FeaturesSection() {
  const { t } = useStudio();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const pentatonicNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
      let step = 0;

      const playTone = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const freq = pentatonicNotes[step % pentatonicNotes.length];
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1.3);

        step++;
      };

      playTone();
      intervalRef.current = setInterval(playTone, 800);
      setIsPlayingAudio(true);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const iconsMap = {
    music: Music,
    maps: MapPin,
    countdown: Clock,
    rsvp: CheckSquare,
    sharing: Share2,
    qrCode: QrCode,
    multiLang: Languages,
    instantEdit: Zap,
  };

  const featureItems = t('features', 'items') || [];

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono tracking-widest text-zinc-200 uppercase font-medium">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{t('features', 'tag')}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          {t('features', 'title')}
        </h2>
        <p className="text-zinc-200 text-xs sm:text-sm md:text-base font-normal leading-relaxed">
          {t('features', 'subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {featureItems.map((feat, index) => {
          const Icon = iconsMap[feat.id] || Sparkles;
          const isAudio = feat.id === 'music';
          return (
            <div 
              key={feat.id || index}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.05] transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white/40 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {isAudio && (
                    <button
                      onClick={toggleAudio}
                      className={`px-2.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isPlayingAudio 
                          ? 'bg-white text-black font-semibold shadow-lg shadow-white/10' 
                          : 'bg-white/10 text-zinc-200 hover:bg-white/20 font-medium'
                      }`}
                      title="Preview sample wedding instrumental melody"
                    >
                      {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Playing' : 'Sound Demo'}</span>
                    </button>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2 group-hover:text-zinc-100 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-zinc-200 text-xs sm:text-sm font-normal leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {isAudio && isPlayingAudio && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-300 font-medium">
                  <span>Sample Wedding Melody</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-white animate-pulse rounded-full" />
                    <span className="w-1 h-5 bg-white animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-2 bg-white animate-pulse delay-150 rounded-full" />
                    <span className="w-1 h-4 bg-white animate-pulse delay-100 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
