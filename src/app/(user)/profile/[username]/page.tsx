"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import ProfilePage from "../components/profile-page";

import { othersProfileData } from "@/apis/profile";
import { Header } from "../../home/components/header";
import { Sidebar } from "../../home/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { Footer } from "react-day-picker";

export default function OthersPage() {
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [postData, setPostData] = useState([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const pathName = usePathname();

  const isMobile = useIsMobile();
  const init = async () => {
    const path = pathName.split("/");
    const profileData = await othersProfileData(path[path.length - 1] || "");
    setData(profileData.data.userInfo);
    setUserId(profileData.data.userInfo._id);
  };

  useEffect(() => {
    init();
  }, []);

  // const params = {
  //   username: "Lokesh",
  // };

  const handleTouchStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "auto";
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.overflow = "hidden";
        }
      }, 10000); // Adjust the delay in milliseconds (e.g., 3000ms = 3 seconds)
    }
  };

  return (
    <div className="flex h-screen bg-background flex-col">
      <Header />

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div
          className={`flex-1 ${isMobile ? "overflow-scroll" : "overflow-hidden"} scrollbar-hide`}
        >
          <Suspense fallback={<div>Loading...</div>}>
            {data && <ProfilePage profileData={data} id={userId} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
