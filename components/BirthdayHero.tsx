'use client';

import { useEffect, useState } from 'react';

export default function BirthdayHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
      {/* Background Blobs - Made more subtle */}
      <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 md:w-96 h-64 md:h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Glassmorphism Card for better text visibility */}
        <div className="bg-white/10 backdrop-blur-lg rounded-[3rem] p-8 md:p-16 border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-fade-in">
          <div className="mb-8 animate-bounce-slow">
            <span className="text-7xl md:text-8xl drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">💜</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter">
            <span className="block text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">Happy Birthday</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-indigo-300 drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)] animate-pulse">
              Barnali
            </span>
          </h1>

          <div className="flex flex-col items-center gap-6">
            <p className="text-xl md:text-3xl text-purple-100 font-bold tracking-wide drop-shadow-md">
              From your loving <span className="text-white border-b-2 border-purple-400">Sourav</span>
            </p>

            <div className="flex gap-8 md:gap-12 py-8 px-10 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-black mb-1">Born</p>
                <p className="text-xl md:text-2xl font-black text-white">May 16, 2000</p>
              </div>
              <div className="w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300 font-black mb-1">Age</p>
                <p className="text-xl md:text-2xl font-black text-white">26 Years</p>
              </div>
            </div>

            <p className="text-lg md:text-2xl text-white/90 font-medium italic max-w-2xl leading-relaxed drop-shadow-sm">
              "Every moment with you is a celebration, and today is even more special because it's YOUR day."
            </p>
          </div>

          <div className="mt-12 animate-bounce-slow">
            <div className="inline-block p-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
