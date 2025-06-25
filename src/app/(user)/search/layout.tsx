"use client";
import { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "../home/components/sidebar";
import { Header } from "../home/components/header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SearchLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      {/* {!isMobile && <Sidebar />} */}
      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>

        <Suspense fallback={<div>Loading...</div>}>
          <main
            className="min-h-screen bg-gradient-to-b from-background to-secondary p-8 h-full
              overflow-scroll scrollbar-hide w-full"
          >
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </Suspense>
      </div>
    </div>
  );
}
