"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeader = ["/", "/about-us", '/tnc'].includes(pathname);
  const showFooter = ["/about-us", '/tnc','/how-it-works','/contact-us'].includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      {children}
    { showFooter && <Footer />}
    </>
  );
}

