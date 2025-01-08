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
import { useState, useTransition } from "react";
import Link from "next/link";
import { PersonalInfo, simpleForm } from "../../actions/signup";
import { json } from "node:stream/consumers";
import { SelectGender } from "./Gender-dropDown";
import { Checkbox } from "@radix-ui/react-checkbox";
import { LocationInput } from "./locationFiled";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { cn } from "@/lib/utils";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { EyeClosed } from "lucide-react";

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

export default function SimpleForm({ stateChange, data }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showPassword, setShowpassword] = useState<boolean>(false);
  const [showPassword_1, setShowpassword_1] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const form = useForm<z.infer<typeof newSignupSchema>>({
    resolver: zodResolver(newSignupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      lastname: "",
      firstname: "",
      userName: "",
      password: "",
      confirmPassword: "",
      TnC: false,
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
      simpleForm(values, fingerPrints, latitude, longitude)
        .then((res) => {
          //console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            setSuccess(res?.success);
            data(values.firstname, values.lastname, values.email,values.password,values.userName);
            stateChange(false, true, false);
          }

          //start transition will tell when the validation has ended till then the feilds will be disabled
        })
        .catch((error) => setError(error.message));
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            value.charAt(0).toUpperCase() + value.slice(1);
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
                            value.charAt(0).toUpperCase() + value.slice(1);
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={pending}
                      /> */}

                    <div
                      className={
                        "flex border shadow-sm focus:ring-1 active:ring-1 selection:ring-1 rounded-sm "
                      }
                    >
                      <Input
                        {...field}
                        placeholder="********"
                        type={showPassword_1 ? "text" : "password"}
                        disabled={pending}
                        className={cn(
                          " focus:border-none focus-visible:outline-none focus-visible:ring-0",
                          "border-none",
                        )}
                        maxLength={12}
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="hover:bg-transparent focus:ring-0"
                        disabled={field.value.length === 0}
                        onClick={() => setShowpassword_1(!showPassword_1)}
                      >
                        {showPassword_1 ? <EyeOpenIcon /> : <EyeClosed />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm Password<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        disabled={pending}
                      /> */}
                    {/* <div
                      className={
                        "flex border shadow-sm focus:ring-1 active:ring-1 selection:ring-1 rounded-sm "
                      }
                    >
                      <Input
                        {...field}
                        placeholder="********"
                        type={showPassword ? "text" : "password"}
                        disabled={pending}
                        maxLength={12}
                        minLength={8}
                        className={cn(
                          " focus:border-none focus-visible:outline-none focus-visible:ring-0",
                          "border-none",
                        )}
                      />
                      <Button
                        type="button"
                        variant={"ghost"}
                        className="hover:bg-transparent focus:ring-0"
                        disabled={field.value.length === 0}
                        onClick={() => setShowpassword(!showPassword)}
                      >
                        {showPassword ? <EyeOpenIcon /> : <EyeClosed />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  */}

            <div className="text-sm">
              <FormField
                control={form.control}
                name="TnC"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Input
                        // {...field}
                        type="checkbox"
                        disabled={pending}
                        // Bind the checkbox state
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="border-2 h-4 w-4 checked:bg-black"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none ">
                      {/* <FormLabel>
                            </FormLabel> */}
                      <FormDescription className="text-xs">
                        I have read and agree to accept and abide by the{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Community Guidelines
                        </Link>
                        ,{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Term & Conditions,
                        </Link>{" "}
                        <Link
                          href="/"
                          className="text-blue-500 underline font-medium"
                        >
                          Privacy Policy
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TnC2"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Input
                        // {...field}
                        type="checkbox"
                        disabled={pending}
                        // Bind the checkbox state
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="border-2 h-4 w-4 checked:bg-black"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      {/* <FormLabel></FormLabel> */}
                      <FormDescription className="text-xs">
                        I authorise and allow Rewardwale and its associates,
                        partners, participating merchants and brands to contact
                        me on Email, SMS, WhatsApp and Push Notifications
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {(error || urlError) && <FormError message={error || urlError} />}
          {success && <FormSuccess message={success} />}
          <div className="flex flex-row justify-center gap-12 w-full">
            <Button className="w-full" type="submit">
              Next
            </Button>
          </div>

         
        </form>
      </Form>

      {/* </CardWrapper> */}
    </div>
  );
}
