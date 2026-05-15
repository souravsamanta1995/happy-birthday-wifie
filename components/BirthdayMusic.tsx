'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Happy Birthday melody: [frequency Hz, duration beats]
const NOTES: [number, number][] = [
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [523.25, 1.0], [493.88, 2.0],
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [587.33, 1.0], [523.25, 2.0],
  [392.00, 0.75], [392.00, 0.25], [783.99, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.00, 2.0],
  [698.46, 0.75], [698.46, 0.25], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 3.0],
];

const BEAT = 0.38; // seconds per beat
const MELODY_DURATION = NOTES.reduce((s, [, b]) => s + b * BEAT + 0.02, 0.1);
const LOOP_PAUSE = 2; // seconds between loops

function scheduleMelody(ctx: AudioContext, startAt: number) {
  let t = startAt;
  NOTES.forEach(([freq, beats]) => {
    const dur = beats * BEAT;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.88);
    osc.start(t); osc.stop(t + dur);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.09, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.7);
    osc2.start(t); osc2.stop(t + dur);

    t += dur + 0.02;
  });
}

export default function BirthdayMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blockedByBrowser, setBlockedByBrowser] = useState(false);

  const clearLoop = useCallback(() => {
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    loopTimerRef.current = null;
  }, []);

  const stopAll = useCallback(() => {
    clearLoop();
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    setIsPlaying(false);
  }, [clearLoop]);

  const loop = useCallback((ctx: AudioContext) => {
    const now = ctx.currentTime;
    scheduleMelody(ctx, now);
    startTimeRef.current = now;
    setIsPlaying(true);
    // Schedule next loop
    loopTimerRef.current = setTimeout(() => {
      if (ctxRef.current === ctx) loop(ctx);
    }, (MELODY_DURATION + LOOP_PAUSE) * 1000);
  }, []);

  const beginPlaying = useCallback(() => {
    if (ctxRef.current) return; // already playing
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    setBlockedByBrowser(false);
    loop(ctx);
  }, [loop]);

  const togglePause = useCallback(() => {
    if (isPlaying) {
      stopAll();
    } else {
      beginPlaying();
    }
  }, [isPlaying, stopAll, beginPlaying]);

  // 1️⃣ Try to autoplay immediately on mount
  useEffect(() => {
    const tryAutoplay = async () => {
      try {
        const ctx = new AudioContext();
        // If state is 'suspended', browser blocked autoplay
        if (ctx.state === 'suspended') {
          ctx.close();
          setBlockedByBrowser(true);
          return;
        }
        ctxRef.current = ctx;
        loop(ctx);
      } catch {
        setBlockedByBrowser(true);
      }
    };
    tryAutoplay();
    return () => stopAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2️⃣ If browser blocked autoplay, start on FIRST user interaction anywhere
  useEffect(() => {
    if (!blockedByBrowser) return;

    const handler = () => {
      setBlockedByBrowser(false);
      beginPlaying();
    };

    // Use capture so we catch the interaction before anything else
    window.addEventListener('click', handler, { once: true, capture: true });
    window.addEventListener('touchstart', handler, { once: true, capture: true });
    window.addEventListener('keydown', handler, { once: true, capture: true });
    window.addEventListener('scroll', handler, { once: true, capture: true });

    return () => {
      window.removeEventListener('click', handler, { capture: true });
      window.removeEventListener('touchstart', handler, { capture: true });
      window.removeEventListener('keydown', handler, { capture: true });
      window.removeEventListener('scroll', handler, { capture: true });
    };
  }, [blockedByBrowser, beginPlaying]);

  return (
    <>
      {/* Floating music player — fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3 select-none">

        {/* Browser blocked autoplay notice */}
        {blockedByBrowser && (
          <div
            className="music-prompt cursor-pointer bg-white/10 backdrop-blur-xl border border-purple-300/30 rounded-2xl px-4 py-3 shadow-2xl max-w-[190px] text-center"
            onClick={() => { setBlockedByBrowser(false); beginPlaying(); }}
          >
            <p className="text-white text-xs font-bold leading-relaxed">
              🎵 Tap anywhere to play<br />Happy Birthday! 🎂
            </p>
          </div>
        )}

        {/* Main play/pause button */}
        <div className="relative">
          {isPlaying && (
            <>
              <div className="absolute inset-0 rounded-full bg-purple-400/40 animate-ping" />
              <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse" />
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); togglePause(); }}
            title={isPlaying ? 'Pause' : 'Play Happy Birthday'}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 shadow-[0_0_30px_rgba(168,85,247,0.6)] border-2 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(168,85,247,0.8)] active:scale-95"
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
              </svg>
            )}
          </button>
        </div>

        {/* Now playing equalizer */}
        {isPlaying && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[3px] bg-purple-400 rounded-full"
                  style={{
                    height: `${6 + i * 3}px`,
                    animation: `eq-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
            <span className="text-white text-[10px] font-bold tracking-wider">PLAYING</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
        .music-prompt {
          animation: slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
