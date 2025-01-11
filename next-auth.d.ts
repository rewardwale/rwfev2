import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth;";
import { JWT } from "next-auth/jwt";

// export type ExtendedUser = DefaultSession["user"] & {
//   role: "ADMIN" | "USER";
//   isTwoFactorEnabled: boolean;
//   termsAndCondition: boolean;
// };

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string|undefined;
    firstname:string|undefined;
    lastname:string|undefined;
    email:string|undefined;
    image:string|undefined;
    accessToken: string|undefined;
    refreshToken: string|undefined;
    providerAccountId:string|undefined;
    provider:string|undefined;
  }

  // interface Session {
  //   user: User;
  // }

  interface Session {
    user: {
      id: string|undefined;
      firstname:string|undefined;
      lastname:string|undefined;
      email:string|undefined;
      image:string|undefined;
      accessToken: string|undefined;
      refreshToken: string|undefined;
      providerAccountId:string|undefined;
      provider:string|undefined;
    };
  }

  // interface JWT {
  //   user?: User; // Add your User type as a field in JWT
  // }
}

declare module "next-auth/jwt" {
  // interface JWT {
  //   user?: User;
  // }

  interface JWT {
    id: string|undefined;
    firstname:string|undefined;
    lastname:string|undefined;
    email:string|undefined;
    image:string|undefined;
    accessToken: string|undefined;
    refreshToken: string|undefined;
    providerAccountId:string|undefined;
    provider:string|undefined;
  }
}
