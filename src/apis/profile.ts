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


export const followUser = async (id: string) => {
console.log(":::::::::::::::::::",id)
    const response = await apiClient(`user/follow/${id}`,"PUT");

    if (response.success && response.data) {
      return response.data;
    } else {
      console.error("Failed to fetch landing page data:", response.error);
      return null;
    }
};
