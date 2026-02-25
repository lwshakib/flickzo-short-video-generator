import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally combine Tailwind CSS class names.
 * It uses `clsx` for conditional logic and `twMerge` to handle CSS specificity
 * and merge conflicting Tailwind classes effectively.
 *
 * @param inputs - A list of class values (strings, objects, or arrays).
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
