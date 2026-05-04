import { Metadata } from "next";
import { PremiumLandingContainer } from "@/components/landing/premium-landing-container";

export const metadata: Metadata = {
  title: "StackPilot | AI Career Intelligence for Developers",
  description: "Stop getting rejected by ATS. Use StackPilot's AI to optimize your resume, identify skill gaps, and match with the best developer jobs in the market.",
  keywords: ["StackPilot", "AI career coach", "ATS resume scanner", "developer job matching", "tech career growth"],
};

export default function LandingPage() {
  return <PremiumLandingContainer />;
}
