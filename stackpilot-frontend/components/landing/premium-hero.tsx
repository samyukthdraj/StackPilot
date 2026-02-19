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

      // Floating card animation
      gsap.to(".floating-card", {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
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

      <div className="floating-card">
        <div className="premium-label-small" style={{ marginBottom: "20px" }}>
          LIVE STATS
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "48px",
            fontWeight: 900,
          }}
        >
          1,247
        </div>
        <div style={{ fontSize: "14px", opacity: 0.7, marginTop: "10px" }}>
          Developers Hired This Month
        </div>
      </div>
    </section>
  );
}
