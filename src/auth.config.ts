import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schema";
import {
  signInWithEmail,
  signInWithMobile,
  signInWithUserName,
} from "@/apis/login";
interface Cred {
  identity: string;
  password: string;
  userIdentity: string;
  latitude: string;
  longitude: string;
  fingerPrint: string;
  callbackUrl: string;
}
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      async authorize(credentials,request) {

        let cred: Cred = credentials;
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { password, userIdentity } = validatedFields.data;

          if (credentials.identity === "Email") {
            const email = await signInWithEmail(
              password,
              userIdentity,
              cred.fingerPrint,
              cred.latitude,
              cred.longitude,
            );
            if (email.status) {
              // window.localStorage.setItem("UID", email.message.data.indDetail);

              return {
                id: email.message.data.indDetail._id,
                firstname: email.message.data.indDetail.indFirstName,
                lastname: email.message.data.indDetail.indLastName,
                email: email.message.data.indDetail.indEmail,
                image: email.message.data.indDetail.indPic.original,
                accessToken: email.message.data.indDetail.accessToken,
                refreshToken: email.message.data.indDetail.refreshToken,
                providerAccountId: "credentials",
              };
            }
          }

          if (credentials.identity === "Phone Number") {
            const mobile = await signInWithMobile(
              password,
              "91",
              userIdentity,
              cred.fingerPrint,
              cred.latitude,
              cred.longitude,
            );
            if (mobile.status) {
              // window.localStorage.setItem("UID", mobile.message.data.indDetail);
              return {
                id: mobile.message.data.indDetail._id,
                firstname: mobile.message.data.indDetail.indFirstName,
                lastname: mobile.message.data.indDetail.indLastName,
                email: mobile.message.data.indDetail.indEmail,
                image: mobile.message.data.indDetail.indPic.original,
                accessToken: mobile.message.data.indDetail.accessToken,
                refreshToken: mobile.message.data.indDetail.refreshToken,
                providerAccountId: "credentials",
              };
            }
          }

          if (credentials.identity === "Username") {
            const username = await signInWithUserName(
              password,
              userIdentity,
              cred.fingerPrint,
              cred.latitude,
              cred.longitude,
            );
            if (username.status) {
              // window.localStorage.setItem(
              //   "UID",
              //   username.message.data.indDetail
              // );
              return {
                id: username.message.data.indDetail._id,
                firstname: username.message.data.indDetail.indFirstName,
                lastname: username.message.data.indDetail.indLastName,
                email: username.message.data.indDetail.indEmail,
                image: username.message.data.indDetail.indPic.original,
                accessToken: username.message.data.indDetail.accessToken,
                refreshToken: username.message.data.indDetail.refreshToken,
                providerAccountId: "credentials",
              };
            }
          }
        }

        return null;
      },
      // credentials: undefined
    }),
  ],
} satisfies NextAuthConfig;
