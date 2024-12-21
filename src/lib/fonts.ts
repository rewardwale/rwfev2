import { Inter, Roboto } from "next/font/google";
import localFont from "next/font/local";

const notoSans = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSans-Variable.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSans-Italic-Variable.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-NotoSans",
});

const notoSerif = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSerif-Variable.ttf",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSerif-Italic-Variable.ttf",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-NotoSerif",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700", "900"],
});

export { notoSans, notoSerif, inter, roboto };
