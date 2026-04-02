import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-3 py-2 text-sm text-[#f5f0e8] ring-offset-[#0d0d0d] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#666] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c842] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
