import { apiClient } from "../lib/apiClient";

export async function fetchLandingPageData() {
  const response = await apiClient("/landingPageData", "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function contactUs(payload: Record<string, any>) {
  const response = await apiClient(`/contactUs`, "POST", payload);

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}
