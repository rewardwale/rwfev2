"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoFormSchema } from "@/schema";
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
import { PersonalInfo } from "../../actions/signup";
import { json } from "node:stream/consumers";
import { SelectGender } from "./Gender-dropDown";
import { Checkbox } from "@radix-ui/react-checkbox";
import { LocationInput } from "./locationFiled";
import { getDeviceFingerprint } from "@/lib/fingerPrint";

interface Props {
  stateChange: (one: boolean, two: boolean, three: boolean) => void;
  data: (
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    city: string,
    gender: string,
    dataOfBirth: string,
  ) => void;
}

export default function PersonalInfoForm({ stateChange, data }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const form = useForm<z.infer<typeof PersonalInfoFormSchema>>({
    resolver: zodResolver(PersonalInfoFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      lastname: "",
      firstname: "",
      mobile: "",
      dob: new Date(),
      gender: "",
      city: "",
    },
  });

  const onSubmit = (values: z.infer<typeof PersonalInfoFormSchema>) => {
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
      PersonalInfo(values, fingerPrints,latitude,longitude)
        .then((res) => {
          //console.log("===res===", res);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // form.reset();
            setSuccess(res?.success);
            data(
              values.firstname,
              values.lastname,
              values.email,
              values.mobile,
              values.city,
              values.gender,
              JSON.stringify(values.dob).split("T")[0],
            );
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

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location<span className="text-red-600"> *</span>
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                        {...field}
                        placeholder="India"
                        type="text"
                        disabled={pending}
                      /> */}
                    <LocationInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      gender<span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      {/* <Input
                          {...field}
                          placeholder="********"
                          type="text"
                          disabled={pending}
                          /> */}
                      <SelectGender
                        {...field}
                        error={form.formState.errors.mobile?.message}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Date of Birth<span className="text-red-600"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={pending}
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        } // Convert Date to string
                        onChange={(e) => {
                          const dateValue = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.onChange(dateValue); // Convert string to Date before passing it to react-hook-form
                        }}
                      />
                    </FormControl>
                    <FormMessage />
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

          <Button
            variant={"link"}
            className="font-normal w-full hover:text-blue-500"
            size="sm"
            asChild
          >
            <Link href={"/login"}>Already have an account? </Link>
          </Button>
        </form>
      </Form>

      {/* </CardWrapper> */}
    </div>
  );
}
