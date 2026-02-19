"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: 95, label: "ATS PASS RATE" },
  { value: 1247, label: "DEVELOPERS HIRED" },
  { value: 24, label: "HOUR RESPONSE TIME" },
];

export function PremiumStats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initCounters = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger || !sectionRef.current) return;

      const counters = sectionRef.current.querySelectorAll("[data-count]");

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-count") || "0");

        ScrollTrigger.create({
          trigger: counter,
          start: "top 80%",
          onEnter: () => {
            gsap.to(
              { val: 0 },
              {
                val: target,
                duration: 2.5,
                ease: "power2.out",
                onUpdate: function () {
                  counter.textContent = Math.round(
                    this.targets()[0].val,
                  ).toString();
                },
              },
            );
          },
        });
      });
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        setTimeout(initCounters, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="premium-stats-section premium-section-dark"
    >
      <div className="premium-container">
        <div className="premium-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="premium-stat">
              <div className="premium-stat-number" data-count={stat.value}>
                0
              </div>
              <div className="premium-label-small">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
