"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTransition() {
  const pathname = usePathname();

  useEffect(() => {
    // Smooth fade in on page load
    document.body.style.opacity = "0";

    requestAnimationFrame(() => {
      document.body.style.transition = "opacity 0.3s ease-in-out";
      document.body.style.opacity = "1";
    });

    return () => {
      document.body.style.transition = "";
    };
  }, [pathname]);

  return null;
}
