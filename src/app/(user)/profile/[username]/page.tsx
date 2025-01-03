"use client";

import { Suspense, useEffect, useState } from "react";
import ProfilePage from "../components/profile-page";

import { fetchProfileData, fetchProfilePosts } from "@/apis/profile";
import { Header } from "../../home/components/header";
import { Sidebar } from "../../home/components/sidebar";
import { Footer } from "@/components/layout";
import SearchInputContainer from "../../search/components/search-Input-component";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [postData, setPostData] = useState([]);

  const isMobile = useIsMobile();

  useEffect(() => {
    const getData = async () => {
      const profileData = await fetchProfileData();
      if (profileData) {
        setData(profileData);
        setUserId(profileData.data._id);
      }
    };
    getData();

    const getPostdata = async () => {
      const postData = await fetchProfilePosts(userId,10);
      if (postData) {
        setPostData(postData?.data);
      }
    };

    userId && getPostdata();
  }, []);

  console.log("checking for profile data", postData);

  const params = {
    username: "Lokesh",
  };

  return (
    <div className="flex h-screen bg-background">
    {!isMobile &&  <Sidebar />}
      <div className="flex-1">
        <Header />
        {/* <div className="flex justify-center w-full"><SearchInputContainer/></div> */}
        <Suspense fallback={<div>Loading...</div>}>
          <ProfilePage profileData={data} />
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}
