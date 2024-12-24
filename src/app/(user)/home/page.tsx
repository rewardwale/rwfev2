'use client'
import { Suspense } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";
import { Footer } from "@/components/layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthRedirect } from "../watch/hooks/use-auth-redirect";

export default function HomePage() {
 
  const isMobile = useIsMobile();
  return (
    <div className="flex h-screen bg-background">
    { !isMobile && <Sidebar />}

      <div className="flex-1 overflow-hidden">
        <Header />
        <CategoryFilter />
        <Suspense fallback={<div>Loading...</div>}>
          <VideoFeed />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}

//reference needed
