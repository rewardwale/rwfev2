import { apiClient } from "../lib/apiClient";

export async function fetchHomeCategories() {
  const queryParams = new URLSearchParams({ type: "video" }).toString();
  const response = await apiClient(`/categories?${queryParams}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function fetchHomePageData() {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: "0",
    flag: "0",
  }).toString();
  const response = await apiClient(`/homepageData?${queryParams}`, "GET");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function logout() {
  const response = await apiClient(`/logout-all`, "POST");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

