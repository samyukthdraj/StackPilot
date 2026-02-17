"use client";

interface LordiconWrapperProps {
  icon: string;
  size?: number;
  color?: string;
  state?: string;
  className?: string;
  stroke?: string;
}

export function LordiconWrapper({
  icon,
  size = 24,
  color = "#FF6B35",
  state = "loop",
  className = "",
  stroke,
}: LordiconWrapperProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      data-icon={icon}
      data-state={state}
      data-color={color}
      {...(stroke && { "data-stroke": stroke })}
    />
  );
}
