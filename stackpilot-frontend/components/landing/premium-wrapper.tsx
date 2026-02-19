"use client";

import { useEffect, ReactNode } from "react";

interface PremiumWrapperProps {
  children: ReactNode;
}

export function PremiumWrapper({ children }: PremiumWrapperProps) {
  useEffect(() => {
    // Load GSAP scripts
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initAnimations = async () => {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
        );
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
        );

        await new Promise((resolve) => setTimeout(resolve, 100));

        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        if (!gsap || !ScrollTrigger) return;

        gsap.registerPlugin(ScrollTrigger);

        // Use native scroll - instant response, no lag
        ScrollTrigger.config({
          syncInterval: 0,
          autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        });

        // Section animations
        gsap.utils.toArray("section").forEach((section) => {
          gsap.fromTo(
            section as Element,
            {
              scale: 0.95,
              opacity: 0,
            },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section as Element,
                start: "top 80%",
                end: "top 20%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        // Add will-change for performance
        document
          .querySelectorAll(".magnetic-btn, .tilt-card, .word span")
          .forEach((el) => {
            (el as HTMLElement).style.willChange = "transform";
          });
      } catch (error) {
        console.error("Error loading GSAP:", error);
      }
    };

    initAnimations();
  }, []);

  return <div className="premium-page">{children}</div>;
}
