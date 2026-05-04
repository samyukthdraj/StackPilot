import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | StackPilot",
  description: "Have questions about StackPilot? Get in touch with our team for support, feedback, or inquiries about our AI career intelligence platform.",
};

export default function ContactPage() {
  return <ContactClient />;
}
