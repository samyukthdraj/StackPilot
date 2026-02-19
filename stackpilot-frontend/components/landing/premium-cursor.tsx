"use client";

import { useEffect, useRef } from "react";

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Instant positioning - no lerp delay
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform = `translate(${x}px, ${y}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Hover effects
    const handleMouseEnter = () => cursor.classList.add("hover");
    const handleMouseLeave = () => cursor.classList.remove("hover");

    const hoverElements = document.querySelectorAll(
      "a, button, .tab-item, .tilt-card",
    );
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="premium-cursor" />
      <div ref={ringRef} className="premium-cursor-ring" />
    </>
  );
}
