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
  values: z.infer<typeof PersonalInfoFormSchema>,
) => {
  const validatedFields = PersonalInfoFormSchema.safeParse(values);

  console.log(":::::::::!!!!", validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { email, mobile, firstname, lastname, city, dob } =
    validatedFields.data;

  const validatedEmail = await validateEmail(email);
  const validateMobile = await validatePhone("91", mobile);
  if (!validatedEmail) {
    return { error: "Check Your Email , verification Failed" };
  }

  if (!validateMobile) {
    return { error: "Check Your Mobile number , verification Failed" };
  }
  //check if email is already is in use or not- api
  if (validatedEmail && validateMobile) {
    console.log("done!! email");
    return { success: "OTP has been sent to your email id and mobile number" };
  }
};

export const Verification = async (
  values: z.infer<typeof OTPFormSchema>,
  code: string,
  number: string,
  email: string,
) => {
  const validatedFields = OTPFormSchema.safeParse(values);

  console.log(":::::::::", validatedFields, code, number, email);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { verifyEmail, verifyMobileNumber } = validatedFields.data;

  const getMobileOtp = await verifyOTPMobile(code, number, verifyMobileNumber);
  const getEmailOtp = await verifyOTPEmail(verifyEmail, email);
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

export const Final = async (values: z.infer<typeof PasswordFormSchema>) => {
  const validatedFields = PasswordFormSchema.safeParse(values);

  console.log(":::::::::", validatedFields);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }
  const { userName, password, confirmPassword } = validatedFields.data;

  const verifyUserName = await checkUserNameAvailability(userName);
  if (!verifyUserName) {
    return { error: "userName already exists, try some other" };
  }

  return { success: "Success" };
};
