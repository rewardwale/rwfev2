import { apiClient } from "@/lib/apiClient";

export const searchBusinessUsers = async (
  word: string | null,
  count: number,
  limit: number
) => {
  try {
    const res = await apiClient(
      `search?limit=${limit}&skip=${count}&keyword=${word}&type=businessPage`
   ,"GET" );

    if (res.success) {
      return res.data.data.data;
    } else {
      return [];
    }
    //
  } catch (error) {
    console.log("Error:::", error);
  }
};

export const searchNonBusinessUsers = async (
  word: string | null,
  count: number,
  limit: number
) => {
  try {
    const res = await apiClient(
      `search?limit=${limit}&skip=${count}&keyword=${word}&type=user`,"GET"
    );

    if (res.success) {
      return res.data.data.data;
    } else {
      return [];
    }
    //
  } catch (error) {
    console.log("Error:::", error);
  }
};

export const searchReviews = async (
  word: string | null,
  count: number,
  limit: number
) => {
  try {
    const res = await apiClient(
      `search?limit=${limit}&skip=${count}&keyword=${word}&type=video`,"GET"
    );
 
    if (res.success) {
      return res.data.data;
    } else {
      return [];
    }
    //
  } catch (error) {
    console.log("Error:::", error);
  }
};

// https://www.elawdrawer.in/api/v2/search?limit=10&skip=0&keyword=jeevan&type=video
// https://www.elawdrawer.in/api/v2/search?needBusinessUsers=true&limit=10&skip=0&keyword=jeevan&type=user
// https://www.elawdrawer.in/api/v2/search?needBusinessUsers=false&limit=10&skip=0&keyword=jeevan&type=user
