'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimateInProps {
  children: React.ReactNode;
  from?: 'left' | 'right' | 'top' | 'bottom' | 'scale';
  delay?: number; // in ms
  className?: string;
  threshold?: number;
}

export default function AnimateIn({
  children,
  from = 'bottom',
  delay = 0,
  className = '',
  threshold = 0.1,
}: AnimateInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    let timeoutId: any;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutId = setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay, threshold]);

  const animationClass = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    top: 'animate-slide-in-top',
    bottom: 'animate-slide-in-bottom',
    scale: 'animate-scale-in',
  }[from];

  return (
    <div
      ref={ref}
      className={`${className} ${
        isVisible ? animationClass : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
}
