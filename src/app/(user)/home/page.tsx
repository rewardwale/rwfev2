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
import PushNotifications from "@/components/PushNotification";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const isMobile = useIsMobile();
  const isLoggedIn = isUserLoggedIn();
  const router = useRouter();



  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <PushNotifications />

      <div className="flex scrollbar-hide">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-hidden scrollbar-hide">
          <div>
            <CategoryFilter onCategoriesChange={handleCategoriesChange} />
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <VideoFeed selectedCategories={selectedCategories} />
          </Suspense>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
