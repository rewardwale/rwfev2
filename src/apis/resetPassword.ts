import api, { getDeviceFingerprint } from "@/lib/api";
import { getStoredLocation } from "@/lib/utils";
import axios from "axios";

export async function sendForgotPassword(body: {
  type: "EMAIL" | "SMS";
  indEmail?: string;
  indCountryCode?: string;
  indMobileNum?: string;
}) {
  try {
    // Safely access location data from localStorage
    const [latitude, longitude] = getStoredLocation();

    const fingerPrints = getDeviceFingerprint();

    // Create the request body based on reset type
    const requestBody = {
      type: body.type,
      ...(body.type === "EMAIL" && { indEmail: body.indEmail }),
      ...(body.type === "SMS" && {
        indCountryCode: body.indCountryCode,
        indMobileNum: body.indMobileNum,
      }),
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/forgotPassword`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000,
      },
    );

    return {
      success: response.status === 200,
      message:
        response.data.message ||
        (body.type === "EMAIL"
          ? "Reset password link has been sent. Please check your email"
          : "Reset instructions have been sent to your phone number"),
    };
  } catch (error: any) {
    console.error("API Error:", error.response?.data);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to send reset instructions. Please try again later.",
    };
  }
}

export async function sendResetPassword(token: string, password: string) {
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const [latitude, longitude] = getStoredLocation();
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resetPassword/${token}`,
      {
        indPwd: password,
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
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}

//validate token
export async function validateToken(token: string) {
  try {
    // Check for localStorage availability
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const [latitude, longitude] = getStoredLocation();
    const fingerPrints = getDeviceFingerprint();
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateLink/${token}`,

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
    if (response.status === 200 && response.data.data.isValid) {
      return { status: true, message: response.data.data.reason };
    } else {
      return { status: false, message: response.data.data.reason };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}
