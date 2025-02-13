"use client";

import type * as React from "react";
import Image from "next/image";
import blackLogo from "../../../public/brand_logo/PNG/RW_Black_Name.png";
import whiteLogo from "../../../public/brand_logo/PNG/RW_White_Name.png";
import SimpleForm from "./simpleForm";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import GoogleSignUp from "./google-signup";





export default function SignupForm() {
  const [signupMethod, setSignupMethod] = useState<"email" | "google" | null>(
    null,
  );

  return (
    <div className="min-h-screen flex flex-1 justify-center">
      <div className="relative hidden w-0 xl:block xl:flex-1 hue-rotate-30">
        <Image
          alt="Share your Experiences, Review and Rate"
          src="/images/iStock-1409730706.jpg"
          className="absolute h-full w-full top-0 left-0"
          width={10000}
          height={10000}
          // inset-0 size-full object-cover
        />
      </div>
      <div
        className="w-[500px] space-y-9 sm:px-6 min-h-screen m-5 lg:m-2"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="mx-auto pt-8">
          <div className="flex flex-col items-center">
            <Image
              alt="Rewardwale"
              src={whiteLogo}
              className="md:w-[220px] sm:w-[170px] w-[150px] hidden dark:inline"
            />
            <Image
              alt="Rewardwale"
              src={blackLogo}
              className="md:w-[220px] sm:w-[170px] w-[150px] inline dark:hidden"
            />
            <h2
              className="mt-6 text-xl md:text-2xl lg:text-2xl/9 tracking-tight text-primary font-Inter
                font-bold"
            >
              Sign Up
            </h2>
          </div>
        </div>
        {!signupMethod && (
          <div className="w-full flex flex-col space-y-4 px-4 lg:px-0">
            <button
              onClick={() => setSignupMethod("email")}
              className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Sign up with Email
            </button>
            <button
              onClick={() => setSignupMethod("google")}
              className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
            >
              Sign up with Google
            </button>
          </div>
        )}

        {signupMethod === "email" && (
          <div
            className="w-full px-4 lg:px-0"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SimpleForm />
            <div className="mt-4">
              <button
                onClick={() => setSignupMethod(null)}
                className="text-sm text-gray-200 underline"
              >
                Back to options
              </button>
            </div>
          </div>
        )}

        {signupMethod === "google" && (
          <div
            className="w-full px-4 lg:px-0"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <div className="cursor-pointer" id="google-signup-btn"> */}
            <GoogleSignUp />
            {/* </div> */}

            <div className="mt-4">
              <button
                onClick={() => setSignupMethod(null)}
                className="text-sm text-gray-200 underline"
              >
                Back to options
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
