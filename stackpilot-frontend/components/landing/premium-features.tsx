"use client";

import { useEffect, useState } from "react";

const features = [
  {
    title: "Optimize",
    description:
      "AI-powered resume analysis that gets you past ATS systems and into interviews",
    image: "/images/feature-optimize.jpg",
  },
  {
    title: "Match",
    description:
      "Smart job matching that finds opportunities perfectly aligned with your skills",
    image: "/images/feature-match.jpg",
  },
  {
    title: "Accelerate",
    description:
      "Career insights and personalized recommendations to fast-track your growth",
    image: "/images/feature-accelerate.jpg",
  },
];

export function PremiumFeatures() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = features[activeTab].title;
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === currentWord) {
      // Pause for a few seconds before deleting
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && currentText === "") {
      // Done deleting, wait a tiny bit then move to next word
      timer = setTimeout(() => {
        setIsDeleting(false);
        setActiveTab((prev) => (prev + 1) % features.length);
      }, 500);
    } else {
      // Typing or deleting
      const nextDelay = isDeleting ? 40 : 100;
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? currentWord.slice(0, currentText.length - 1)
            : currentWord.slice(0, currentText.length + 1),
        );
      }, nextDelay);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, activeTab]);

  useEffect(() => {
    const initAnimations = () => {
      const gsap = window.gsap;
      if (!gsap) return;

      // 3D tilt on image
      const tiltCard = document.querySelector(".premium-tab-image");
      if (!tiltCard) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(tiltCard, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(tiltCard, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      tiltCard.addEventListener("mousemove", handleMouseMove as EventListener);
      tiltCard.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        tiltCard.removeEventListener(
          "mousemove",
          handleMouseMove as EventListener,
        );
        tiltCard.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    const checkGSAP = setInterval(() => {
      if (window.gsap) {
        clearInterval(checkGSAP);
        setTimeout(initAnimations, 100);
      }
    }, 100);

    return () => clearInterval(checkGSAP);
  }, []);

  const handleTabClick = (index: number) => {
    const gsap = window.gsap;
    if (!gsap) return;

    setActiveTab(index);
    setCurrentText("");
    setIsDeleting(false);

    const tabImage = document.querySelector(".premium-tab-image");
    if (!tabImage) return;

    gsap.to(tabImage, {
      opacity: 0,
      scale: 1.05,
      duration: 0.3,
      onComplete: () => {
        gsap.to(tabImage, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <section
      className="premium-feature-tabs premium-section-light"
      id="features"
    >
      <div className="premium-container">
        <div className="premium-tabs-container">
          <div className="premium-tab-list">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`premium-tab-item tab-item ${activeTab === index ? "active" : ""}`}
                onClick={() => handleTabClick(index)}
              >
                <div className="premium-tab-title">{feature.title}</div>
                <div className="premium-tab-description">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>

          <div className="premium-tab-image tilt-card">
            <div
              style={{
                width: "100%",
                height: "600px",
                background: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
              }}
            >
              {currentText}
              <span
                style={{
                  fontWeight: "300",
                  opacity: 0.7,
                  animation: "premiumBlink 1s step-end infinite",
                  marginLeft: "4px",
                }}
              >
                |
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
