"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotEmailSchema, ResetSchema } from "@/schema";
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
import { reset } from "../../actions/reset";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import Link from "next/link";
import Image from "next/image";
import { forgotEmail } from "@/actions/forgot-email";
import { getDeviceFingerprint } from "@/lib/api";

export default function ForgotEmailForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof ForgotEmailSchema>>({
    resolver: zodResolver(ForgotEmailSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotEmailSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
             const fingerPrint = getDeviceFingerprint();
              const isLocalStorageAvailable = localStorage;
              // Safely access location data from localStorage
              const latitude = isLocalStorageAvailable
                ? (localStorage.getItem("loc-lat") ?? "90")
                : "90";
              const longitude = isLocalStorageAvailable
                ? (localStorage.getItem("loc-lng") ?? "90")
                : "90";
        forgotEmail(values,fingerPrint,latitude,longitude).then((res) => {
        setError(res?.error);
        setSuccess(res?.success);
        //start transition will tell when the validation has ended till then the feilds will be disabled
      });
    });
  };

  return (
    <div className="min-h-screen flex flex-1">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <Image
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full"
          width={10000}
          height={10000}
          // inset-0 size-full object-cover
        />
      </div>
      <Card className="flex-1 flex-col w-1/3 xl:flex-none  px-2">
        <CardHeader>
          <div className="mx-auto pt-2">
            <div className="flex flex-col items-center">
              <Image
                alt="Rewardwale"
                src={whiteLogo}
                className="w-[220px] hidden dark:inline"
              />
              <Image
                alt="Rewardwale"
                src={blackLogo}
                className="w-[220px] inline dark:hidden"
              />
              <h2 className="mt-6 text-2xl/9 tracking-tight text-primary font-Inter font-bold">
                Forgot Email
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="justify-center  flex flex-col  ">
          <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234567890"
                      type="text"
                      maxLength={10}
                      disabled={pending}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                        if (value.length <= 10) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            {(error ) && (
                  <FormError message={error} />
                )}
                {success && <FormSuccess message={success} />}
                <Button type="submit" className="w-full">
                  {/* {shwoTwoFactor ? "Confirm" : "login"} */}
                  Get Email
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="block space-y-4 ">
          <Button
            variant={"link"}
            className="w-full hover:text-blue-500 font-bold"
            size="sm"
            asChild
          >
            <Link href={"/signup"}>Dont have an account ? </Link>
          </Button>
        </CardFooter>
      </Card>
      </div>
  );
}
