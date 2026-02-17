import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-orange-500 text-white",
    secondary: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
    destructive: "bg-red-500 text-white",
    outline:
      "border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
