import { apiClient } from "../lib/apiClient";

export async function getAllBookMarks(skip: number) {
  const response = await apiClient(
    `bookmarkList?limit=100&skip=${skip}&latestFirst=true`,
    "GET",
  );
 if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function deleteBookMark(videoId: string) {
  const response = await apiClient(`bookmark/${videoId}`, "DELETE");
  console.log(";:::1:::", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function addBookmark(videoId: string) {
  const response = await apiClient(`videoBookmark/${videoId}`, "POST");
  console.log(";:::2:::", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function removeBookmark(videoId: string) {
  const response = await apiClient(`bookmark/${videoId}`, "DELETE");
  console.log(";:::2:::", response);
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}
