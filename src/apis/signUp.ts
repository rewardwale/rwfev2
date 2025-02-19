"use server";
import { apiClient } from "@/lib/apiClient";
import axios from "axios";

export async function checkUserNameAvailability(
  userName: string,
  type: string,
) {
  const response = await apiClient(
    `userNameAvailability/${encodeURIComponent(userName)}?type=${encodeURIComponent(type)}`,
    "GET",
  );

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to check username availability:", response.error);
    return null;
  }
}

export const checkUserHandleAvailability = async (
  userName: string,
  latitude: string,
  longitude: string,
) => {
  console.log("checkUserNameAvailability\t", userName);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/userNameAvailability/${userName}?type=user`,
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
    console.log("response:::", response.data.data);
    if (response.status === 200) {
      if (response.data.data.isAvailable) {
        return { status: true, message: response.data.message };
      } else if (!response.data.data.isAvailable) {
        return {
          status: false,
          message: "User Name already exists!,try new",
        };
      }
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.log("error\n\t", error);
    console.error("error", error.response);
    return {status:false,message:error.response.data.message}  }
}


export async function validateEmail(
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  //   const response = await  apiClient(`/validateEmail/${email}`, "GET");
  try {
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
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    return { status: false, message: error.response.data.message };
  }
}

export async function validatePhone(
  countryCode: string,
  mobile: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  try {
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
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    return { status: false, message: error.response.data.message };
  }
}

export async function verifyOTPMobile(
  code: string,
  number: string,
  otp: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  try {
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
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function verifyOTPEmail(
  otp: string,
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  try {
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
      return { status: true, message: response.data.message };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error\n\t", error);
    return { status: false, message: error.response.data.message };
  }
}

export async function signup(
  value: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    mobile: string;
    password: string;
    fingerPrints: string;
  },
  latitude: string,
  longitude: string,
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/signup`,
      {
        indFirstName: value.firstName,
        indLastName: value.lastName,
        userName: value.userName,
        locationCoordinates: {
          latitude: latitude,
          longitude: longitude,
        },
        indEmail: value.email,
        indPwd: value.password,
        location: "karnataka",
        indCountryCode: "91",
        indMobileNum: value.mobile,
        // indDob: "",
        // indGender: "Male",
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
        indWhatsappNotify: true,
        notificationObj: {
          endpoint: "/signup",
          expirationTime: "string",
          keys: {
            p256dh: "string",
            auth: "string",
          },
        },
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
      return { status: true, message: "successfully created" };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    return { status: false, message: error.response.data.message };
  }
}

export async function resendOTPEmail(
  email: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?emailId=${email}`,
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
    console.error("error\n\t", error, error.response.data);
    return { status: false, message: error.response.data.message };
  }
}

export async function resendOTPMobile(
  code: string,
  number: string,
  fingerPrints: string,
  latitude: string,
  longitude: string,
) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/resendOTP?countryCode=${code}&phoneNumber=${number}`,
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
    console.error("error\n\t", error, error.response.data);
    return { status: false, message: error.response.data.message };
  }
}

export const signupWithSocialProvider = async (
  payload: Record<string, any>,
) => {
  try {
    const response = await apiClient(
      "/signupWithSocialProvider",
      "POST",
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};
