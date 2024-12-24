"use server";
import { apiClient } from "@/lib/apiClient";
import axios, { AxiosError } from "axios";
import api, { getDeviceFingerprint } from "@/lib/api";
import { headers } from "next/headers";

export async function checkUserNameAvailability(userName: string) {
  try {
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

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/userNameAvailability/${userName}?isBusinessUser=false`,
      {
        headers: {
          "Content-Type": "application/json",
          // fingerprint: fingerPrints,
          latitude: latitude,
          longitude: longitude,
          // lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    if (response.status === 200) {
      if (response.data.data.isAvailable) {
        return true;
      } else if (!response.data.data.isAvailable) {
        return false;
      }
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("error", error.response);
    return false;
  }
}

export async function validateEmail(email: string) {
  console.log("::::::1:::::", email);
  //   const response = await  apiClient(`/validateEmail/${email}`, "GET");
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
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateEmail/${email}?isBusinessUser=false`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validateEmail/${email}?isBusinessUser=false`,
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
    console.log("}}}}", response.status);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("error", error.response);
    return false;
  }
}

export async function validatePhone(countryCode: string, mobile: string) {
  console.log("::::::2:::::", countryCode, mobile);
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
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validatePhoneNumber/${countryCode}/${mobile}?isBusinessUser=false`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/validatePhoneNumber/${countryCode}/${mobile}?isBusinessUser=false`,
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
    console.log("response====>", response.status);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    console.error("error", error.response);
    return false;
  }
}

export async function verifyOTPMobile(
  code: string,
  number: string,
  otp: string,
) {
  console.log("::::::3:::::");
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
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?countryCode=${code}&phoneNumber=${number}&otp=${otp}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?countryCode=${code}&phoneNumber=${number}&otp=${otp}`,
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
    console.log("===>7634==>", response.data);
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

export async function verifyOTPEmail(otp: string, email: string) {
  console.log("::::::4:::::");
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
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?otp=${otp}&emailId=${email}`,
    );
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/verifyOTP?otp=${otp}&emailId=${email}`,
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
    console.log("===>7634==>", response.data);
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

export async function signup(value: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  gender: string;
  email: string;
  mobile: string;
  userName: string;
  password: string;
}) {
  try {
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
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`,
      {
        indFirstName: value.firstName,
        indLastName: value.lastName,
        userName: value.userName,
        indGender: value.gender,
        indDob: value.dateOfBirth.replace(/^"|"$/g, ""),
        location: value.city,
        locationCoordinates: {
          latitude: 90,
          longitude: 180,
        },
        indEmail: value.email,
        indPwd: value.password,
        indCountryCode: "91",
        indMobileNum: value.mobile,
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
        indWhatsappNotify: true,
        // categoryPref: ["string78wh36sfyeh8012347"],
        notificationObj: {
          endpoint: "string",
          expirationTime: "string",
          keys: {
            p256dh: "string",
            auth: "string",
          },
        },
        // socialProviderToken: "string",
      },
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
    console.log("::::", response.status);
    if (response.status === 200) {
      return { success: "successfully created" };
    } else {
      return { error: "Signup isnt successful" };
    }
  } catch (error: any) {
    console.log("error::", error.response);
    return { error: error.response.data.message };
  }
}
