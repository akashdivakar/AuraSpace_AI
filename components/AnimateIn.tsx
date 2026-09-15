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
  threshold = 0.05,
}: AnimateInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = () => {
      if (delay > 0) {
        setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 100px 0px', // trigger before element fully enters viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Fallback: if element is already in view or observer never fires, show after delay + 400ms
    const fallback = setTimeout(() => setIsVisible(true), delay + 400);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      clearTimeout(fallback);
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
      className={`${className} transition-opacity duration-300 ${
        isVisible ? animationClass : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
