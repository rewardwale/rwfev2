import NextAuth, { DefaultSession } from "next-auth";
// import GitHub from "next-auth/providers/github";
import authConfig from "./auth.config";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  //if uncomment pages and events that redirecting to another page will go
  pages: {
    signIn: "/login",
    // error: "/error",
  },
  // events: {
  //   async linkAccount({ user }) {
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() }, //verifying email through google or github
  //     });
  //   },
  // },
  callbacks: {
    // 1. Called during sign-in attempt
    async signIn({ user, account, profile }) {
      // console.log("Account*:", account, "profile**", profile, "user**", user);

      if (account?.provider !== "credentials") {
        return true;
      }

      if (user) {
        // Add any custom validation here

        return true;
      }

      return false;
    },

    // 2. Called when creating JWT token
    async jwt({ token, user, trigger, account, profile }) {
      // console.log(
      //   "Account-1-*:",
      //   account,
      //   "profile**",
      //   profile,
      //   "user**",
      //   user,
      //   "token**",
      //   token,
      // );
      // Only add user data to token on sign in

      if (user) {
        if (account?.provider !== "credentials") {
          token.id = user?.id;
          token.accessToken = account?.id_token;
          token.firstname = profile?.given_name || "default";
          token.lastname = profile?.family_name || "default";
          token.email = profile?.email || "";
          token.image = profile?.picture || "";
          token.refreshToken = account?.access_token;
          token.providerAccountId = account?.providerAccountId;
          token.provider=account?.provider
        } else {
          token.id = user?.id;
          token.accessToken = user.accessToken;
          token.firstname = user.firstname || "default";
          token.lastname = user.lastname;
          token.email = user.email || "";
          token.image = user.image || "";
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.providerAccountId = user.providerAccountId;
          token.provider="credentials"
        }
      }

      return token;
    },

    // 3. Called whenever session is checked
    async session({ session, token, user, trigger }) {
      // console.log("Account-2-*:", session, "user**", user, "token**", token);
      // Ensure session user data matches token
      if (token) {
        session.user.id = token.id||"";
        session.user.email = token.email||"";
        session.user.accessToken = token.accessToken;
        session.user.firstname = token.firstname;
        session.user.lastname = token.lastname;
        session.user.image = token.image;
        session.user.refreshToken = token.refreshToken;
        session.user.providerAccountId = token.providerAccountId;
        session.user.provider=token?.provider
      }

      return session;
    },
  },

  // events: {
  //   async signIn({ user, account, isNewUser }) {
  //     console.log("🟢 [Event] signIn", {
  //       time: new Date().toISOString(),
  //       userId: user.id,
  //       provider: account?.provider,
  //       isNewUser,
  //     });
  //   },

  //   async signOut() {
  //     console.log("🟢 [Event] signOut", {
  //       time: new Date().toISOString(),
  //     });
  //   },

  //   async session({ session, token }) {
  //     console.log("🟢 [Event] session", {
  //       time: new Date().toISOString(),
  //     });
  //   },
  // },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  ...authConfig,
});
