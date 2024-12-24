"use server";
import { sendForgotPassword } from "@/apis/resetPassword";
import { ResetSchema } from "@/schema";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const sendResetEmail = await sendForgotPassword(email);
  if (!sendResetEmail.status) {
    return { error: sendResetEmail.message };
  }

  if (sendResetEmail.status) {
    return { success: sendResetEmail.message };
  }

  return { success: "Reset email sent!" };
};
