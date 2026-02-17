import * as React from "react";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={`shrink-0 bg-gray-200 dark:bg-gray-700 ${
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
      } ${className}`}
      {...props}
    />
  );
}
