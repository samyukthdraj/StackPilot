import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const buttonVariants = {
  variant: {
    default: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm",
    outline:
      "border-2 border-gray-200 bg-transparent hover:bg-gray-50 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-900",
    link: "text-orange-500 underline-offset-4 hover:underline",
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
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
