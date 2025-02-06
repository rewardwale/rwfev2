"use client";
import React, { useState } from "react";
import CommunityGuidelines from "./components/CommunityGuidelines";
import Terms from "./components/Terms";

export default function TermsCondition() {
  const [activeTab, setActiveTab] = useState("community"); // Initially set to "community"
  const handleTabClick = (tabName: any) => {
    setActiveTab(tabName);
  };

  return (
    <section className="bg-white dark:bg-zinc-900">
      <div className="md:mt-10">
        <Terms />
      </div>
    </section>
  );
}
