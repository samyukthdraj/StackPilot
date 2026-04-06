"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { PremiumFeatures } from "@/components/landing/premium-features";

export default function FeaturesPage() {
  return (
    <PremiumPageLayout>
      <div className="pt-24 pb-10">
        <PremiumFeatures />
      </div>
    </PremiumPageLayout>
  );
}
