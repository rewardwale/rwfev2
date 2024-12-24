import { apiClient } from "@/lib/apiClient";

export async function fetchProfileData() {
  const response = await apiClient("/profile", "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function fetchProfilePosts(id: string) {
  const queryParams = new URLSearchParams({
    limit: "10",
    skip: "0",
    flag: "1",
    userId: id
  }).toString();
  const response = await apiClient(`/uploadedVideos?${queryParams}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}
