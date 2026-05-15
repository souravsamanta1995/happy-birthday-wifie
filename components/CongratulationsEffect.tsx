'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  color: string;
  size: number;
  angle: number;
  velocity: number;
  duration: number;
  delay: number;
  gravity: number;
  drift: number;
}

interface Cracker {
  id: number;
  x: number;
  targetY: number;
  color: string;
  stage: 'launch' | 'burst';
  particles: Particle[];
}

export default function CongratulationsEffect() {
  const [crackers, setCrackers] = useState<Cracker[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const timer = setTimeout(() => {
      let crackerId = 0;
      const totalCrackers = 12; // Reduced from 18 for performance

      const launchCracker = () => {
        const id = Date.now() + crackerId++;
        const x = 10 + Math.random() * 80;
        const targetY = 10 + Math.random() * 50;
        
        const palettes = [
          ['#9370DB', '#E0B0FF', '#FFFFFF', '#FFD700'],
          ['#8A2BE2', '#BA55D3', '#FFFFFF', '#00FFFF'],
          ['#4B0082', '#9400D3', '#FFFFFF', '#7B68EE'],
        ];
        
        const palette = palettes[Math.floor(Math.random() * palettes.length)];
        const mainColor = palette[0];
        
        const particleCount = 40 + Math.floor(Math.random() * 20); // Reduced from 100 for performance
        const particles = Array.from({ length: particleCount }, (_, i) => ({
          id: i,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: 3 + Math.random() * 4,
          angle: Math.random() * Math.PI * 2,
          velocity: 3 + Math.random() * 6,
          duration: 1.2 + Math.random() * 1.5,
          delay: 0,
          gravity: 0.1 + Math.random() * 0.15,
          drift: (Math.random() - 0.5) * 2
        }));

        const newCracker: Cracker = { id, x, targetY, color: mainColor, stage: 'launch', particles };
        setCrackers(prev => [...prev, newCracker]);

        setTimeout(() => {
          setCrackers(prev => prev.map(c => c.id === id ? { ...c, stage: 'burst' } : c));
        }, 800);
      };

      const interval = setInterval(() => {
        if (crackerId < totalCrackers) {
          launchCracker();
        } else {
          clearInterval(interval);
        }
      }, 600); // Increased interval for less overlap

      const hideTimer = setTimeout(() => {
        setCrackers([]);
      }, 16000);

      return () => {
        clearInterval(interval);
        clearTimeout(hideTimer);
      };
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[250] overflow-hidden">
      {crackers.map((c) => (
        <div key={c.id} className="absolute inset-0">
          {c.stage === 'launch' && (
            <div 
              className="absolute w-1.5 h-6 rounded-full"
              style={{
                left: `${c.x}%`,
                '--ty': `${c.targetY}%`,
                backgroundColor: c.color,
                boxShadow: `0 0 20px 5px ${c.color}, 0 0 10px white`,
                animation: `launch 0.8s ease-out forwards`,
              } as any}
            />
          )}

          {c.stage === 'burst' && (
            <div className="absolute" style={{ left: `${c.x}%`, top: `${c.targetY}%` }}>
              <div className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-2xl opacity-0 animate-burst-flash" 
                   style={{ boxShadow: `0 0 30px 15px ${c.color}` }} />
              
              {c.particles.map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.color,
                    boxShadow: `0 0 10px ${p.color}`,
                    '--tx': `${Math.cos(p.angle) * p.velocity * 15}vw`,
                    '--ty': `${Math.sin(p.angle) * p.velocity * 15}vh`,
                    '--gy': `${p.gravity * 30}vh`,
                    '--dx': `${p.drift * 4}vw`,
                    animation: `burst-particle-aerial ${p.duration}s cubic-bezier(0, 0.7, 0.3, 1) forwards`,
                    opacity: 0
                  } as any}
                >
                  <div className="w-full h-full rounded-full animate-glitter bg-white opacity-40" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <style>{`
        @keyframes launch {
          0% { top: 110%; transform: scale(1); opacity: 1; }
          100% { top: var(--ty); transform: scale(0); opacity: 0; }
        }
        @keyframes burst-flash {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes burst-particle-aerial {
          0% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx) + var(--dx)), calc(-50% + var(--ty) + var(--gy))) scale(0); opacity: 0; }
        }
        @keyframes glitter {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .animate-burst-flash { animation: burst-flash 0.4s ease-out forwards; }
        .animate-glitter { animation: glitter 0.15s infinite; }
      `}</style>
    </div>
  );
}
