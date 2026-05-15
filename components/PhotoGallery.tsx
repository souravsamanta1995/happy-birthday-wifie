'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface PhotoCategory {
  title: string;
  description: string;
  images: string[];
  emoji: string;
  color: string;
}

const PHOTO_CATEGORIES: PhotoCategory[] = [
  {
    title: 'Just Her Beauty',
    description: 'Moments that capture your radiance',
    images: ['image1.jpg', 'image2.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg', 'image9.jpg', 'image10.jpg', 'image11.jpg', 'image12.jpg', 'image13.jpg', 'image14.jpg', 'image15.jpg', 'image16.jpg'],
    emoji: '✨',
    color: 'purple'
  },
  {
    title: 'Memories Over Time',
    description: 'Where it all began - cherished memories',
    images: ['old_her1.jpg', 'old_her2.jpeg', 'old_her3.jpeg'],
    emoji: '📷',
    color: 'amber'
  },
  {
    title: 'Us Together',
    description: 'Our favorite moments shared',
    images: ['together1.jpg', 'together2.jpg', 'together3.jpg', 'together4.jpg', 'together5.jpg'],
    emoji: '💜',
    color: 'violet'
  },
  {
    title: 'Our Journey',
    description: 'Through the years, always us',
    images: ['old_together1.jpg', 'old_together2.jpg', 'old_together3.jpg'],
    emoji: '💑',
    color: 'indigo'
  }
];

// Flatten all images for sequential navigation
const ALL_PHOTOS = PHOTO_CATEGORIES.flatMap(cat => cat.images.map(img => ({ src: img, color: cat.color, category: cat.title })));

function MarqueeRow({ 
  category, 
  onImageClick,
  reverse = false
}: { 
  category: PhotoCategory; 
  onImageClick: (src: string) => void;
  reverse?: boolean;
}) {
  // To ensure seamless marquee, we repeat the images exactly twice
  const displayImages = [...category.images, ...category.images];

  return (
    <div className="mb-12">
      {/* Category Header with better visibility */}
      <div className={`flex items-center gap-6 mb-8 px-6 md:px-16 animate-fade-in ${reverse ? 'flex-row-reverse text-right' : ''}`}>
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
          <span className="text-4xl md:text-6xl drop-shadow-lg">{category.emoji}</span>
        </div>
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-3xl border border-white/10 shadow-lg">
          <h3 className={`text-2xl md:text-4xl font-black text-white drop-shadow-[0_2px_10px_rgba(168,85,247,0.5)]`}>
            {category.title}
          </h3>
          <p className="text-purple-200 text-sm md:text-base font-bold mt-1 tracking-wide">
            {category.description}
          </p>
        </div>
      </div>

      {/* Marquee Container - Using global CSS classes */}
      <div className="relative overflow-hidden py-4 pause-on-hover">
        <div 
          className="animate-marquee flex gap-4 md:gap-8"
          style={{ 
            '--duration': `${category.images.length * 5}s`,
            animationDirection: reverse ? 'reverse' : 'normal'
          } as any}
        >
          {displayImages.map((image, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[200px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-[1.05] group/item"
              onClick={() => onImageClick(image)}
            >
              <div className="relative w-full h-full">
                <Image
                  src={`/images/${image}`}
                  alt="Gallery image"
                  fill
                  className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                  sizes="(max-width: 640px) 200px, 300px"
                  priority={idx < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-[10px] font-bold uppercase tracking-wider">View 💜</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const showNext = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev !== null ? (prev + 1) % ALL_PHOTOS.length : null));
  }, []);

  const showPrev = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    setSelectedIndex(prev => (prev !== null ? (prev - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : null));
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  }, [showNext, showPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentPhoto = selectedIndex !== null ? ALL_PHOTOS[selectedIndex] : null;

  return (
    <section className="relative py-24 max-w-full overflow-hidden bg-purple-50/20">
      <div className="text-center mb-16 px-4 md:px-8">
        <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl mb-4 tracking-tight">
          Our Beautiful Moments
        </h2>
        <p className="text-lg text-purple-100 max-w-2xl mx-auto font-medium drop-shadow-md">
          Celebrating 26 years of your radiant life 💜
        </p>
      </div>

      <div className="space-y-4">
        {PHOTO_CATEGORIES.map((category, idx) => (
          <MarqueeRow 
            key={idx} 
            category={category} 
            onImageClick={(src) => {
              const index = ALL_PHOTOS.findIndex(p => p.src === src);
              setSelectedIndex(index);
            }} 
            reverse={idx % 2 !== 0}
          />
        ))}
      </div>

      {/* Full screen viewer remains the same */}
      {selectedIndex !== null && currentPhoto && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[500] p-4 md:p-8 transition-all duration-500"
          onClick={() => setSelectedIndex(null)}
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={`/images/${currentPhoto.src}`}
              alt="Background blur"
              fill
              className="object-cover blur-[80px] scale-110 opacity-60"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div
            className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center z-10 animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={showPrev}
              className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all z-20 group"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={showNext}
              className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all z-20 group"
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-0 md:top-4 right-0 md:-right-16 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-md border border-white/20 z-[510] transition-all hover:scale-110"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-black/20">
              <Image
                src={`/images/${currentPhoto.src}`}
                alt="Selected photo"
                fill
                className="object-contain"
                priority
                quality={100}
              />
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold tracking-widest uppercase">
                {currentPhoto.category}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-10 px-4 overflow-x-auto max-w-full">
            {ALL_PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${selectedIndex === i ? 'w-8 bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
