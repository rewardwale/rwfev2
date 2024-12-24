"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, PasswordFormSchema } from "@/schema";
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
import { Final } from "@/actions/signup";
import { Checkbox } from "@radix-ui/react-checkbox";

interface Props {
  // stateChange: (one: boolean, two: boolean, three: boolean) => void;
  data: (username: string, password: string) => void;
}
export default function FinalProviderForm({ data }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider "
      : "";

  const form = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    mode: "onChange",
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
      TnC: false,
    },
  });

  const onSubmit = (values: z.infer<typeof PasswordFormSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      Final(values)
        .then((res) => {
          console.log("===res===", res, values);
          if (res?.error) {
            // form.reset();
            setError(res?.error);
          }

          if (res?.success) {
            // passwordForm.reset();
            setSuccess(res?.success);
            data(values.userName, values.password);
            // stateChange(false, false, false);
          }

          // setSuccess(res?.success);
          //start transition will tell when the validation has ended till then the feilds will be disabled
        })
        .catch((error) => setError(error.message));
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <>
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="user name"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
            </>
          </div>
          {(error || urlError) && <FormError message={error || urlError} />}
          {success && <FormSuccess message={success} />}

          <div className="flex flex-row justify-center gap-12 w-full">
            <Button className="w-full" type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
