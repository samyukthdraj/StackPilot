import type { Metadata } from "next";
import { Inter, Calistoga, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./premium.css";
import "./premium-theme.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { PremiumThemeProvider } from "@/components/providers/premium-theme-provider";
import { PageTransition } from "@/components/shared/page-transition";
import { Toaster } from "@/components/ui/toaster";
import { GlobalPremiumWrapper } from "@/components/global-premium-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const calSans = Calistoga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cal-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stackpilot-jext.onrender.com"),
  title: {
    default: "StackPilot - AI Career Intelligence for Developers",
    template: "%s | StackPilot"
  },
  description: "Optimize your resume with AI, find perfect job matches, and accelerate your developer career with StackPilot's intelligent career platform.",
  keywords: ["StackPilot", "stack pilot", "stack-pilot", "developer career", "AI resume optimization", "job matching", "ATS scanner", "career intelligence", "tech jobs", "software engineer career"],
  authors: [{ name: "Samyukth Dharmarajan" }],
  creator: "Samyukth Dharmarajan",
  publisher: "StackPilot",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.svg",
    shortcut: "/images/favicon.svg",
    apple: "/images/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stackpilot-jext.onrender.com",
    title: "StackPilot - AI Career Intelligence for Developers",
    description: "AI-powered career optimization for modern software engineers. Beat the ATS and find your dream job.",
    siteName: "StackPilot",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "StackPilot - AI Career Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackPilot - Career Intelligence for Modern Developers",
    description: "AI-powered resume optimization and job matching for developers.",
    images: ["/images/og-image.png"],
    creator: "@samyukthdraj",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5c842",
};

import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${calSans.variable} ${jetbrainsMono.variable} font-sans premium-theme`}
      >
        <PageTransition />
        <GlobalPremiumWrapper>
          <TooltipProvider>
            <PremiumThemeProvider>
              <ThemeProvider>
                <QueryProvider>
                  {children}
                  <Toaster />
                </QueryProvider>
              </ThemeProvider>
            </PremiumThemeProvider>
          </TooltipProvider>
        </GlobalPremiumWrapper>
      </body>
    </html>
  );
}
