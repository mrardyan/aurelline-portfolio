"use client";

import React, { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const blobRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const initCursor = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const blob = blobRef.current;
    const dot = dotRef.current;
    if (!blob || !dot) return;

    const interactiveSelectors = "a, button, [role='button'], input, textarea, select, label";

    const handleMouseMove = (e: MouseEvent) => {
      blob.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`;
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;

      if (!initCursor.current) {
        blob.style.opacity = "1";
        dot.style.opacity = "1";
        initCursor.current = true;
      }
    };

    const handleMouseOut = () => {
      blob.style.opacity = "0";
      dot.style.opacity = "0";
      initCursor.current = false;
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(interactiveSelectors)) {
        blob.classList.add("custom-cursor--link");
      } else {
        blob.classList.remove("custom-cursor--link");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseOut);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseOut);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      <div ref={blobRef} className="custom-cursor hidden lg:block" />
      <div ref={dotRef} className="custom-cursor-dot hidden lg:block" />
    </>
  );
}
