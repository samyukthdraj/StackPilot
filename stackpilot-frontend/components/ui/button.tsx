import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const buttonVariants = {
  variant: {
    default: "bg-[#f5c842] text-[#0d0d0d] hover:bg-[#f5c842]/90 shadow-[0_0_15px_rgba(245,200,66,0.3)] font-semibold",
    outline:
      "border-2 border-[#2a2a2a] bg-transparent hover:bg-white/10 hover:border-[#f5c842] hover:text-[#f5c842] text-[#f5f0e8]",
    ghost: "hover:bg-white/10 text-[#a0a0a0] hover:text-[#f5c842]",
    link: "text-[#f5c842] underline-offset-4 hover:underline",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  },
  size: {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c842] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
