"use server";
import axios, { AxiosError } from "axios";

export async function checkUserNameAvailability(userName: string) {
  console.log("checkUserNameAvailability\t",userName)
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
    console.log("error\n\t",error)
    console.error("error", error.response);
    return false;
  }
}

export async function validateEmail(email: string,  fingerPrints:string) {
  console.log("validateEmail", email);
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
    if (response.status === 200) {
      return {status:true,message:response.data.message};
    } else {
      return {status:false,message:response.data.message};
    }
  } catch (error: any) {
console.log("error\n\t",error)
    return {status:false,message:error.response.data.message};
  }
}

export async function validatePhone(countryCode: string, mobile: string,  fingerPrints:string) {
  console.log("validatePhone\t", countryCode, mobile);
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
    if (response.status === 200) {
      return {status:true,message:response.data.message};
    } else {
      return {status:false,message:response.data.message};
    }
  } catch (error: any) {
    console.log("error\n\t",error)
    return {status:false,message:error.response.data.message};
  }
}

export async function verifyOTPMobile(
  code: string,
  number: string,
  otp: string,
  fingerPrints:string
) {
  console.log("verifyOTPMobile\n");
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
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    console.error("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function verifyOTPEmail(otp: string, email: string,  fingerPrints:string) {
  console.log("verifyOTPEmail\n");
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
    if (response.status === 200) {
      return { status: true, message: response.data };
    } else {
      return { status: false, message: response.data };
    }
  } catch (error: any) {
    console.error("error\n\t",error);
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
  fingerPrints:string;
}) {
  try {
    console.log("Signup\n",value)
    const isLocalStorageAvailable =
      typeof window !== "undefined" && window.localStorage;

    // Safely access location data from localStorage
    const latitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lat") ?? "90")
      : "90";
    const longitude = isLocalStorageAvailable
      ? (localStorage.getItem("loc-lng") ?? "90")
      : "90";

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
          endpoint: "/signup",
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
          fingerprint: value.fingerPrints,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000,
      },
    );
    if (response.status === 200) {
      return { success: "successfully created" };
    } else {
      return { error: "Signup isnt successful" };
    }
  } catch (error: any) {
    console.log("error\n\t", error );
    return { error: error.response.data.message };
  }
}
