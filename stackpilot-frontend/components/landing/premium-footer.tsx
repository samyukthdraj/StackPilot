"use client";

export function PremiumFooter() {
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
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">FAQ</a>
        </div>

        <div className="premium-footer-links">
          <div className="premium-label-small premium-mb-40">COMPANY</div>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="premium-footer-bottom">
        © 2024 StackPilot. All rights reserved.
      </div>
    </footer>
  );
}
