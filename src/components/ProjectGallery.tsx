'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => setActive(i => (i === null ? null : (i - 1 + images.length) % images.length)), [images.length]);
  const next = useCallback(() => setActive(i => (i === null ? null : (i + 1) % images.length)), [images.length]);

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-10">
        <h3 className="text-xl font-bold text-acc-navy mb-4">Project Gallery</h3>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative h-48 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-acc-gold"
            >
              <Image
                src={img}
                alt={`${title} — photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-acc-navy/0 group-hover:bg-acc-navy/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}
        >
          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest select-none">
            {active + 1} / {images.length}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
              aria-label="Previous"
            >
              <ChevronLeft size={40} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-5xl mx-16 aspect-[16/10]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${title} — photo ${active + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-2"
              aria-label="Next"
            >
              <ChevronRight size={40} />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i); }}
                  className={`relative w-14 h-10 overflow-hidden transition-opacity ${i === active ? 'opacity-100 ring-2 ring-acc-gold' : 'opacity-40 hover:opacity-70'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
