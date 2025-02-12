"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";
import { Footer } from "@/components/layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthRedirect } from "../watch/hooks/use-auth-redirect";
import { isUserLoggedIn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const isMobile = useIsMobile();
  const isLoggedIn = isUserLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-hidden">
        <Header />
        <CategoryFilter onCategoriesChange={handleCategoriesChange} />
        <Suspense fallback={<div>Loading...</div>}>
          <VideoFeed selectedCategories={selectedCategories} />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}

//reference needed
