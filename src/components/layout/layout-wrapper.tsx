"use client";

import { usePathname } from "next/navigation";
import {  Footer } from "@/components/layout";
import { Header } from "@/app/(user)/home/components/header";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = ["/", "/about-us", '/tnc','/privacy-policy','/guidelines'].includes(pathname);
  const showFooter = ["/","/about-us", '/tnc','/how-it-works','/contact-us','/privacy-policy','/guidelines'].includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    { showFooter && <Footer />}
    </>
  );
}

