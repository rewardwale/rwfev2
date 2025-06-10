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
import LandingPage from "@/home/landing-page";
import { fetchLandingPageData } from "@/apis/landing-page";

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [landingPageData, setLandingPageData] = useState<any>(null);
  const [loadingLandingPage, setLoadingLandingPage] = useState(true);
  const isMobile = useIsMobile();
  const isLoggedIn = isUserLoggedIn();
  const router = useRouter();

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Fetch landing page data
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLandingPageData();
        if (data) {
          setLandingPageData(data);
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setLoadingLandingPage(false);
      }
    };

    if (isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-background flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <Header />
      </div>

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-scroll scrollbar-hide">
          <Suspense fallback={<div>Loading...</div>}>
            <main
              className="min-h-screen bg-gradient-to-b from-background to-secondary h-full
                overflow-scroll scrollbar-hide"
            >
              {!loadingLandingPage && landingPageData && (
                <div className="mb-8">
                  <LandingPage categoriesData={landingPageData} />
                </div>
              )}
            </main>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
