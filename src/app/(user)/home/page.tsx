"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";
import { Footer } from "@/components/layout";
import { useIsMobile } from "@/hooks/use-mobile";
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
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-hidden">
          <div>
            <CategoryFilter onCategoriesChange={handleCategoriesChange} />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <VideoFeed selectedCategories={selectedCategories} />
          </Suspense>
          <div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
