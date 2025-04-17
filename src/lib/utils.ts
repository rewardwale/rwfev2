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


export const getStoredLocation = (): [number, number] => {
  if (typeof window === "undefined") {
    return [20.5937, 78.9629];
  }

  const lat = localStorage.getItem("loc_lat");
  const lng = localStorage.getItem("loc_lng");

  const parsedLat = lat ? parseFloat(lat) : NaN;
  const parsedLng = lng ? parseFloat(lng) : NaN;

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return [20.5937, 78.9629];
  }

  return [parsedLat, parsedLng];
};

