import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractErrorMessage(errorData: any, fallback: string): string {
  if (!errorData) return fallback;
  
  // Extract from S-Tier envelope if present
  const data = errorData.data || errorData;
  const message = data.message || errorData.message;
  
  if (Array.isArray(message)) {
    return message[0] || fallback;
  }
  
  if (typeof message === "string") {
    return message;
  }
  
  return fallback;
}
