import { useEffect, useRef, useState } from "react";

export function useOnceInView<T extends HTMLElement = HTMLElement>(
  amount = 0.1,
  label = "unknown"
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    console.log(`[useOnceInView][${label}] observer attached`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log(
          `[useOnceInView][${label}] IO callback — isIntersecting: ${entry.isIntersecting}, ratio: ${entry.intersectionRatio.toFixed(3)}`
        );
        if (entry.isIntersecting) {
          observer.disconnect();
          console.log(`[useOnceInView][${label}] disconnected + setInView(true)`);
          setInView(true);
        }
      },
      { threshold: amount }
    );

    observer.observe(el);
    return () => {
      console.log(`[useOnceInView][${label}] cleanup — observer disconnected`);
      observer.disconnect();
    };
  }, [amount, label]);

  useEffect(() => {
    console.log(`[useOnceInView][${label}] inView state changed →`, inView);
  }, [inView, label]);

  return [ref, inView] as const;
}
