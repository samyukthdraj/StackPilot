"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface LordiconWrapperProps {
  icon: string;
  size?: number;
  color?: string;
  state?: string;
  className?: string;
  stroke?: string;
}

/**
 * A wrapper for Lordicon animated icons.
 * Loads the Lordicon element via CDN for maximum compatibility.
 */
export function LordiconWrapper({
  icon,
  size = 24,
  color = "currentColor",
  state = "loop",
  className = "",
  stroke,
}: LordiconWrapperProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the script is already there
    const existingScript = document.querySelector('script[src*="lordicon.js"]');
    
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.lordicon.com/lordicon.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Format colors for Lordicon (primary:#hex,secondary:#hex)
  const colorsAttr = `primary:${color === "currentColor" ? "#f5c842" : color},secondary:${color === "currentColor" ? "#f5c842" : color}`;

  return (
    // @ts-expect-error lord-icon is a custom web component not in React types
    <lord-icon
      key={icon} // Force re-render if icon changes
      src={icon}
      trigger={state === "hover" ? "hover" : state === "morph" ? "morph" : "loop"}
      colors={colorsAttr}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        display: "inline-block",
        verticalAlign: "middle"
      }}
      className={cn("current-color", className)}
      {...(stroke ? { stroke } : {})}
    />
  );
}
