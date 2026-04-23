"use client";

import { useEffect, useRef } from "react";

interface PremiumHeroProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function PremiumHero({ onGetStarted, onWatchDemo }: PremiumHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const initAnimation = () => {
      if (!window.gsap || !headlineRef.current) return;
      
      const ctx = window.gsap.context(() => {
        const gsap = window.gsap;
        const headline = headlineRef.current!;
        const text = headline.textContent || "";
        const words = text.split(" ");

        const fragment = document.createDocumentFragment();
        words.forEach((word) => {
          const span = document.createElement("span");
          span.className = "word";
          span.innerHTML = `<span style="will-change: transform, clip-path">${word}</span>`;
          fragment.appendChild(span);
          fragment.appendChild(document.createTextNode(" "));
        });
        
        headline.innerHTML = "";
        headline.appendChild(fragment);

        const wordSpans = headline.querySelectorAll(".word span");

        gsap.fromTo(
          wordSpans,
          { y: 40, clipPath: "inset(0 0 100% 0)", opacity: 0 },
          {
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.2,
          },
        );
      });
      return ctx;
    };

    let animationContext: { revert: () => void } | null = null;
    
    const init = () => {
      animationContext = initAnimation() as { revert: () => void };
    };

    if (document.readyState === "complete") {
      init();
    } else {
      window.addEventListener("load", init);
    }

    return () => {
      window.removeEventListener("load", init);
      if (animationContext) {
        animationContext.revert();
      }
    };
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
            aria-label="Start your free trial with StackPilot"
          >
            Start Free Trial
          </button>
          <button
            onClick={onWatchDemo}
            className="premium-btn-pill premium-btn-dark magnetic-btn"
            style={{ border: "2px solid var(--color-light)" }}
            aria-label="Watch a demo of StackPilot features"
          >
            Watch Demo
          </button>
        </div>
      </div>

      <div className="interactive-orb" aria-hidden="true">
        <div className="orb-inner">
          <div className="orb-pulse"></div>
        </div>
      </div>
    </section>
  );
}
