"use server";
import { sendResetPassword } from "@/apis/resetPassword";
import { NewPasswordSchema } from "@/schema";

import * as z from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!1" };
  }

  const { password } = validatedFields.data;

  // const existingToken = await getPasswordResetTokenByToken(token);

  // if (!existingToken) {
  //   return { error: "Invalid token!2" };
  // }

  // const hasExpired = new Date(existingToken.expires) < new Date();

  // if (hasExpired) {
  //   return { error: "Token has Expired!3" };
  // }

  // const existingUser = await getUserByemail(existingToken.email);

  // if (!existingUser) {
  //   return { error: "Email does not exist!4" };
  // }

  // const hashedPassword = await bcrypt.hash(password, 10);

  // await db.user.update({
  //   where: { id: existingUser.id },
  //   data: {
  //     password: hashedPassword,
  //   },
  // });

  // await db.passwordResetToken.delete({
  //   where: { id: existingToken.id },
  // });

  const resetPassword = await sendResetPassword(token, password);

  if (!resetPassword.status) {
    return { error: resetPassword.message };
  }

  return { success: "password updated!" };
};
