"use client";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schema";
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
import { Newlogin } from "@/actions/login";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const [shwoTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userIdentity: "",
      password: "",
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      Newlogin(values)
        .then((res) => {
          console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            router.push("/home");
            localStorage.removeItem("uib");
            localStorage.removeItem("token");
            localStorage.setItem("UID", JSON.stringify(res.success));
            localStorage.setItem("token", res.success.accessToken);
            setSuccess("successfully logged in");
          }

          // if (res?.twoFactor) {
          //   setShowTwoFactor(true);
          // }
          // setSuccess(res?.success);
          //start transition will tell when the validation has ended till then the feilds will be disabled
        })
        .catch((error) => setError(error.message));
    });
  };

  return (
    <div>
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
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <>
                  <FormField
                    control={form.control}
                    name="userIdentity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login with Email, Mobile Number or Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter username,mobile number or Email"
                            type="text"
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="********"
                            type="password"
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
                {/* )} */}

                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="px-0 font-normal"
                >
                  <Link href="/reset">Forgot Password?</Link>
                </Button>
              </div>
              {(error || urlError) && <FormError message={error || urlError} />}
              {success && <FormSuccess message={success} />}
              <Button type="submit" className="w-full">
                {/* {shwoTwoFactor ? "Confirm" : "login"} */}
                login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
