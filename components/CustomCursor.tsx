'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        setIsPointer(!!target.closest('button, a, select, input, textarea, [role="button"], .cursor-pointer'));
      }
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Soft Ambient Cursor Aura Glow */}
      <div
        className={`fixed top-0 left-0 rounded-full blur-xl transition-all duration-300 ease-out ${
          isPointer
            ? 'w-24 h-24 -mt-12 -ml-12 bg-violet-500/25 dark:bg-violet-400/30 scale-125'
            : 'w-16 h-16 -mt-8 -ml-8 bg-indigo-500/15 dark:bg-indigo-400/20'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}
