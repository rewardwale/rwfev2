"use client";

import type * as React from "react";
import { useState } from "react";
import { signup } from "@/apis/signUp";
import { useRouter } from "next/navigation";
import PersonalInfoForm from "./subFormPersonal";
import CredentialVerificationForm from "./subFormVerify";
import FinalProviderForm from "./subFormPassword";

export default function SignupForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [signupForm, setSignupForm] = useState<{
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    city: string;
    gender: string;
    email: string;
    mobile: string;
    userName: string;
    password: string;
  }>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    city: "",
    gender: "",
    email: "",
    mobile: "",
    userName: "",
    password: "",
  });
  const [step, setStep] = useState<{
    stepOne: boolean;
    stepTwo: boolean;
    stepThree: boolean | string;
  }>({
    stepOne: true,
    stepTwo: false,
    stepThree: false,
  });

  const handleChangeState = async (
    one: boolean,
    two: boolean,
    three: boolean | string,
  ) => {
    console.log("SIGNUP API ==>", signupForm);
    if (!one && !two && !three) {
      //signupapi

      const signUp = await signup(signupForm);

      if (signUp.success) {
        router.push("/login");
      }

      if (signUp.error) {
        setMessage(signUp.error);
      }
    } else {
      setStep({
        stepOne: one,
        stepThree: three,
        stepTwo: two,
      });
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
        className="flex flex-1 flex-col justify-center w-1/3 px-4 py-12 sm:px-6 xl:flex-none
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
              Sign Up
            </h2>
          </div>
        </div>
        <div className="w-full">
          {" "}
          {step.stepOne && (
            <PersonalInfoForm
              stateChange={handleChangeState}
              data={(
                firstName: string,
                lastName: string,
                email: string,
                mobile: string,
                city: string,
                gender: string,
                dataOfBirth: string,
              ) =>
                setSignupForm((prev) => ({
                  ...prev,
                  firstName: firstName,
                  lastName: lastName,
                  gender: gender,
                  dateOfBirth: dataOfBirth,
                  email: email,
                  mobile: mobile,
                  city: city,
                }))
              }
            />
          )}
          {step.stepTwo && (
            <CredentialVerificationForm
              stateChange={handleChangeState}
              mobile={signupForm.mobile}
              email={signupForm.email}
            />
          )}
          {step.stepThree && (
            <FinalProviderForm
              // stateChange={handleChangeState}
              data={(userName: string, password: string) => {
                signupForm.userName = userName;
                signupForm.password = password;
                handleChangeState(false, false, false);
              }}
            />
          )}
          {!step.stepOne && !step.stepTwo && !step.stepThree && (
            <p>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
