"use client";

import { useEffect, useRef } from "react";

export function PremiumMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMarquee = () => {
      const gsap = window.gsap;
      if (!gsap || !marqueeRef.current) return;

      // Clone for seamless loop
      const content = marqueeRef.current.innerHTML;
      marqueeRef.current.innerHTML = content + content;

      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 20,
        repeat: -1,
        ease: "none",
      });
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap) {
        clearInterval(checkGSAP);
        setTimeout(initMarquee, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <div className="premium-marquee">
      <div ref={marqueeRef} className="premium-marquee-content">
        <span className="premium-marquee-item">OPTIMIZE</span>
        <span className="premium-marquee-item">•</span>
        <span className="premium-marquee-item">MATCH</span>
        <span className="premium-marquee-item">•</span>
        <span className="premium-marquee-item">ACCELERATE</span>
        <span className="premium-marquee-item">•</span>
      </div>
    </div>
  );
}
