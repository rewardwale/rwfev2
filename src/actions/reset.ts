import { sendForgotPassword } from "@/apis/resetPassword";
import { ResetSchema } from "@/schema";
import * as z from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { indEmail, indMobileNum } = validatedFields.data;

  // Determine the reset type based on which field is provided
  const resetType = indEmail ? "EMAIL" : "SMS";
  
  const result = await sendForgotPassword({
    type: resetType,
    indEmail: indEmail,
    indMobileNum: indMobileNum
  });

  if (!result.success) {
    return { error: result.message };
  }

  return { 
    success: result.message || 
      (resetType === "EMAIL" 
        ? "Reset email sent!" 
        : "Reset instructions sent to your phone")
  };
};