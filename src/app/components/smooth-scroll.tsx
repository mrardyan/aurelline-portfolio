"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle initial hash scroll if any
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 2 });
        }
      }, 500);
    }

    // Attach Lenis to window for global access (navbar/App.tsx)
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
