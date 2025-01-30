import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.elawdrawer.in/';

const getLocalStorageValue = (key: string, defaultValue: string | number) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  }
  return defaultValue;
};

function getCoordinatesFromLocalStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedData = localStorage.getItem("ubi");

    if (storedData) {
      const data = JSON.parse(storedData); // Parse the JSON string to an object
      const { locationCoordinates } = data;

      if (locationCoordinates && locationCoordinates.coordinates) {
        const [longitude, latitude] = locationCoordinates.coordinates;
        return { longitude, latitude };
      }
    }
  }

  return { longitude: null, latitude: null };
}

const { longitude, latitude } = getCoordinatesFromLocalStorage();

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

// Temporary token
const TEMP_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzYxM2YwMGZlYWI0MGFlZDAyNTc2MmMiLCJ1c2VyTmFtZSI6Ik1hZGhhblMiLCJ0b2tlblZlcnNpb24iOjEsImlzQnVzaW5lc3NVc2VyIjpmYWxzZSwidGltZXN0YW1wIjoiMjAyNC0xMi0yMFQwODoyOTozMi4zOTFaIiwicm9sZSI6IjY1ZjZkZmE1ZjFhOGYxMGQ4NjBiYWU4MiIsImluZEZpbmdlclByaW50IjoiRGVsbCIsImluZExhblByZWYiOiJlbiIsImN1c3RJZCI6IjY3NjEzZjAwZmVhYjQwYWVkMDI1NzYyZCIsImlhdCI6MTczNDY4MzM3MiwiZXhwIjoxNzM1OTc5MzcyfQ.YmaMR5X792K-sEtM7vwFd4cF7DAcDePLcFKU3VpAVks`;

const api = axios.create({
  baseURL: `${baseURL}api/`,
  headers: {
    "Content-Type": "application/json",
    fingerprint: getDeviceFingerprint(),
    latitude: 90,
    longitude: 90,
    lan: "en",
  },
  timeout: 10000,
});

// Request Interceptor: Attach tokens or any required headers
api.interceptors.request.use(
  (config: any) => {
    // let token = localStorage.getItem("token") ; // Get the token from localStorage if available
    // let token = TEMP_TOKEN
    const token = localStorage.getItem("token");
    if (token) {
      // Use the temporary token if no token is available
      // You can add authentication tokens here if needed
      // const token = localStorage.getItem("token");
      // if (token) {
      //   config.headers["Authorization"] = `Bearer ${token}`;
      // }

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
