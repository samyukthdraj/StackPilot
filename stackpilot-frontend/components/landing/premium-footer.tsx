"use client";

import Link from "next/link";

export function PremiumFooter() {
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
    <footer
      className="premium-section-dark"
      style={{ padding: "80px 60px 40px" }}
    >
      <div className="premium-footer-content">
        <div>
          <div className="premium-logo premium-mb-40">StackPilot</div>
          <p style={{ opacity: 0.7, maxWidth: "300px" }}>
            AI-powered career acceleration for developers
          </p>
        </div>

        <div className="premium-footer-links">
          <div className="premium-label-small premium-mb-40">PRODUCT</div>
          <Link href="/#features" onClick={handleFeaturesClick}>
            Features
          </Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        <div className="premium-footer-links">
          <div className="premium-label-small premium-mb-40">COMPANY</div>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="premium-footer-links">
          <div className="premium-label-small premium-mb-40">LEGAL</div>
          <Link href="/privacy" data-cursor="golden">Privacy Policy</Link>
          <Link href="/terms" data-cursor="golden">Terms &amp; Conditions</Link>
        </div>
      </div>

      <div className="premium-footer-bottom">
        © 2025 StackPilot. All rights reserved.
      </div>
    </footer>
  );
}
