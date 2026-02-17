import * as React from "react";

export const Progress = React.forwardRef<
  HTMLDivElement,
  { value?: number } & React.HTMLAttributes<HTMLDivElement>
>(({ value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className="h-2 bg-gray-200 rounded-full overflow-hidden"
    {...props}
  >
    <div
      className="h-full bg-orange-500 transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
));
Progress.displayName = "Progress";
