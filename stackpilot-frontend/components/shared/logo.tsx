import Link from "next/link";
import Image from "next/image"; // Added Image import
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({
  variant = "default",
  size = "md",
  className,
}: LogoProps) {
  const sizes = {
    sm: 32, // 8 * 4 (h-8 = 2rem = 32px)
    md: 40, // 10 * 4 (h-10 = 2.5rem = 40px)
    lg: 48, // 12 * 4 (h-12 = 3rem = 48px)
  };

  const variants = {
    default: "/images/logo.svg",
    white: "/images/logo-white.svg",
    icon: "/images/icon.svg",
  };

  const height = sizes[size];
  // Calculate width based on aspect ratio (adjust based on your logo's actual aspect ratio)
  // For example, if logo is 120x40 (3:1 ratio), width = height * 3
  // You may need to adjust this based on your actual logo dimensions
  const width = height * 3; // Adjust multiplier based on your logo's aspect ratio

  return (
    <Link href="/" className={cn("block", className)}>
      <Image
        src={variants[variant]}
        alt="StackPilot"
        width={width}
        height={height}
        className="w-auto h-full"
        priority
      />
    </Link>
  );
}
