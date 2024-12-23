'use client'

import { Suspense, useEffect, useState } from "react";
import ProfilePage from "../components/profile-page";
import { Sidebar } from "@/app/home/components/sidebar";
import { Header } from "@/app/home/components/header";
import { fetchProfileData } from "@/apis/profile";

export default function HomePage() {

    const [data, setData] = useState<any>(null);
  
      useEffect(() => {
        const getData = async () => {
          const profileData = await fetchProfileData();
          if (profileData) {
            setData(profileData);
          }
        };
        getData();
      }, []);
  
      console.log("checking for profile data", data);

  const params = {
    username: "Lokesh"
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <ProfilePage profileData={data}/>
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}

//reference needed