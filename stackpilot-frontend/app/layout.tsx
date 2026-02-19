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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = Calistoga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cal-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "StackPilot - Career Intelligence for Developers",
  description:
    "Optimize your resume, find perfect job matches, and accelerate your developer career.",
  openGraph: {
    title: "StackPilot",
    description: "Career Intelligence for Modern Developers",
    images: ["/images/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StackPilot",
    description: "Career Intelligence for Modern Developers",
    images: ["/images/og-image.png"],
  },
};

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
        <PremiumThemeProvider>
          <ThemeProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </PremiumThemeProvider>
      </body>
    </html>
  );
}
