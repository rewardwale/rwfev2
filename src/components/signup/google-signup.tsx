"use client";

import { resendOTPMobile, validatePhone, verifyOTPMobile } from "@/apis/signUp";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { IoClose } from "react-icons/io5";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getDeviceFingerprint } from "@/lib/api";
import { toast } from "sonner";
import { signupWithSocialProvider } from "@/apis/home";


declare global {
  interface Window {
    google?: any;
  }
}

const GoogleSignUp = () => {
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const [otpMobile, setOtpMobile] = useState<string>("");
  const [success, setSuccess] = useState<string | undefined>();
  const [error_1, setError_1] = useState<string | undefined>();
  const [success_1, setSuccess_1] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const fingerPrints = getDeviceFingerprint();
  const isLocalStorageAvailable = localStorage;
  // Safely access location data from localStorage
  const latitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lat") ?? "90")
    : "90";
  const longitude = isLocalStorageAvailable
    ? (localStorage.getItem("loc-lng") ?? "90")
    : "90";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    // Prevent SSR issues
    if (typeof window === "undefined") return;

    // Check if script is already loaded
    if (!document.getElementById("google-oauth-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-oauth-script";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
        initializeGoogleSignUp();
      };
      document.body.appendChild(script);
    } else {
      setGoogleLoaded(true);
      initializeGoogleSignUp();
    }
  }, []);

  const initializeGoogleSignUp = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        {
          theme: "outline",
          size: "large",
          text: "signup_with",
        },
      );
    }
  };

  const handleGoogleResponse = async (response: any) => {
    if (!response.credential) {
      console.error("Google Sign-up failed: No credential received");
      return;
    }

    // Construct user data required for internal API sign-up
    // const userData = {
    //   indFirstName: decodedToken.given_name || "",
    //   indLastName: decodedToken.family_name || "",
    //   userName: decodedToken.email.split("@")[0],
    //   location: "Unknown",
    //   locationCoordinates: { latitude: 90, longitude: 90 },
    //   indEmail: decodedToken.email,
    //   indCountryCode: "+91",
    //   indMobileNum: "",
    //   indEmailNotify: true,
    //   indMobileNotify: true,
    //   indPushNotify: true,
    //   indWhatsappNotify: true,
    //   socialProviderType: "GOOGLE",
    //   socialProviderToken: response.credential,
    // };

    const credential = JSON.parse(atob(response.credential.split(".")[1]));

    setGoogleUser({
      indFirstName: credential.given_name,
      indLastName: credential.family_name,
      userName: credential.email.split("@")[0],
      indEmail: credential.email,
      socialProviderType: "GOOGLE",
      socialProviderToken: response.credential,
    });

    setShowPhoneInput(true);

    // let res = await signupWithSocialProvider(userData);
  };

  const handleSendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(30);
      const response = await validatePhone(
        "91",
        phoneNumber,
        fingerPrints,
        latitude,
        longitude,
      );

      console.log("checking response of send otp", response);
      toast.message(response.message);
      response.status ? setShowOtp(true) : setShowOtp(false);
    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError("Failed to send OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      setCanResend(false);
      setTimer(30);
      const response = await resendOTPMobile(
        "91",
        phoneNumber,
        fingerPrints,
        latitude,
        longitude,
      );
      response.status
        ? setSuccess(response.message)
        : setError(response.message);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      setError("Failed to resend OTP");
    }
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      setError("Invalid OTP");
      return;
    }

    const validateOtpMobile = await verifyOTPMobile(
      "91",
      phoneNumber,
      otp,
      fingerPrints,
      latitude,
      longitude,
    );

    if (validateOtpMobile.status) {
      setSuccess("OTP Verified!");
      setError("");

      // Final Registration Call
      const userData = {
        ...googleUser,
        indMobileNum: phoneNumber,
        indCountryCode: "91",
        location: "User Location",
        locationCoordinates: { latitude: 90, longitude: 180 },
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
        indWhatsappNotify: true,
      };

      try {
        const response = await signupWithSocialProvider(userData);
        console.log("Signup Successful:", response);
        if (response) {
          toast.success(
            "Registration Successful, Welcome to Rewardwale, Please Login to Continue",
          );
          router.push("/home");
        } else {
          toast.error("Email Already Exists, Please Login..");
          router.push("/login");
        }
        setShowOtp(false);
      } catch (err) {
        setError("Signup Failed");
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Google Sign-Up Button */}
      {!showPhoneInput && <div id="google-signup-btn"></div>}

      {/* Phone Number Input */}
      {showPhoneInput && (
        <div className="flex flex-col space-y-2 w-full items-center gap-2">
          <label className="text-sm font-medium">
            Let's Verify Your Number
          </label>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button onClick={handleSendOtp} disabled={!phoneNumber}>
            Send OTP
          </Button>
        </div>
      )}

      {/* OTP Verification Dialog */}
      <AlertDialog open={showOtp} onOpenChange={setShowOtp}>
        <AlertDialogContent className="w-[300px] rounded-xl sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between">
              OTP Verification
              <AlertDialogCancel
                className="rounded-full w-8 h-8"
                onClick={() => {
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
              >
                <IoClose />
              </AlertDialogCancel>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Kindly enter the OTP sent to your phone number for verification.
          </AlertDialogDescription>
          <div className="flex flex-col items-start gap-3 w-full">
            <p className="text-sm font-medium">Enter OTP</p>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={(e) => setOtp(e)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <Button onClick={handleResendOtp} disabled={!canResend}>
              {canResend ? "Resend OTP" : `Resend in ${timer}s`}
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full"
              onClick={handleOtpVerification}
            >
              Register
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoogleSignUp;
