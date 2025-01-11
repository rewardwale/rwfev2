"use client";

import type * as React from "react";
import { useState } from "react";
import { signup } from "@/apis/signUp";
import { useRouter } from "next/navigation";
import PersonalInfoForm from "./subFormPersonal";
import CredentialVerificationForm from "./subFormVerify";
import FinalProviderForm from "./subFormPassword";
import { error } from "node:console";
import Image from "next/image";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import SimpleForm from "./simpleForm";
import { Social } from "./social";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function SignupForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [cred, setCred] = useState<boolean>(false);
  const [social, setSocial] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [signupForm, setSignupForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    fingerPrints: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    fingerPrints: "",
  });

  // const handleChangeState = async () => {
  //   console.log("SIGNUP API ==>", signupForm);

  //   //signupapi
  //   signupForm.fingerPrints = getDeviceFingerprint();
  //   const isLocalStorageAvailable = localStorage;
  //   // Safely access location data from localStorage
  //   const latitude = isLocalStorageAvailable
  //     ? (localStorage.getItem("loc-lat") ?? "90")
  //     : "90";
  //   const longitude = isLocalStorageAvailable
  //     ? (localStorage.getItem("loc-lng") ?? "90")
  //     : "90";
  //   const signUp = await signup(signupForm, latitude, longitude);
  //   console.log(":::::::=>", signUp);
  //   if (signUp.success) {
  //     router.push("/login");
  //   }

  //   if (signUp.error) {
  //     setMessage(signUp.error);
  //   }
  // };

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

      {!toggle && (
        <Card className="flex-1 border-0 flex-col w-1/3 space-y-9 xl:flex-none min-h-screen px-2">
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
            <Button
              className="w-full"
              onClick={() => {
                setCred(true);
                setToggle(true);
              }}
            >
              Sign Up With Email
            </Button>
            <Social />
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
      )}

      {cred && (
        <Card className="flex-1 flex-col w-1/3 xl:flex-none min-h-screen px-4">
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
          <CardContent className="justify-center block pb-0">
            <SimpleForm />
          </CardContent>

          <CardFooter className="pt-2">
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
      )}
      
    </div>
  );
}
