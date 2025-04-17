import axios from "axios";
import { getStoredLocation } from "./utils";

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.elawdrawer.in/';

const getLocalStorageValue = (key: string, defaultValue: string | number) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  }
  return defaultValue;
};



const [latitude, longitude] = getStoredLocation();

export const getDeviceFingerprint = () => {
  if (typeof window !== "undefined" && navigator.userAgent) {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezoneOffset = new Date().getTimezoneOffset();

    const fingerprint = `${userAgent}|${language}|${hardwareConcurrency}|${screenResolution}|${timezoneOffset}`;
    return fingerprint;
  }
  return "rajatdevicefingerprint";
};


const api = axios.create({
  baseURL: `${baseURL}api/`,
  headers: {
    "Content-Type": "application/json",
    fingerprint: getDeviceFingerprint(),
    latitude: longitude,
    longitude: latitude,
    lan: "en",
  },
  timeout: 10000,
});

// Request Interceptor: Attach tokens or any required headers
api.interceptors.request.use(
  (config: any) => {
  
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }else{
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common response scenarios
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response) {
      // Handle 4xx and 5xx responses
      const statusCode = error.response.status;
      const message = error.response.data.message || "Something went wrong";

      if (statusCode === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        console.error("Unauthorized access, redirecting...");
      } else if (statusCode === 400) {
        console.error("Bad request");
      }

      // Throw error for component-specific handling
      throw new Error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
