'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const NOTES: [number, number][] = [
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [523.25, 1.0], [493.88, 2.0],
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [587.33, 1.0], [523.25, 2.0],
  [392.00, 0.75], [392.00, 0.25], [783.99, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.00, 2.0],
  [698.46, 0.75], [698.46, 0.25], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 3.0],
];

const BEAT = 0.38;
const MELODY_DURATION = NOTES.reduce((s, [, b]) => s + b * BEAT + 0.02, 0.1);
const LOOP_PAUSE = 2; // seconds between repeats

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
  // Synchronous ref (not state) so we avoid React async state timing issues
  const loopActiveRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const clearLoop = useCallback(() => {
    if (loopTimerRef.current) { clearTimeout(loopTimerRef.current); loopTimerRef.current = null; }
  }, []);

  const stopAll = useCallback(() => {
    clearLoop();
    loopActiveRef.current = false;
    setIsPlaying(false);
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
  }, [clearLoop]);

  const doLoop = useCallback((ctx: AudioContext) => {
    if (!loopActiveRef.current || ctxRef.current !== ctx) return;
    scheduleMelody(ctx, ctx.currentTime);
    setIsPlaying(true);
    loopTimerRef.current = setTimeout(
      () => doLoop(ctx),
      (MELODY_DURATION + LOOP_PAUSE) * 1000
    );
  }, []);

  // Core start function — safe to call multiple times (guards via loopActiveRef)
  const startMusic = useCallback(async () => {
    if (loopActiveRef.current) return; // already looping, do nothing

    let ctx = ctxRef.current;
    if (!ctx || ctx.state === 'closed') {
      ctx = new AudioContext();
      ctxRef.current = ctx;
    }
    if (ctx.state === 'suspended') {
      await ctx.resume(); // requires user gesture — will resolve if we're in one
    }
    if (ctx.state !== 'running') return; // browser still blocking, bail out silently

    loopActiveRef.current = true;
    doLoop(ctx);
  }, [doLoop]);

  const togglePause = useCallback(() => {
    if (loopActiveRef.current) {
      stopAll();
    } else {
      startMusic();
    }
  }, [stopAll, startMusic]);

  useEffect(() => {
    // 1️⃣  Try immediate autoplay on mount (works if user already interacted before)
    startMusic();

    // 2️⃣  On FIRST user interaction anywhere, start music.
    //     Using BUBBLE phase (no capture) so that e.stopPropagation() on the
    //     music button prevents this from double-firing when the button is clicked.
    const onFirstInteraction = () => { startMusic(); };
    document.addEventListener('click',      onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    document.addEventListener('keydown',    onFirstInteraction, { once: true });
    document.addEventListener('scroll',     onFirstInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('click',      onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('keydown',    onFirstInteraction);
      document.removeEventListener('scroll',     onFirstInteraction);
      stopAll();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only on mount

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3 select-none">
        {/* Pulsing glow ring while playing */}
        <div className="relative">
          {isPlaying && (
            <>
              <div className="absolute inset-0 rounded-full bg-purple-400/40 animate-ping pointer-events-none" />
              <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse pointer-events-none" />
            </>
          )}
          {/* Music button — stopPropagation keeps the global listener from double-firing */}
          <button
            onClick={(e) => { e.stopPropagation(); togglePause(); }}
            title={isPlaying ? 'Pause music' : 'Play Happy Birthday'}
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

        {/* Equalizer label */}
        {isPlaying && (
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[3px] bg-purple-400 rounded-full"
                  style={{ height: `${6 + i * 3}px`, animation: `eq-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate` }}
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
      `}</style>
    </>
  );
}
