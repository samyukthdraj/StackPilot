"use client";
import { useState } from "react";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setIsLoading(true);
    setStatus("idle");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto relative z-10 text-white">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#f5f0e8]">
            Get in Touch
          </h1>
          <p className="text-gray-400">
            Have questions? Experiencing issues? Drop us a message.
          </p>
        </div>
        <div className="bg-[#111111] border border-white/10 p-8 rounded-2xl w-full">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === "success" && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Message sent successfully! We&apos;ll be in touch soon.
              </div>
            )}

            {status === "error" && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Failed to send message. Please try again later.
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <Input
                  name="name"
                  required
                  placeholder="Your Name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#f5c842]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Email
                </label>
                <Input
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#f5c842]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Subject
              </label>
              <select
                name="subject"
                className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 outline-none focus:ring-1 focus:ring-[#f5c842]"
              >
                <option value="Technical Support">Technical Support</option>
                <option value="Billing / Pro Tier">Billing / Pro Tier</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                name="message"
                className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-600 min-h-[150px] outline-none focus:ring-1 focus:ring-[#f5c842]"
                placeholder="How can we help?"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f5c842] hover:bg-[#e0b73c] text-[#111] font-semibold py-6 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </PremiumPageLayout>
  );
}
