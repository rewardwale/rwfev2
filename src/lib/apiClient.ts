import axiosInstance from "./api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiClient<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  payload?: any
): Promise<ApiResponse<T>> {
  try {
    const config: any = {
      url: endpoint,
      method,
    };

    // Attach the payload if provided
    if (payload) {
      config.data = payload;

      // Automatically adjust headers for FormData
      if (payload instanceof FormData) {
        config.headers = { "Content-Type": "multipart/form-data" };
        // Axios will automatically handle boundary and other headers for FormData
      }
    }

    const response = await axiosInstance(config);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`API call to ${endpoint} failed:`, error.message);
    return {
      success: false,
      error: error.message || "Something went wrong",
    };
  }
}
