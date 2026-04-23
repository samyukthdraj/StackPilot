"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePathname } from "next/navigation";

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    // Detect touch/mobile device — hide cursor entirely
    const checkTouch = () => {
      const touchCapable = 
        window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        window.innerWidth < 1024 ||
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0);
      
      setIsTouchDevice(touchCapable);
    };

    // Immediate detection on touch interaction
    const handleTouchStart = () => {
      setIsTouchDevice(true);
      window.removeEventListener("touchstart", handleTouchStart);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    
    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      ring.style.left = `${x}px`;
      ring.style.top = `${y}px`;

      // Smart background detection only for logged out state (Landing Page)
      // For logged in users, we keep it consistently white except on hover.
      if (isAuthenticated) {
        cursor.classList.remove("dark-mode");
        ring.classList.remove("dark-mode");
        return;
      }

      const element = document.elementFromPoint(x, y);
      if (element) {
        let isLightBg = false;
        let isModalContent = false;

        // Modals or specific containers...
        if (
          element.closest(".modal-overlay") ||
          element.closest(".modal-card")
        ) {
          isModalContent = true;
          isLightBg = false;
        } else if (
          element.closest(".premium-section-light") ||
          element.closest(".bg-white") ||
          element.closest(".bg-gray-50")
        ) {
          isLightBg = true;
        } else if (
          element.closest(".premium-section-dark") ||
          element.closest(".premium-hero") ||
          element.closest(".premium-metrics-section")
        ) {
          isLightBg = false;
        } else {
          // Fallback check: look at computed color
          let currentEl: Element | null = element;
          let bgColor = "rgba(0, 0, 0, 0)";

          while (currentEl) {
            bgColor = window.getComputedStyle(currentEl).backgroundColor;
            if (
              bgColor !== "rgba(0, 0, 0, 0)" &&
              bgColor !== "transparent" &&
              bgColor !== ""
            ) {
              break;
            }
            currentEl = currentEl.parentElement;
          }

          if (
            bgColor &&
            bgColor !== "rgba(0, 0, 0, 0)" &&
            bgColor !== "transparent"
          ) {
            isLightBg = isLightBackground(bgColor);
          }
        }

        // Apply dark mode only for light backgrounds
        if (isLightBg && !isModalContent) {
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
      // Force exit hover state on click to prevent stuck cursor on navigation/modal open
      setIsHovering(false);
      cursor.classList.remove("hover", "golden");
      ring.classList.remove("hover", "golden");
      
      cursor.classList.add("click");
      ring.classList.add("click");
      setTimeout(() => {
        cursor.classList.remove("click");
        ring.classList.remove("click");
      }, 300);
    };

    // Reset cursor state on pathname change
    const handlePathChange = () => {
      setIsHovering(false);
      cursor.classList.remove("hover", "golden");
      ring.classList.remove("hover", "golden");
    };
    handlePathChange();

    const handleMouseEnter = (e: Event) => {
      setIsHovering(true);
      cursor.classList.add("hover");
      ring.classList.add("hover");
      const target = e.currentTarget as HTMLElement;
      if (target?.closest('[data-cursor="golden"]') || target?.getAttribute('data-cursor') === 'golden') {
        cursor.classList.add("golden");
        ring.classList.add("golden");
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      cursor.classList.remove("hover");
      ring.classList.remove("hover");
      cursor.classList.remove("golden");
      ring.classList.remove("golden");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);

    const updateHoverElements = () => {
      const hoverElements = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .interactive-orb",
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
  }, [isAuthenticated, pathname, isTouchDevice]);

  // Don't render cursor on touch/mobile devices
  if (isTouchDevice) return null;

  return (
    <>
      <div ref={cursorRef} className="premium-cursor">
        {isHovering && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#f5c842"
            style={{
              filter: "drop-shadow(0 0 5px rgba(245,200,66,0.85))",
              pointerEvents: "none",
              transform: "translate(-2px, -2px)"
            }}
          >
            {/* Premium Mouse Pointer Cursor */}
            <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.83-4.83 2.3 5.42c.1.23.36.33.59.23l2.42-1.03c.23-.1.33-.36.23-.59l-2.35-5.54 6.33.61c.32.03.52-.34.33-.6l-15.15-15.6c-.23-.24-.6-.08-.6.23z" />
          </svg>
        )}
      </div>
      <div ref={ringRef} className="premium-cursor-ring" />
    </>
  );
}
