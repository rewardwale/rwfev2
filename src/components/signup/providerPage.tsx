"use client";
import { useEffect, useState } from "react";
import ProviderForm from "./providerForm";
import { signupWithProvider } from "@/apis/signUp";
import { getSession, useSession } from "next-auth/react";
import { getDeviceFingerprint } from "@/lib/fingerPrint";
import { signInWithProviders } from "@/apis/login";
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
import { useRouter } from "next/navigation";

export default function ProviderAuth() {
  const router = useRouter();
  const [loggedIn, setloggedIn] = useState<boolean>(false);
  const [diffProvider, setDiffProvider] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [err, seterr] = useState<boolean>(false);
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
        init();
      }
    });
  }, []);

  const init = async () => {
    //check if email exists or not
    const availability: { status: boolean; provider: string | undefined } = {
      status: true,
      provider: "GOOGLE",
    };

    //if doesnt exists
    // if (!availability.status) {
    //   setloggedIn(true);
    // }

    if (availability.status) {
      if (availability.provider === data?.user.provider?.toLocaleUpperCase()) {
        const login = await signInWithProviders(
          data?.user.provider || "",
          data?.user.accessToken || "",
          fingerPrints,
          latitude,
          longitude,
        );
        console.log("login", login);
        if (login.status) {
          const datas= login.message.data.indDetail;
          localStorage.removeItem("uib");
          localStorage.removeItem("token");
          localStorage.setItem("uib", JSON.stringify(datas));
          localStorage.setItem("token", datas.accessToken);
          router.push("/home");
        } else {
          // seterr(true);
          // setMessage(login.message);
          setloggedIn(true);
        }
      }
      if (availability.provider !== data?.user.provider?.toLocaleUpperCase()) {
        setDiffProvider(true);
      }
    }
  };

  return (
    <>
    {!loggedIn && <p>Loading........</p>}
      {loggedIn && <ProviderForm />}
      {diffProvider && (
        <AlertDialog open={diffProvider} onOpenChange={setDiffProvider}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription>
                Dear user you have already registered for <b>Rewardwale</b>{" "}
                using <b>{data?.user.provider?.toLocaleUpperCase()}</b> Please
                try again using the registered provider
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
              <AlertDialogAction onClick={() => router.push("/login")}>
                Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {err && (
        <AlertDialog open={err} onOpenChange={seterr}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription>{message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
              <AlertDialogAction onClick={() => router.push("/login")}>
                Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
