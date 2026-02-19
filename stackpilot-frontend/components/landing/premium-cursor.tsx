"use client";

import { useEffect, useRef, useState } from "react";

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;

      // Detect background color for contrast
      const element = document.elementFromPoint(x, y);
      if (element) {
        const bgColor = window.getComputedStyle(element).backgroundColor;
        const isLightBg = isLightBackground(bgColor);

        if (isLightBg) {
          cursor.classList.add("dark-mode");
          ring.classList.add("dark-mode");
        } else {
          cursor.classList.remove("dark-mode");
          ring.classList.remove("dark-mode");
        }
      }
    };

    const isLightBackground = (color: string): boolean => {
      const rgb = color.match(/\d+/g);
      if (!rgb || rgb.length < 3) return false;
      const brightness =
        (parseInt(rgb[0]) * 299 +
          parseInt(rgb[1]) * 587 +
          parseInt(rgb[2]) * 114) /
        1000;
      return brightness > 128;
    };

    const handleMouseDown = () => {
      cursor.classList.add("click");
      ring.classList.add("click");
      setTimeout(() => {
        cursor.classList.remove("click");
        ring.classList.remove("click");
      }, 300);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      cursor.classList.add("hover");
      ring.classList.add("hover");
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      cursor.classList.remove("hover");
      ring.classList.remove("hover");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);

    const updateHoverElements = () => {
      const hoverElements = document.querySelectorAll(
        "a, button, .tab-item, .tilt-card, input, textarea, select, [role='button'], .metric-card, .interactive-orb",
      );
      hoverElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    updateHoverElements();
    const observer = new MutationObserver(updateHoverElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="premium-cursor">
        {isHovering && (
          <svg
            className="cursor-pointer-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8.5 2.5L8.5 15.5L11.5 12.5L14.5 19.5L17.5 18.5L14.5 11.5L18.5 11.5L8.5 2.5Z" />
          </svg>
        )}
      </div>
      <div ref={ringRef} className="premium-cursor-ring" />
    </>
  );
}
