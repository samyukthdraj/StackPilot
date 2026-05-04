import { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing | StackPilot",
  description: "Affordable AI career intelligence for every developer. Compare our free and pro tiers and start optimizing your career today.",
};

export default function PricingPage() {
  return <PricingClient />;
}
