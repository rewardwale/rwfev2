"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema, ResetSchema } from "@/schema";
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
import { useEffect, useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";
import { validateToken } from "@/apis/resetPassword";

export default function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [tokenVerification, setTokenVerification] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("....Loading");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values, token).then((res) => {
        setError(res?.error);
        setSuccess(res?.success);
        //start transition will tell when the validation has ended till then the feilds will be disabled
      });
    });
  };

  useEffect(() => {
    //verify the token
    init();
  }, []);

  const init = async () => {
    const verifyToken = await validateToken(token || "");
    console.log("::::::verifyToken::::::", verifyToken);
    if (verifyToken.status) {
      setTokenVerification(true);
    } else {
      setMessage(verifyToken.message + " " + "Please try again!");
    }
  };

  return (
    <div className="min-h-screen flex flex-1">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <img
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full"
          // inset-0 size-full object-cover
        />
      </div>
      <div
        className="flex flex-1 flex-col w-1/3 justify-center px-4 py-12 sm:px-6 xl:flex-none
          xl:px-20"
      >
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
              Sign In
            </h2>
          </div>
        </div>{" "}
        {tokenVerification && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="name@domain.com"
                          type="password"
                          disabled={pending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </Form>
        )}
        {!tokenVerification && (
          <div className="justify-center items-center flex my-20">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
