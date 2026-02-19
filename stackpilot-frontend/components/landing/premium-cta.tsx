"use client";

interface PremiumCTAProps {
  onGetStarted: () => void;
}

export function PremiumCTA({ onGetStarted }: PremiumCTAProps) {
  return (
    <section className="premium-hero premium-section-dark">
      <div className="premium-container premium-text-center">
        <h2 className="premium-headline-large premium-mb-60">
          Ready to Accelerate Your Career?
        </h2>
        <button
          onClick={onGetStarted}
          className="premium-btn-pill premium-btn-light magnetic-btn"
        >
          Start Free Trial
        </button>
        <p
          className="premium-label-small"
          style={{ marginTop: "30px", opacity: 0.6 }}
        >
          NO CREDIT CARD REQUIRED • 14-DAY FREE TRIAL
        </p>
      </div>
    </section>
  );
}
