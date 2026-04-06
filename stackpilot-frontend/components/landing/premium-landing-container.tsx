"use client";

import { useRouter } from "next/navigation";
import { PremiumHero } from "./premium-hero";
import { PremiumMarquee } from "./premium-marquee";
import { PremiumFeatures } from "./premium-features";
import { PremiumStats } from "./premium-stats";
import { PremiumHowItWorks } from "./premium-how-it-works";
import { PremiumCTA } from "./premium-cta";
import { PremiumPageLayout } from "./premium-page-layout";

export function PremiumLandingContainer() {
  const router = useRouter();

  // For the specific buttons on the hero/CTA to open modals, 
  // we can use a workaround: dispatching a custom event, or since they just redirect to dashboard if logged in,
  // we can just stick to router.push or modifying standard behavior.
  // Actually, to trigger from child components easily without prop drilling, we can use an event listener, 
  // but let's just export a clean version of the landing container that wraps in PremiumPageLayout and has simple handlers.
  
  const handleGetStarted = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) router.push("/dashboard");
    else {
      // In a real robust app we might use context for the auth modal. For now, we direct to top or just use an Event.
      // We can add dispatchEvent(new CustomEvent('open-register')) in the layout.
      window.dispatchEvent(new CustomEvent('open-register'));
    }
  };

  const handleLogin = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) router.push("/dashboard");
    else {
      window.dispatchEvent(new CustomEvent('open-login'));
    }
  };

  return (
    <PremiumPageLayout>
      <PremiumHero
        onGetStarted={handleGetStarted}
        onWatchDemo={handleLogin}
      />
      <PremiumMarquee />
      <PremiumFeatures />
      <PremiumStats />
      <PremiumHowItWorks />
      <PremiumCTA
        onGetStarted={handleGetStarted}
      />
    </PremiumPageLayout>
  );
}
