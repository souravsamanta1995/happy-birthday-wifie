'use client';

export default function CelebrationBackground() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    emoji: ['🎉', '🎊', '💕', '🌹', '✨', '💐', '🎈', '💖'][Math.floor(Math.random() * 8)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl md:text-3xl animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            animation: `fall ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.6,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(calc(100vh + 20px)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
