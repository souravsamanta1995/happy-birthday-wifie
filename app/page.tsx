'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import BirthdayHero from '@/components/BirthdayHero';
import PhotoGallery from '@/components/PhotoGallery';
import CelebrationBackground from '@/components/CelebrationBackground';
import WishMessage from '@/components/WishMessage';

import CongratulationsEffect from '@/components/CongratulationsEffect';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2070"
          alt="Mountain and Sea Background"
          fill
          className="object-cover"
          priority
        />
        {/* Thematic Overlays - Reduced opacity for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-violet-900/10 to-indigo-900/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <CongratulationsEffect />
        <CelebrationBackground />
        <BirthdayHero />
        <PhotoGallery />
        <WishMessage />
      </div>
    </main>
  );
}
