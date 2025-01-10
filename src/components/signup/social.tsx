"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import { PROVIDER_DEFAULT_LOGIN_REDIRECT } from "../../../routes";
import { Separator } from "@/components/ui/separator";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    // check here  if the terms and condition is valid or not !
    signIn(provider, {
      callbackUrl: PROVIDER_DEFAULT_LOGIN_REDIRECT,
      // redirectTo:
    });
  };
  return (
    <div className="flex flex-col items-center w-full gap-x-2 gap-10">
    <div className=" flex items-center justify-center text-sm gap-4">
   <Separator className=" bg-black w-[200px]"/>or<Separator className=" bg-black w-[200px]"/>
         </div>
    <p className="text-xs font-medium  text-center">
    By clicking Continue, you agree to Rewardwale’s User Agreement, Privacy Policy, and Cookie Policy.
    </p>
    <div className="flex items-center justify-center w-full gap-2">
    <Button
        className="w-full  border-black"
        size="lg"
        variant={"outline"}
        onClick={() => {
          onClick("google");
        }}
      >
        <FcGoogle size={12} /><b>Google</b>
      </Button>

      {/* <Button
        className="w-full  border-black"
        size="lg"
        variant={"outline"}
        onClick={() => {
          onClick("github");
        }}
      >
        <FaGithub size={5} />
      </Button> */}
        </div>  
    </div>
  );
};
