import type { Metadata } from "next";
import "./globals.css";
import { notoSans, notoSerif, inter, roboto } from "@/lib/fonts";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ThemeDataProvider from "@/context/theme-data-provider";
import LayoutWrapper from "@/components/layout/layout-wrapper";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata: Metadata = {
  title: "RewardWale - Review honestly Rate diligently Earn Rewards",
  description:
    "Share your experiences about products and services in 2 minute video reviews. Rate business, products and services based on your experience. Engage with your favourite brands 1-on-1. Get rewarded with special offers, cash, coupons and discounts from brands directly",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.className} ${notoSerif.variable} ${inter.variable} ${roboto.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NEXT_PUBLIC_ENV === "uat" ? (
          <meta name="robots" content="noindex" />
        ) : process.env.NEXT_PUBLIC_ENV === "development" ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta
            name="google-site-verification"
            content="DEIRrbWosKczqXEVZHLW-9aDo_oF3p8iqe4Ndl_kPyY"
          />
        )}
      </head>

      <body className="max-sm:overscroll-none">
        <Toaster position="top-center" richColors />
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>
            <LayoutWrapper>
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <div className="container mx-auto">{children}</div>
              </GoogleOAuthProvider>
            </LayoutWrapper>
          </ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
