"use client";
import React, { useState } from "react";
import CommunityGuidelines from "../tnc/components/CommunityGuidelines";


export default function Page() {
  const [activeTab, setActiveTab] = useState("community"); // Initially set to "community"
  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
  };

  return (
    <section className="bg-white dark:bg-zinc-900">
      <div className="relative flex flex-col justify-center items-center p-4">
        <ul
          className="flex flex-row items-center gap-2 md:gap-10 mx-4 md:mx-8 text-xs md:text-lg
            text-neutral-700 dark:text-gray-200 cursor-pointer"
        >
     
        </ul>
      </div>

      <div className="md:mt-10">
        <CommunityGuidelines />
      </div>
    </section>
  );
}
