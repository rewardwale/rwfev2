"use server";
import { ForgotEmail } from "@/apis/forgot-email";
import { ForgotEmailSchema } from "@/schema";
import * as z from "zod";

export const forgotEmail = async (values: z.infer<typeof ForgotEmailSchema>,fingerprint:string,latitude:string,longitude:string) => {
  const validatedFields = ForgotEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { mobile } = validatedFields.data;

  const forgotEmail = await ForgotEmail(mobile,fingerprint,latitude,longitude);
  if (!forgotEmail.status) {
    return { error: forgotEmail.message };
  }

  if (forgotEmail.status) {
    return { success: forgotEmail.message };
  }

  return { success: "OTP sent to mobile address" };
};
