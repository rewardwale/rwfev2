import { apiClient } from "../lib/apiClient";

export async function checkUserNameAvailability(userName: string) {
  const response = await apiClient(`/userNameAvailability/${userName}`, "GET");

  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}


export async function sendOTPEmail(email: string) {
  console.log("::::::1:::::");
  const response = await apiClient(`/validateEmail/${email}`, "GET");
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function sendOTPMobile(mobile: string, countryCode: string) {
  console.log("::::::2:::::");
  const response = await apiClient(
    `validatePhoneNumber/${countryCode}/${mobile}`,
    "GET"
  );
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function verifyOTPMobile(
  code: string,
  number: string,
  otp: string
) {
  console.log("::::::3:::::");
  const response = await apiClient(
    `verifyOTP?countryCode=${code}&phoneNumber=${number}&otp=${otp}`,
    "GET"
  );
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function verifyOTPEmail(otp: string, email: string) {
  console.log("::::::4:::::");
  const response = await apiClient(
    `verifyOTP?otp=${otp}&emailId=${email}`,
    "GET"
  );
  if (response.success && response.data) {
    return response.data;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return null;
  }
}

export async function signup(value: any) {
  const response = await apiClient(`signup`, "POST", {
    indFirstName: value.firstName,
    indLastName: value.lastName,
    userName: value.username,
    indGender: value.gender,
    indDob: "1998-05-24",
    location: value.cityCode,
    locationCoordinates: {
      latitude: 90,
      longitude: 180,
    },
    indEmail: value.email,
    indPwd: value.password,
    indCountryCode: value.countryCallingCode,
    indMobileNum: value.mobile,
    indEmailNotify: false,
    indMobileNotify: false,
    indPushNotify: false,
    indWhatsappNotify: false,
    // categoryPref: ["electron873466ics3e3d34r"],
    // notificationObj: {
    //   endpoint: "signup",
    //   expirationTime: "20",
    //   keys: {
    //     p256dh: "string",
    //     auth: "string",
    //   },
    // },
    // socialProviderToken: "",
  });
  if (response.success && response.data) {
    return response;
  } else {
    console.error("Failed to fetch landing page data:", response.error);
    return response;
  }
}
