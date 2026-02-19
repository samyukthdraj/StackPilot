"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Our AI analyzes your resume against thousands of successful developer profiles and ATS requirements",
  },
  {
    number: "02",
    title: "Get Matched",
    description:
      "Receive personalized job recommendations based on your skills, experience, and career goals",
  },
  {
    number: "03",
    title: "Land Interviews",
    description:
      "Apply with confidence knowing your resume is optimized for both ATS systems and human recruiters",
  },
];

export function PremiumHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const initSteps = () => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      if (!gsap || !ScrollTrigger || !sectionRef.current) return;

      const stepElements = sectionRef.current.querySelectorAll(".premium-step");

      stepElements.forEach((step, index) => {
        gsap.fromTo(
          step,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.2,
          },
        );
      });
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        clearInterval(checkGSAP);
        setTimeout(initSteps, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="premium-how-it-works premium-section-light"
    >
      <div className="premium-container premium-text-center">
        <h2 className="premium-headline-large premium-mb-60">How It Works</h2>

        <div className="premium-steps">
          {steps.map((step, index) => (
            <div key={index} className="premium-step">
              <div className="premium-step-number">{step.number}</div>
              <div className="premium-step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
