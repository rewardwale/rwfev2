"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";
import { Footer } from "@/components/layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSession, useSession } from "next-auth/react";
import { useAuthRedirect } from "../watch/hooks/use-auth-redirect";
import { fetchProfileData } from "@/apis/profile";

export default function HomePage() {
  const { data, status, update } = useSession();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    getSession().then((session) => {
      if (session && data?.user.provider==="credentials") {
        if(data?.user.accessToken){
          localStorage.setItem("token",data?.user.accessToken||"")
          init()
        }
      }
    });
  }, []);

  const init=async()=>{
    const token =localStorage.getItem("token")||""
    console.log("::::::::::::::::::::::::::",token.length)
    if(token.length>0){
      const profileInfo = await fetchProfileData()
      if(profileInfo){
        localStorage.setItem("uib",JSON.stringify(profileInfo.data))
      }
    }

  }

  const handleCategoriesChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  console.log("checking selectedCategories", selectedCategories);
  return (
    <>
      {status === "authenticated" && (
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
      )}
    </>
  );
}

//reference needed
