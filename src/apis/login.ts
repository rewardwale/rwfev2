import { apiClient } from "../lib/apiClient";

export async function userNameAvailability(userName: string) {
  const response = await apiClient(`/userNameAvailability/${userName}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function SignIn(name: string, password: any) {
  const regexEmail: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const regexMobile: RegExp = /^(91[-\s]?)?[6-9]\d{9}$/;

  const isValidEmail: boolean = regexEmail.test(name);
  const isValidMobileNumber: boolean = regexMobile.test(name);
  let response;
  if (isValidEmail) {
    response = await apiClient(
      `/login`,
      "PUT",

      {
        indEmail: name,
        indPwd: password,
        // userName: "",
        // indCountryCode: "",
        // indMobileNum: "",
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
      }
    );
  }

  if (isValidMobileNumber) {
    response = await apiClient(
      `/login`,
      "PUT",

      {
        // indEmail: email,
        indPwd: password,
        // userName: "",
        indCountryCode: "91",
        indMobileNum: name,
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
      }
    );
  }

  if (response?.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response?.error);
    return response;
  }
}
