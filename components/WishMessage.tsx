'use client';

import { useEffect, useState } from 'react';

export default function WishMessage() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  const wishes = [
    "Your smile brightens my darkest days",
    "With you, every moment is magical",
    "You are my greatest blessing",
    "Forever grateful for your love",
    "You make life beautiful",
    "My heart beats for you",
  ];

  return (
    <section className="relative py-24 px-4 md:px-8 max-w-5xl mx-auto overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className={`transition-all duration-1000 transform ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <div className="relative bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-20 shadow-[0_32px_64px_-16px_rgba(107,33,168,0.15)] border border-white/60 overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/50 to-transparent rounded-bl-full"></div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-100 mb-8 animate-bounce">
              <span className="text-5xl">💜</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-indigo-900 mb-12">
              A Message for You
            </h2>

            <div className="max-w-3xl mx-auto space-y-8 text-left">
              <div className="bg-white/60 rounded-3xl p-8 md:p-10 shadow-sm border border-white/80">
                <p className="text-2xl text-purple-900 font-bold mb-6 italic border-l-4 border-purple-500 pl-4">
                  Dearest Barnali,
                </p>

                <div className="space-y-6 text-lg text-purple-800/90 leading-relaxed font-medium">
                  <p>
                    Today is not just another day—it's the day the world became a better place because you arrived. On May 16th, you brought light, laughter, and love into existence, and for the past 26 years, you've been making the world brighter.
                  </p>
                  <p>
                    Every moment with you is a gift. Your kindness, your strength, your infectious laughter, and the way you see beauty in everything—these are the things that make you absolutely incredible. You inspire me to be better every single day.
                  </p>
                  <p className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 italic font-semibold text-purple-900">
                    "You are my greatest adventure, my deepest joy, and my forever home."
                  </p>
                  <p>
                    This collection of photos represents not just moments in time, but pieces of my heart. Moments with you alone, our memories through the years, the adventures we've shared together, and the journey we've walked side by side.
                  </p>
                </div>
              </div>

              <div className="text-center py-10">
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mb-8"></div>
                <h3 className="text-3xl md:text-4xl font-black text-purple-900 mb-4 animate-pulse">
                  Happy Birthday to the love of my life. 🎊💜
                </h3>
                <div className="mt-8">
                  <p className="text-xl text-purple-700 font-semibold mb-2">Forever yours,</p>
                  <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 tracking-tight">
                    Sourav
                  </p>
                </div>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto mt-8"></div>
              </div>
            </div>

            {/* Wishes Section */}
            <div className="mt-16">
              <div className="inline-block px-8 py-2 bg-purple-900 text-white rounded-full text-sm font-bold uppercase tracking-[0.2em] mb-10 shadow-lg shadow-purple-900/20">
                Wishes for you
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishes.map((wish, idx) => (
                  <div
                    key={idx}
                    className="group bg-white/80 hover:bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(107,33,168,0.1)] transition-all duration-500 transform hover:-translate-y-2 border border-white flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-purple-600">✨</span>
                    </div>
                    <p className="text-purple-900 font-bold text-lg text-left">
                      {wish}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-purple-100 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold">
                <span>Made with</span>
                <span className="animate-heart-beat">💜</span>
                <span>on your special day</span>
              </div>
              <p className="text-xs text-purple-400 font-medium tracking-widest uppercase">
                May 16, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>
    </section>
  );
}
