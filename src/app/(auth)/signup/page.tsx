"use client";

import type * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { isValidPhoneNumber } from "react-phone-number-input";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  fName: z
    .string()
    .min(1, "Minimum 1 character long")
    .max(25, "Maximum 25 characters")
    .regex(/^[A-Za-z]+$/, "Only Letters A-Z and a-z")
    .trim(),
  lName: z
    .string()
    .min(1, "Minimum 1 character long")
    .max(25, "Maximum 25 characters")
    .regex(/^[A-Za-z]+$/, "Only Letters A-Z and a-z")
    .trim(),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, "Invalid email address"),
  phoneNum: z
    .string()
    .trim()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  selectedDate: z.date(),
  gender: z.string(),
  tncppcgAccepted: z.boolean().default(false),
  commprefAccept: z.boolean().default(false),
});

export default function SignupPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedDate: new Date("01-Jan-2000"),
    },
  });

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date("01-Jan-2000"),
  );

  console.log("Selected Date:", selectedDate); //Access the latest date value

  // Callback to update the selected date
  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    form.setValue("selectedDate", newDate);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("inside onSubmit", values);
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-white">{JSON.stringify(values, null, 2)}</code>
      //   </pre>,
      // );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  console.log("Selected Date:", selectedDate); //Access the latest date values

  return (
    <>
      <div className="min-h-screen flex flex-1">
        <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
          <img
            alt="Share your Experiences, Review and Rate"
            src="/images/iStock-1409730706.jpg"
            className="absolute"
            // inset-0 size-full object-cover
          />
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 xl:flex-none xl:px-20">
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
                Sign Up
              </h2>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mt-6 md:max-w-md space-y-4"
            >
              <div className="md:flex flex-1 gap-2">
                <FormField
                  control={form.control}
                  name="fName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      {/* <FormDescription>minimun 3 characters</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" type="text" {...field} />
                      </FormControl>
                      {/* <FormDescription>minimum 3 characters</FormDescription> */}
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    {/* <FormDescription>Email</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNum"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="1234567890"
                        {...field}
                        defaultCountry="IN"
                      />
                    </FormControl>
                    {/* <FormDescription>mobile number only</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:flex flex-1 gap-4">
                <FormField
                  control={form.control}
                  name="selectedDate"
                  render={({ field }) => (
                    <FormItem className="sm:pb-4 flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                      />
                      {/*<Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                " pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>18 years & above only</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col">
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* <FormDescription>Gender</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-sm">
                <FormField
                  control={form.control}
                  name="tncppcgAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        {/* <FormLabel>
                        </FormLabel> */}
                        <FormDescription>
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
                  name="commprefAccept"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        {/* <FormLabel></FormLabel> */}
                        <FormDescription>
                          I authorise and allow Rewardwale and its associates,
                          partners, participating merchants and brands to
                          contact me on Email, SMS, WhatsApp and Push
                          Notifications
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-center gap-12">
                <Button className="w-20" type="submit">
                  Clear
                </Button>
                <Button className="w-20" type="submit">
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

{
  /* <div className="mt-6">
              <div>
                <form action="#" method="POST" className="space-y-4">
                  <div>
                    <label htmlFor="fName" className="block text-sm/6">
                      First Name
                    </label>
                    <div className="">
                      <input
                        id="fName"
                        name="fName"
                        type="fName"
                        required
                        autoComplete=""
                        placeholder="First Name"
                        className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1
                          outline-gray-300 placeholder:text-gray-400 focus:outline-2
                          focus:-outline-offset-2 focus:outline-muted-foreground sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lName"
                      className="block text-sm/6 font-medium"
                    >
                      Last Name
                    </label>
                    <div className="">
                      <input
                        id="lName"
                        name="lName"
                        type="lName"
                        required
                        autoComplete="lName"
                        placeholder="Last Name"
                        className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1
                          outline-gray-300 placeholder:text-gray-400 focus:outline-2
                          focus:-outline-offset-2 focus:outline-muted-foreground sm:text-sm/6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="mobileNum"
                      className="block text-sm/6 font-medium"
                    >
                      Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="mobileNum"
                        name="mobileNum"
                        type="mobileNum"
                        required
                        autoComplete="mobileNum"
                        placeholder="9987731933"
                        pattern="[0-9]{10}"
                        className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1
                          outline-gray-300 placeholder:text-gray-400 focus:outline-2
                          focus:-outline-offset-2 focus:outline-muted-foreground sm:text-sm/6"
                      />
                      <Button>Verify</Button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium"
                    >
                      One Time Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-md px-3 py-1.5 text-base outline-1 -outline-offset-1
                          outline-gray-300 placeholder:text-gray-400 focus:outline-2
                          focus:-outline-offset-2 focus:outline-muted-foreground sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-6 shrink-0 items-center">
                        <div className="group grid size-4 grid-cols-1">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300
                              bg-white checked:border-indigo-600 checked:bg-indigo-600
                              indeterminate:border-indigo-600 indeterminate:bg-indigo-600
                              focus-visible:outline-2 focus-visible:outline-offset-2
                              focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100
                              disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                          />
                          <svg
                            fill="none"
                            viewBox="0 0 14 14"
                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center
                              justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                          >
                            <title>circle</title>
                            <path
                              d="M3 8L6 11L11 3.5"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-has-checked:opacity-100"
                            />
                            <path
                              d="M3 7H11"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="opacity-0 group-has-indeterminate:opacity-100"
                            />
                          </svg>
                        </div>
                      </div>
                      <label
                        htmlFor="remember-me"
                        className="block text-sm/6 text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm/6">
                      <a
                        href="/"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6
                        font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-10">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <a
                    href="/"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2
                      text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset
                      hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">Google</span>
                  </a>

                  <a
                    href="/"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2
                      text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset
                      hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="size-5 fill-[#24292F]"
                    >
                      <path
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm/6 font-semibold">GitHub</span>
                  </a>
                </div>
              </div>
            </div> */
}
