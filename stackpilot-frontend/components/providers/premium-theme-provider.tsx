"use client";

import { ReactNode, useEffect } from "react";

interface PremiumThemeProviderProps {
  children: ReactNode;
}

export function PremiumThemeProvider({ children }: PremiumThemeProviderProps) {
  useEffect(() => {
    // Apply premium theme globally
    document.documentElement.style.setProperty("--color-dark", "#0D0D0D");
    document.documentElement.style.setProperty("--color-light", "#F5F0E8");
    document.documentElement.style.setProperty("--color-accent", "#F5C842");

    // Add premium class to body
    document.body.classList.add("premium-theme");
  }, []);

  return <>{children}</>;
}
