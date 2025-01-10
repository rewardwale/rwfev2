"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newSignupSchema, PersonalInfoFormSchema } from "@/schema";
import {
  Form,
  FormControl,
  FormDescription,
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
import Link from "next/link";
import { PersonalInfo, simpleForm, simpleProviderForm } from "../../actions/signup";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import { useRouter } from "next/navigation";

interface Props {
  stateChange: (one: boolean, two: boolean, three: boolean) => void;
  data: (
    firstName: string,
    lastName: string,
    email: string,
    userName: string,
    password: string,
  ) => void;
}

export default function ProviderForm() {
  const { data, status, update } = useSession();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [showPassword_1, setShowpassword_1] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        localStorage.setItem("token", session?.user?.accessToken || "");
      }
    });
  }, []);

  const form = useForm<z.infer<typeof newSignupSchema>>({
    resolver: zodResolver(newSignupSchema),
    mode: "onChange",
    defaultValues: {
      email: data?.user.email,
      lastname: data?.user.lastname,
      firstname: data?.user.firstname,
      userName: "",
      // password: "",
      // confirmPassword: "",
      // TnC: false,
    },
  });



  const onSubmit = (values: z.infer<typeof newSignupSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      const fingerPrints = getDeviceFingerprint();
      const isLocalStorageAvailable = localStorage;
      // Safely access location data from localStorage
      const latitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lat") ?? "90")
        : "90";
      const longitude = isLocalStorageAvailable
        ? (localStorage.getItem("loc-lng") ?? "90")
        : "90";
      simpleProviderForm(values, fingerPrints, latitude, longitude,data?.user.accessToken||"",data?.user.provider||"")
        .then((res) => {
          //console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            setSuccess("ogged in");
            const data= res.success.data.indDetail;
            localStorage.removeItem("uib");
            localStorage.removeItem("token");
            localStorage.setItem("uib", JSON.stringify(data));
            localStorage.setItem("token", data.accessToken);
            router.push("/home");          
          }

        })
        .catch((error) => setError(error.message));
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
      <Card className="flex-1 flex-col w-1/3 space-y-9 xl:flex-none min-h-screen px-2">
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
                Sign Up
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="min-h-56 justify-center block space-y-10">
          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-2 w-full">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            First Name<span className="text-red-600"> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Jhon"
                              type="text"
                              maxLength={30}
                              minLength={3}
                              disabled={pending}
                              onBlur={(e) => {
                                const value = e.target.value;
                                const capitalizedValue =
                                  value.charAt(0).toUpperCase() +
                                  value.slice(1);
                                field.onChange(capitalizedValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Last Name<span className="text-red-600"> *</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Doe"
                              type="text"
                              maxLength={30}
                              minLength={3}
                              disabled={pending}
                              onBlur={(e) => {
                                const value = e.target.value;
                                const capitalizedValue =
                                  value.charAt(0).toUpperCase() +
                                  value.slice(1);
                                field.onChange(capitalizedValue);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email<span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="name@domain.com"
                            type="email"
                            disabled={pending}
                            onBlur={(e) => {
                              const value = e.target.value;

                              const lowerCase = value.toLocaleLowerCase();

                              field.onChange(lowerCase);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          User Name<span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="user name"
                            disabled={pending}
                            minLength={3}
                            maxLength={30}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {(error || urlError) && (
                  <FormError message={error || urlError} />
                )}
                {success && <FormSuccess message={success} />}
                <div className="flex flex-row justify-center gap-12 w-full">
                  <Button className="w-full" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant={"link"}
            className="font-normal w-full hover:text-blue-500"
            size="sm"
            asChild
          >
            <Link href={"/login"}>Already have an account? </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
