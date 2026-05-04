import { Metadata } from "next";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { PremiumFeatures } from "@/components/landing/premium-features";

export const metadata: Metadata = {
  title: "Features | StackPilot",
  description: "Explore the powerful AI-driven features of StackPilot: ATS scoring, resume parsing, job matching, and career tracking.",
};

export default function FeaturesPage() {
  return (
    <PremiumPageLayout>
      <div className="pt-24 pb-10">
        <PremiumFeatures />
      </div>
    </PremiumPageLayout>
  );
}
