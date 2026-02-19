"use client";

import { useEffect, ReactNode } from "react";
import { PremiumCursor } from "./landing/premium-cursor";

interface GlobalPremiumWrapperProps {
  children: ReactNode;
}

export function GlobalPremiumWrapper({ children }: GlobalPremiumWrapperProps) {
  useEffect(() => {
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

        ScrollTrigger.config({
          syncInterval: 0,
          autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        });

        gsap.utils
          .toArray("section, .card, .animate-in")
          .forEach((element: unknown) => {
            gsap.fromTo(
              element as Element,
              {
                y: 30,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element as Element,
                  start: "top 85%",
                  end: "top 20%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          });

        document
          .querySelectorAll("button, a, input, .interactive")
          .forEach((el) => {
            (el as HTMLElement).style.willChange = "transform";
          });
      } catch (error) {
        console.error("Error loading GSAP:", error);
      }
    };

    initAnimations();

    document.body.classList.add("premium-theme");
    document.body.style.cursor = "none";

    return () => {
      document.body.classList.remove("premium-theme");
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      <PremiumCursor />
      <div className="premium-global-wrapper">{children}</div>
    </>
  );
}
