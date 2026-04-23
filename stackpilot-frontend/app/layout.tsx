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
  keywords: ["developer career", "AI resume optimization", "job matching", "ATS scanner", "career intelligence", "tech jobs"],
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
    description: "AI-powered career optimization for modern software engineers.",
    siteName: "StackPilot",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackPilot",
    description: "Career Intelligence for Modern Developers",
    images: ["/images/og-image.png"],
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
