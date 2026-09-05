import React, { useState, useRef, useEffect } from 'react';
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

  const featuresList = [
    {
      icon: Music,
      title: 'Romantic Background Audio',
      kannada: 'ರೋಮ್ಯಾಂಟಿಕ್ ಬ್ಯಾಕ್‌ಗ್ರೌಂಡ್ ಮ್ಯೂಸಿಕ್',
      description: 'Guests are greeted by your chosen romantic song or classical instrumental flute/nadaswaram score as they scroll through your celebration story.',
      interactiveAudio: true,
    },
    {
      icon: MapPin,
      title: '1-Click Google Maps Directions',
      kannada: 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ನೇರ ನ್ಯಾವಿಗೇಷನ್',
      description: 'Direct turn-by-turn navigation pinpoints so your guests reach your wedding choultry, temple, or resort with zero confusion or phone calls.',
    },
    {
      icon: Clock,
      title: 'Live Muhurtham Countdown',
      kannada: 'ಲೈವ್ ಮುಹೂರ್ತ ಕೌಂಟ್‌ಡೌನ್',
      description: 'An animated real-time timer counting down days, hours, and minutes to the auspicious muhurtham moment, building joyous excitement.',
    },
    {
      icon: CheckSquare,
      title: 'Real-Time RSVP & Guest Tracker',
      kannada: 'ಆನ್‌ಲೈನ್ RSVP ಅಟೆಂಡೆನ್ಸ್ ಟ್ರ್ಯಾಕಿಂಗ್',
      description: 'Guests submit their attendance and family headcounts directly on your link, with instant reports sent to your studio dashboard and email.',
    },
    {
      icon: Share2,
      title: 'Smart WhatsApp & Social Previews',
      kannada: 'ವಾಟ್ಸಾಪ್ ಸ್ಮಾರ್ಟ್ ಶೇರಿಂಗ್ ಕಾರ್ಡ್',
      description: 'When you share your link on WhatsApp, a rich preview card with your couple portrait, wedding dates, and custom invite text appears instantly.',
    },
    {
      icon: QrCode,
      title: 'Dining Table Standee QR Codes',
      kannada: 'ಮಂಟಪ ಟೇಬಲ್ ಸ್ಟಾಂಡೀ QR ಕೋಡ್',
      description: 'Matching physical QR standees for your dining tables and reception stage, allowing guests to scan and view the digital event gallery on their phones.',
    },
    {
      icon: Languages,
      title: 'Bilingual (ಕನ್ನಡ + English)',
      kannada: 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ದ್ವಿಭಾಷಾ ಸಪೋರ್ಟ್',
      description: 'Authentic traditional Kannada wedding invitation typography crafted alongside elegant modern English for multi-generational guests.',
    },
    {
      icon: Zap,
      title: 'Instant Live Updates',
      kannada: 'ರಿಯಲ್-ಟೈಮ್ ಇನ್‌ಸ್ಟಂಟ್ ಅಪ್ಡೇಟ್',
      description: 'Need to change a timing or reception venue detail? Update it instantly in real-time without re-printing or re-sending PDFs.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-300 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Interactive Wedding Technology</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          WHY CHOOSE A DIGITAL WEDDING INVITATION?
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-light leading-relaxed">
          More than just an announcement—an immersive, unforgettable digital keepsake engineered with music, Google Maps, RSVP tracking, and stunning visuals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {featuresList.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div 
              key={index}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.02] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.05] transition-all" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-white/40 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {feat.interactiveAudio && (
                    <button
                      onClick={toggleAudio}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isPlayingAudio 
                          ? 'bg-white text-black font-semibold shadow-lg shadow-white/10' 
                          : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                      }`}
                      title="Preview sample wedding instrumental melody"
                    >
                      {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{isPlayingAudio ? 'Playing' : 'Sound Demo'}</span>
                    </button>
                  )}
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1 group-hover:text-zinc-100 transition-colors">
                  {feat.title}
                </h3>
                <div className="text-[11px] font-mono text-zinc-400 mb-2 font-medium">
                  {feat.kannada}
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {feat.interactiveAudio && isPlayingAudio && (
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
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
