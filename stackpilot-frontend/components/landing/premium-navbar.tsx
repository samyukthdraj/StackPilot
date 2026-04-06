"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

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

      // Get all sections
      const sections = gsap.utils.toArray("section");

      sections.forEach((section: unknown) => {
        const sectionElement = section as HTMLElement;
        const bgColor = window.getComputedStyle(sectionElement).backgroundColor;
        const isLightSection = isLightBackground(bgColor);

        ScrollTrigger.create({
          trigger: sectionElement,
          start: "top 80px",
          end: "bottom 80px",
          onEnter: () => {
            if (isLightSection) {
              navbarRef.current?.classList.add("scrolled");
            } else {
              navbarRef.current?.classList.remove("scrolled");
            }
          },
          onEnterBack: () => {
            if (isLightSection) {
              navbarRef.current?.classList.add("scrolled");
            } else {
              navbarRef.current?.classList.remove("scrolled");
            }
          },
        });
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

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        setTimeout(initNavbar, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  const handleFeaturesClick = (e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav ref={navbarRef} className="premium-navbar">
      <Link href="/" className="premium-logo flex items-center" style={{ cursor: "pointer", textDecoration: "none" }}>
        StackPilot
      </Link>
      <div className="premium-nav-links">
        <Link href="/#features" onClick={handleFeaturesClick}>
          Features
        </Link>
        <button
          onClick={onRegisterClick}
          className="premium-btn-pill premium-btn-outline magnetic-btn ml-4"
        >
          Get Started
        </button>
        <button
          onClick={onLoginClick}
          className="premium-btn-pill premium-btn-light magnetic-btn"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
