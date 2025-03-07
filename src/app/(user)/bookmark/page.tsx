"use client";

import { Suspense } from "react";
import { Sidebar } from "../home/components/sidebar";
import BookMarkComponent from "./components/bookmark";
import SearchInputContainer from "../search/components/search-Input-component";
import { Header } from "../home/components/header";
import { useIsMobile } from "@/hooks/use-mobile";

export default function BookMark() {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-hidden ">
          <Suspense fallback={<div>Loading...</div>}>
            <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-8">
              <div className="max-w-7xl mx-auto">
                <BookMarkComponent />
              </div>
            </main>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
