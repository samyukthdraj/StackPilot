"use client";

import { useEffect, useRef } from "react";

interface PremiumHeroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function PremiumHero({ onGetStarted, onWatchDemo }: PremiumHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const initAnimations = () => {
      const gsap = window.gsap;
      if (!gsap || !headlineRef.current) return;

      const headline = headlineRef.current;
      const text = headline.textContent || "";
      const words = text.split(" ");

      headline.innerHTML = words
        .map((word) => `<span class="word"><span>${word}</span></span>`)
        .join(" ");

      const wordSpans = headline.querySelectorAll(".word span");

      gsap.fromTo(
        wordSpans,
        {
          y: 100,
          clipPath: "inset(0 0 100% 0)",
        },
        {
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.3,
        },
      );
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap) {
        clearInterval(checkGSAP);
        setTimeout(initAnimations, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <section className="premium-hero">
      <div className="premium-hero-content">
        <h1
          ref={headlineRef}
          className="premium-headline-large premium-hero-headline"
        >
          Elevate Your Developer Career with AI Intelligence
        </h1>
        <p className="premium-label-small">
          AI-POWERED RESUME OPTIMIZATION • JOB MATCHING • CAREER ACCELERATION
        </p>
        <div className="premium-hero-ctas">
          <button
            onClick={onGetStarted}
            className="premium-btn-pill premium-btn-light magnetic-btn"
          >
            Start Free Trial
          </button>
          <button
            onClick={onWatchDemo}
            className="premium-btn-pill premium-btn-dark magnetic-btn"
            style={{ border: "2px solid var(--color-light)" }}
          >
            Watch Demo
          </button>
        </div>
      </div>

      <div className="interactive-orb">
        <div className="orb-inner">
          <div className="orb-pulse"></div>
        </div>
      </div>
    </section>
  );
}
