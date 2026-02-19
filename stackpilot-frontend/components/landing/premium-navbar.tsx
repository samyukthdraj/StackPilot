"use client";

import { useEffect, useRef } from "react";

interface PremiumNavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function PremiumNavbar({
  onLoginClick,
  onRegisterClick,
}: PremiumNavbarProps) {
  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initNavbar = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger || !navbarRef.current) return;

      ScrollTrigger.create({
        start: "top -100",
        onEnter: () => navbarRef.current?.classList.add("scrolled"),
        onLeaveBack: () => navbarRef.current?.classList.remove("scrolled"),
      });

      // Magnetic effect on buttons
      const magneticBtns = document.querySelectorAll(".magnetic-btn");
      magneticBtns.forEach((btn) => {
        btn.addEventListener("mousemove", (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (btn as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left - rect.width / 2;
          const y = mouseEvent.clientY - rect.top - rect.height / 2;

          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        });
      });
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        setTimeout(initNavbar, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <nav ref={navbarRef} className="premium-navbar">
      <div className="premium-logo">StackPilot</div>
      <div className="premium-nav-links">
        <a href="#features">Features</a>
        <button
          onClick={onRegisterClick}
          className="premium-btn-pill premium-btn-light magnetic-btn"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}
