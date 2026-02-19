"use client";

import { useEffect, useRef } from "react";

const metrics = [
  {
    number: "95%",
    label: "ATS Success Rate",
    description: "Resumes passing automated screening",
  },
  {
    number: "2.5x",
    label: "Faster Hiring",
    description: "Average time to job offer",
  },
  {
    number: "1,247",
    label: "Placements",
    description: "Developers hired this quarter",
  },
  {
    number: "500+",
    label: "Partner Companies",
    description: "From startups to Fortune 500",
  },
];

export function PremiumMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAnimations = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger || !sectionRef.current) return;

      const metricCards = sectionRef.current.querySelectorAll(".metric-card");

      metricCards.forEach((card: unknown, index: number) => {
        gsap.fromTo(
          card as Element,
          {
            y: 60,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Parallax effect on scroll
        gsap.to(card as Element, {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: card as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        setTimeout(initAnimations, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <section ref={sectionRef} className="premium-metrics-section">
      <div className="premium-container">
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-number">{metric.number}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-description">{metric.description}</div>
              <div className="metric-border"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
