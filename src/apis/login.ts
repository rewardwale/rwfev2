import { getDeviceFingerprint } from "@/lib/api";
import axios from "axios";

export async function signInWithMobile(
  password: string,
  code: string,
  mobile: string,
) {
  console.log("::::::login mobile:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        // indEmail: email,
        indPwd: password,
        // userName: "",
        indCountryCode: code,
        indMobileNum: mobile,
        // isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    // console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

export async function signInWithEmail(password: string, email: string) {
  console.log("::::::login email:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        indEmail: email,
        indPwd: password,
        // userName: "",
        isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

export async function signInWithUserName(password: string, userName: string) {
  console.log("::::::login userName:::::");
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/login`,
      {
        indPwd: password,
        userName: userName,

        // isBusinessUser: false,
        indPushNotify: true,
        notificationObj: {
          endpoint: "signin",
          expirationTime: "20",
          keys: {
            p256dh: "tyutw",
            auth: "werw",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    // console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}
