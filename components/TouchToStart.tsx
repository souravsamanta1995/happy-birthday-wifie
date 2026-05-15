'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Happy Birthday melody ───────────────────────────────────────────────────
const NOTES: [number, number][] = [
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [523.25, 1.0], [493.88, 2.0],
  [392.00, 0.75], [392.00, 0.25], [440.00, 1.0], [392.00, 1.0], [587.33, 1.0], [523.25, 2.0],
  [392.00, 0.75], [392.00, 0.25], [783.99, 1.0], [659.25, 1.0], [523.25, 1.0], [493.88, 1.0], [440.00, 2.0],
  [698.46, 0.75], [698.46, 0.25], [659.25, 1.0], [523.25, 1.0], [587.33, 1.0], [523.25, 3.0],
];
const BEAT = 0.38;
const MELODY_DURATION = NOTES.reduce((s, [, b]) => s + b * BEAT + 0.02, 0.1);

function scheduleMelody(ctx: AudioContext, startAt: number) {
  let t = startAt;
  NOTES.forEach(([freq, beats]) => {
    const dur = beats * BEAT;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.88);
    osc.start(t); osc.stop(t + dur);
    const osc2 = ctx.createOscillator(); const gain2 = ctx.createGain();
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.type = 'sine'; osc2.frequency.setValueAtTime(freq * 2, t);
    gain2.gain.setValueAtTime(0, t);
    gain2.gain.linearRampToValueAtTime(0.09, t + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.7);
    osc2.start(t); osc2.stop(t + dur);
    t += dur + 0.02;
  });
}

// ─── Firework types ──────────────────────────────────────────────────────────
interface Spark { id: number; color: string; size: number; angle: number; velocity: number; duration: number; gravity: number; drift: number; }
interface Rocket { id: number; x: number; y: number; color: string; stage: 'launch' | 'burst'; sparks: Spark[]; }

const PALETTES = [
  ['#FF6B35', '#FFD700', '#FF1493', '#FFFFFF'],
  ['#9370DB', '#E0B0FF', '#FFFFFF', '#FFD700'],
  ['#00FFFF', '#7B68EE', '#FFFFFF', '#FF69B4'],
  ['#FF4500', '#FFA500', '#FFFF00', '#FFFFFF'],
  ['#FF1493', '#FF69B4', '#FFFFFF', '#FFD700'],
  ['#32CD32', '#ADFF2F', '#FFFFFF', '#FFD700'],
];

function makeRocket(id: number, x?: number, y?: number): Rocket {
  const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const sparks: Spark[] = Array.from({ length: 60 }, (_, i) => ({
    id: i, color: palette[Math.floor(Math.random() * palette.length)],
    size: 3 + Math.random() * 5, angle: Math.random() * Math.PI * 2,
    velocity: 4 + Math.random() * 8, duration: 1.0 + Math.random() * 1.5,
    gravity: 0.08 + Math.random() * 0.18, drift: (Math.random() - 0.5) * 3,
  }));
  return {
    id,
    x: x ?? 10 + Math.random() * 80,
    y: y ?? 8 + Math.random() * 50,
    color: palette[0], stage: 'launch', sparks,
  };
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function TouchToStart({ onDismiss }: { onDismiss?: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  const [fading, setFading]       = useState(false);
  const [rockets, setRockets]     = useState<Rocket[]>([]);

  // Music refs
  const ctxRef          = useRef<AudioContext | null>(null);
  const loopTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopActiveRef   = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Floating sparkles for the idle state
  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    emoji: ['✨','💜','🎵','🎂','⭐','💫','🌟','🎊','🎉'][i % 9],
    x: 5 + (i * 5.5) % 90,
    delay: (i * 0.4) % 3,
    dur: 2.5 + (i * 0.3) % 2,
  }));

  // ── Music loop ──────────────────────────────────────────────────────────
  const doLoop = useCallback((ctx: AudioContext) => {
    if (!loopActiveRef.current || ctxRef.current !== ctx) return;
    scheduleMelody(ctx, ctx.currentTime);
    setIsPlaying(true);
    loopTimerRef.current = setTimeout(() => doLoop(ctx), (MELODY_DURATION + 2) * 1000);
  }, []);

  // ⚠️ MUST be synchronous for iOS Safari — no async/await!
  // AudioContext creation + .resume() must happen in the synchronous
  // part of the user gesture handler. Once you await, iOS revokes the gesture.
  const startMusicSync = useCallback(() => {
    if (loopActiveRef.current) return;
    // Create AudioContext synchronously (within user gesture)
    let ctx = ctxRef.current;
    if (!ctx || ctx.state === 'closed') {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;
    }
    // Call resume() synchronously (returns Promise but the call itself unlocks iOS)
    ctx.resume().then(() => {
      if (ctx!.state === 'running' && !loopActiveRef.current) {
        loopActiveRef.current = true;
        doLoop(ctx!);
      }
    });
  }, [doLoop]);

  // Kept for the floating button (desktop only, already unlocked)
  const startMusic = useCallback(() => startMusicSync(), [startMusicSync]);

  // ── Firework storm ──────────────────────────────────────────────────────
  const launchStorm = useCallback((touchX?: number, touchY?: number) => {
    let counter = 0;
    const total = 24; // big Diwali storm

    const spawnRocket = () => {
      const id = Date.now() + counter++;
      // First 3 rockets from the touch point for drama
      const x = counter <= 3 && touchX != null ? touchX : undefined;
      const y = counter <= 3 && touchY != null ? touchY : undefined;
      const rocket = makeRocket(id, x, y);

      setRockets(prev => [...prev, rocket]);
      setTimeout(() => {
        setRockets(prev => prev.map(r => r.id === id ? { ...r, stage: 'burst' } : r));
      }, 600 + Math.random() * 200);
      setTimeout(() => {
        setRockets(prev => prev.filter(r => r.id !== id));
      }, 4000);
    };

    // Rapid-fire launch
    const launch = () => {
      if (counter < total) {
        spawnRocket();
        setTimeout(launch, 150 + Math.random() * 200);
      }
    };
    launch();
  }, []);

  // ── Handle touch / click on the popup ──────────────────────────────────
  // Use a ref to prevent double-fire (touchstart + click both fire on mobile)
  const firedRef = useRef(false);

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (firedRef.current) return;
    firedRef.current = true;

    // Get coordinates as viewport percentages
    let tx: number | undefined;
    let ty: number | undefined;
    if ('changedTouches' in e && e.changedTouches.length > 0) {
      tx = (e.changedTouches[0].clientX / window.innerWidth) * 100;
      ty = (e.changedTouches[0].clientY / window.innerHeight) * 100;
    } else if ('clientX' in e) {
      tx = (e.clientX / window.innerWidth) * 100;
      ty = (e.clientY / window.innerHeight) * 100;
    }

    // 🔑 Start music SYNCHRONOUSLY (critical for iOS Safari AudioContext unlock)
    startMusicSync();
    launchStorm(tx, ty);

    setFading(true);
    setTimeout(() => { setDismissed(true); onDismiss?.(); }, 1800);
  }, [startMusicSync, launchStorm, onDismiss]);

  // Cleanup
  useEffect(() => () => {
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
  }, []);

  if (dismissed) {
    // After popup is gone, still show the floating music button
    return (
      <>
        {/* Floating mini player */}
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3 select-none">
          <div className="relative">
            {isPlaying && (
              <>
                <div className="absolute inset-0 rounded-full bg-purple-400/40 animate-ping pointer-events-none" />
                <div className="absolute -inset-2 rounded-full bg-purple-500/20 animate-pulse pointer-events-none" />
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (loopActiveRef.current) {
                  if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
                  loopActiveRef.current = false; setIsPlaying(false);
                  ctxRef.current?.close(); ctxRef.current = null;
                } else { startMusic(); }
              }}
              className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 shadow-[0_0_30px_rgba(168,85,247,0.6)] border-2 border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/></svg>
              )}
            </button>
          </div>
          {isPlaying && (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
              <div className="flex items-end gap-[2px] h-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-[3px] bg-purple-400 rounded-full"
                    style={{ height:`${6+i*3}px`, animation:`eq-bar ${0.4+i*0.15}s ease-in-out infinite alternate` }}
                  />
                ))}
              </div>
              <span className="text-white text-[10px] font-bold tracking-wider">PLAYING</span>
            </div>
          )}
        </div>

        {/* Fireworks portal */}
        <FireworksLayer rockets={rockets} />
        <style>{`@keyframes eq-bar{from{transform:scaleY(.25)}to{transform:scaleY(1)}}`}</style>
      </>
    );
  }

  return (
    <>
      {/* ── Full-screen Touch Me overlay ── */}
      <div
        className={`fixed inset-0 z-[999] flex items-center justify-center cursor-pointer transition-opacity duration-[1800ms] ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ background: 'radial-gradient(ellipse at center, rgba(88,28,220,0.97) 0%, rgba(30,0,60,0.99) 100%)' }}
        onClick={handleInteraction}
        onTouchEnd={handleInteraction}
      >
        {/* Ambient animated rings */}
        {[1,2,3].map(i => (
          <div key={i} className="absolute rounded-full border border-purple-400/20"
            style={{
              width: `${i*200}px`, height: `${i*200}px`,
              animation: `ring-pulse ${1.5 + i*0.5}s ease-in-out infinite alternate`,
            }}
          />
        ))}

        {/* Floating emoji sparkles */}
        {sparkles.map(s => (
          <div key={s.id} className="absolute text-xl pointer-events-none"
            style={{
              left: `${s.x}%`,
              animation: `float-spark ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          >
            {s.emoji}
          </div>
        ))}

        {/* Centre card */}
        <div className="relative flex flex-col items-center gap-6 px-10 py-12 rounded-[2rem] text-center"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)', border: '1.5px solid rgba(255,255,255,0.18)', boxShadow: '0 0 80px rgba(168,85,247,0.4), inset 0 0 40px rgba(168,85,247,0.1)' }}
        >
          {/* Top emoji */}
          <div className="text-6xl animate-bounce">🎂</div>

          {/* Touch Me heading */}
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight"
              style={{ textShadow: '0 0 40px rgba(216,180,254,0.9), 0 0 80px rgba(168,85,247,0.6)' }}
            >
              Touch Me
            </h1>
            <p className="mt-3 text-purple-200 text-base md:text-lg font-semibold tracking-widest uppercase">
              🎵 To start the celebration 🎵
            </p>
          </div>

          {/* Pulsing touch target */}
          <div className="relative mt-2">
            <div className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
            <div className="absolute -inset-3 rounded-full bg-purple-500/15 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed,#4f46e5)', boxShadow: '0 0 40px rgba(168,85,247,0.7)' }}
            >
              👆
            </div>
          </div>

          <p className="text-purple-300 text-sm font-medium mt-1">Tap anywhere to begin</p>
        </div>
      </div>

      {/* Fireworks render above overlay when fading */}
      <FireworksLayer rockets={rockets} />

      <style>{`
        @keyframes ring-pulse {
          from { transform: scale(0.9); opacity: 0.4; }
          to   { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes float-spark {
          from { transform: translateY(0px) rotate(-10deg); opacity: 0.6; }
          to   { transform: translateY(-30px) rotate(10deg); opacity: 1; }
        }
        @keyframes eq-bar { from{transform:scaleY(.25)} to{transform:scaleY(1)} }
      `}</style>
    </>
  );
}

// ── Fireworks layer (shared) ──────────────────────────────────────────────────
function FireworksLayer({ rockets }: { rockets: Rocket[] }) {
  if (!rockets.length) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
      {rockets.map(r => (
        <div key={r.id} className="absolute inset-0">
          {r.stage === 'launch' && (
            <div className="absolute w-2 h-8 rounded-full"
              style={{ left:`${r.x}%`, '--ty':`${r.y}%`, backgroundColor: r.color,
                boxShadow:`0 0 20px 6px ${r.color}, 0 0 10px white`,
                animation:'fw-launch 0.7s ease-out forwards' } as React.CSSProperties & Record<string,string>}
            />
          )}
          {r.stage === 'burst' && (
            <div className="absolute" style={{ left:`${r.x}%`, top:`${r.y}%` }}>
              <div className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-0"
                style={{ backgroundColor: r.color, animation:'fw-flash 0.4s ease-out forwards', boxShadow:`0 0 40px 20px ${r.color}` }}
              />
              {r.sparks.map(sp => (
                <div key={sp.id} className="absolute rounded-full"
                  style={{
                    width:`${sp.size}px`, height:`${sp.size}px`, backgroundColor: sp.color,
                    boxShadow:`0 0 8px ${sp.color}`,
                    '--tx':`${Math.cos(sp.angle)*sp.velocity*16}vw`,
                    '--ty':`${Math.sin(sp.angle)*sp.velocity*16}vh`,
                    '--gy':`${sp.gravity*35}vh`,
                    '--dx':`${sp.drift*4}vw`,
                    animation:`fw-spark ${sp.duration}s cubic-bezier(0,.7,.3,1) forwards`,
                    opacity:0,
                  } as React.CSSProperties & Record<string,string>}
                >
                  <div className="w-full h-full rounded-full bg-white/40 fw-glitter" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <style>{`
        @keyframes fw-launch {
          0%   { top:110%; transform:scale(1); opacity:1; }
          100% { top:var(--ty); transform:scale(0); opacity:0; }
        }
        @keyframes fw-flash {
          0%   { transform:translate(-50%,-50%) scale(0); opacity:1; }
          100% { transform:translate(-50%,-50%) scale(3); opacity:0; }
        }
        @keyframes fw-spark {
          0%   { transform:translate(-50%,-50%) scale(1.5); opacity:1; }
          100% { transform:translate(calc(-50% + var(--tx) + var(--dx)), calc(-50% + var(--ty) + var(--gy))) scale(0); opacity:0; }
        }
        @keyframes fw-glitter { 0%,100%{opacity:1} 50%{opacity:.1} }
        .fw-glitter { animation: fw-glitter 0.12s infinite; }
      `}</style>
    </div>
  );
}
