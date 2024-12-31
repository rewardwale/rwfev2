"use server";
import {
  combinedSchema,
  OTPFormSchema,
  PasswordFormSchema,
  PersonalInfoFormSchema,
  SignupSchema,
} from "@/schema";
import * as z from "zod";
import {
  checkUserNameAvailability,
  validateEmail,
  validatePhone,
  verifyOTPEmail,
  verifyOTPMobile,
} from "@/apis/signUp";

export const NewSignUp = async (values: z.infer<typeof combinedSchema>) => {
  const validatedFields = combinedSchema.safeParse(values);

  console.log(":::::::::", validatedFields);
};

export const PersonalInfo = async (
  values: z.infer<typeof PersonalInfoFormSchema>,fingerPrints:string,latitude:string,longitude:string
) => {
  const validatedFields = PersonalInfoFormSchema.safeParse(values);

  console.log(":::::::::!!!!", validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, mobile, firstname, lastname, city, dob } =
    validatedFields.data;

  const validatedEmail = await validateEmail(email,fingerPrints,latitude,longitude);
  const validateMobile = await validatePhone("91", mobile,fingerPrints,latitude,longitude);
  if (!validatedEmail.status) {
    return { error:validatedEmail.message };
  }

  if (!validateMobile.status) {
    return { error: validateMobile.message };
  }
  //check if email is already is in use or not- api
  if (validatedEmail.status && validateMobile.status) {
    console.log("done!! email");
    return { success: "OTP has been sent to your email id and mobile number" };
  }
};

export const Verification = async (
  values: z.infer<typeof OTPFormSchema>,
  code: string,
  number: string,
  email: string,
  fingerPrints:string,
  latitude:string,
  longitude:string
) => {
  const validatedFields = OTPFormSchema.safeParse(values);

  console.log(":::::::::", validatedFields, code, number, email);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { verifyEmail, verifyMobileNumber } = validatedFields.data;

  const getMobileOtp = await verifyOTPMobile(code, number, verifyMobileNumber,fingerPrints,latitude,longitude);
  const getEmailOtp = await verifyOTPEmail(verifyEmail, email,fingerPrints,latitude,longitude);
  console.log(":::11::", getEmailOtp);
  console.log(":::21::", getMobileOtp);
  // if (getEmailOtp?.status) {
  //   return { success: getEmailOtp.message };
  // }
  if (!getMobileOtp?.status) {
    return { error: getMobileOtp.message + "for mobile" };
  }

  if (!getEmailOtp?.status) {
    return { error: getEmailOtp.message + " for email" };
  }
  if (getMobileOtp?.status && getEmailOtp?.status) {
    return { success: "Mobile and Email OTPs are verified" };
  }
};

export const Final = async (values: z.infer<typeof PasswordFormSchema>,latitude:string,longitude:string) => {
  const validatedFields = PasswordFormSchema.safeParse(values);

  console.log(":::::::::", validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { userName, password, confirmPassword } = validatedFields.data;

  const verifyUserName = await checkUserNameAvailability(userName,latitude,longitude);
  if (!verifyUserName) {
    return { error: "userName already exists, try some other" };
  }

  return { success: "Success" };
};



