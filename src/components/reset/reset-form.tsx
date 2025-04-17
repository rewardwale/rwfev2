"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useState, useTransition } from "react";
import { sendForgotPassword } from "@/apis/resetPassword";


const ResetSchema = z.object({
  indEmail: z.string().email().optional(),
  indMobileNum: z.string().optional()
}).superRefine((data, ctx) => {
  const hasEmail = !!data.indEmail?.trim();
  const hasPhone = !!data.indMobileNum?.trim();

  if (!hasEmail && !hasPhone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either email or phone must be provided",
      path: ["indEmail"]
    });
  }

  if (hasPhone && data.indMobileNum) {
    if (!/^\d{10}$/.test(data.indMobileNum)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number format (10 digits required)",
        path: ["indMobileNum"]
      });
    }
  }
});

export default function ResetForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [resetType, setResetType] = useState<"EMAIL" | "SMS">("EMAIL");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      indEmail: "",
      indMobileNum: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleTabChange = (type: "EMAIL" | "SMS") => {
    setResetType(type);
    form.reset({
      indEmail: type === "EMAIL" ? "" : undefined,
      indMobileNum: type === "SMS" ? "" : undefined,
    });
    setError(undefined);
    setSuccess(undefined);
  };

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    
    const body = {
      type: resetType,
      indEmail: resetType === "EMAIL" ? values.indEmail : undefined,
      indCountryCode: resetType === "SMS" ? "91" : undefined,
      indMobileNum: resetType === "SMS" ? values.indMobileNum : undefined,
    };

    startTransition(() => {
      sendForgotPassword(body).then((res) => {
        if (res.success) {
          setSuccess(res.message);
          setError(undefined);
          form.reset();
        } else {
          setError(res.message);
          setSuccess(undefined);
        }
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-1">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <img
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col w-1/3 justify-center px-4 py-12 sm:px-6 xl:flex-none xl:px-20">
        <div className="mx-auto w-full lg:w-96 py-4">
          <div className="flex flex-col items-center">
            <img
              alt="Rewardwale"
              src="/brand_logo/png/RW_White_Name.png"
              className="w-[220px] hidden dark:inline"
            />
            <img
              alt="Rewardwale"
              src="/brand_logo/png/RW_Black_Name.png"
              className="w-[220px] inline dark:hidden"
            />
            <h2 className="mt-6 text-2xl/9 tracking-tight text-primary font-Inter font-bold">
              Reset your Password
            </h2>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant={resetType === "EMAIL" ? "default" : "outline"}
                onClick={() => handleTabChange("EMAIL")}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={resetType === "SMS" ? "default" : "outline"}
                onClick={() => handleTabChange("SMS")}
              >
                Phone
              </Button>
            </div>

            <div className="space-y-4">
              {resetType === "EMAIL" ? (
                <FormField
                  control={form.control}
                  name="indEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={pending}
                          placeholder="name@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="indMobileNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={pending}
                          placeholder="1234567890"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={pending || !form.formState.isValid}
            >
              {pending ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}