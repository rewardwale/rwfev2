import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUserLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false; // Ensure code doesn't run on the server (for SSR)

  const token = localStorage.getItem("token");

  return !!token && token.trim().length > 0;
};
