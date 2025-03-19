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

// export async function  fetchHomePageData() {
//   const queryParams = new URLSearchParams({
//     limit: "10",
//     skip: "0",
//     flag: "0",
//   }).toString();
//   const response = await apiClient(`/homepageData?${queryParams}`, "GET");
//   if (response.success && response.data) {
//     return response.data;
//   } else {
//     console.error("Failed to fetch landing page data:", response.error);
//     return null;
//   }
// }

export async function fetchHomePageData(selectedCategories?: string[]) {
  console.log("inside video feed fetchHomePageData");

  const queryParams = new URLSearchParams({
    limit: "100",
    skip: "0",
    flag: "0",
  });

  // Add selected categories to query params if provided
  if (selectedCategories?.length) {
    queryParams.append('categories', selectedCategories.join(','));
  }

  try {
    const response = await apiClient(`/homepageData?${queryParams.toString()}`, "GET");
    if (response.success && response.data) {
      return response;
    } else {
      console.error("Failed to fetch landing page data:", response.error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching home page data:", error);
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

export const signupWithSocialProvider = async (
  payload: Record<string, any>,
) => {
  try {
    const response = await apiClient(
      "/signupWithSocialProvider",
      "POST",
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};