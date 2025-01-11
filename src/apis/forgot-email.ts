import { getDeviceFingerprint } from "@/lib/fingerPrint";
import axios from "axios";

export async function ForgotEmail(
  mobile: string,
  fingerPrint: string,
  latitude: string,
  longitude: string,
) {
  console.log("::::::ForgotEmail:::::");
  try {
    // Check for localStorage availability

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}api/forgotEmail`,
      {
        indCountryCode: "91",
        indMobileNum: mobile,
      },
      {
        headers: {
          "Content-Type": "application/json",
          fingerprint: fingerPrint,
          latitude: latitude,
          longitude: longitude,
          lan: "en",
        },
        timeout: 10000, // Include timeout as part of the Axios config
      },
    );
    console.log("ForgotEmail response===>", response);
    if (response.status === 200) {
      return {
        status: true,
        message: "OTP sent to phone number",
      };
    } else {
      return { status: false, message: response.data.message };
    }
  } catch (error: any) {
    console.error("error", error.response);
    return { status: false, message: error.response.data.message };
  }
}
