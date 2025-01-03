import { apiClient } from "@/lib/apiClient";

export const addBusiness = async ( payload: Record<string, any>) => {
  try {
    const response = await apiClient(`/businessPage`,'POST', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};