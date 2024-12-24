"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";


  return (
    <>
      {isHomePage && <Header />}
      {children}
      {/* {<Footer />} */}
    </>
  );
}
