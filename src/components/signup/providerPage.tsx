"use client";
import { useEffect, useState } from "react";
import ProviderForm from "./providerForm";
import { signupWithProvider } from "@/apis/signUp";
import { getSession, useSession } from "next-auth/react";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { signInWithProviders } from "@/apis/login";

export default function ProviderAuth() {
  const [loggedIn, setoggedIn] = useState<boolean>(false);
  const { data, status, update } = useSession();
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
    getSession().then((session) => {
      if (session) {
        localStorage.setItem("token", session?.user?.accessToken || "");
        init();
      }
    });

  }, []);

  const init = async () => {

    const signup = await signupWithProvider(
      {
        email: data?.user.email || "",
        lastName: data?.user.lastname || "",
        firstName: data?.user.firstname || "",
        userName: "",
        // password: password,
        fingerPrints: fingerPrints,
      },
      latitude,
      longitude,
      data?.user.accessToken || "",
      data?.user.provider || "",
    );

    if (!signup.status) {
      //login here
      const login = await signInWithProviders(
        data?.user.provider || "",
        data?.user.accessToken || "",
        fingerPrints,
        latitude,
        longitude,
      );
      if (login.status) {
        return { success: login.message };
      } else {
        return { error: login.message };
      }
    } else {
      return { error: signup.message };
    }
  };

  return <ProviderForm />;
}
