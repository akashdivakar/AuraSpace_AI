'use client';

import { useState, useRef, useEffect } from 'react';

interface CompareSliderProps {
  originalImage: string;
  stagedImage: string;
}

export default function CompareSlider({ originalImage, stagedImage }: CompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  const afterOpacity = Math.max(0, Math.min(1, (sliderPosition - 5) / 15));
  const beforeOpacity = Math.max(0, Math.min(1, (95 - sliderPosition) / 15));

  return (
    <div 
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none bg-slate-100 group"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onPointerDown={handlePointerDown}
    >
      {/* Original Image (Bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={originalImage} alt="Original" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      
      {/* Staged Image (Top layer clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stagedImage} alt="Staged" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Slider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] cursor-ew-resize transition-colors"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-indigo-500 cursor-ew-resize transition-transform duration-200 ${isDragging ? 'scale-125 ring-4 ring-indigo-300/50' : 'hover:scale-110'}`}>
          <div className="flex gap-1">
            <div className="w-0.5 h-3.5 bg-indigo-600 rounded-full"></div>
            <div className="w-0.5 h-3.5 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div 
        className="absolute top-4 left-4 px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold rounded-full pointer-events-none shadow-sm transition-opacity duration-200"
        style={{ opacity: afterOpacity }}
      >
        After
      </div>
      <div 
        className="absolute top-4 right-4 px-3 py-1 bg-slate-900/70 backdrop-blur-md text-white text-xs font-bold rounded-full pointer-events-none shadow-sm transition-opacity duration-200"
        style={{ opacity: beforeOpacity }}
      >
        Before
      </div>
    </div>
  );
}
