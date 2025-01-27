"use client";
import React, { useState } from "react";
import CommunityGuidelines from "./components/CommunityGuidelines";
import Terms from "./components/Terms";
import PrivacyPolicay from "./components/PrivacyPolicy";


export default function TermsCondition() {
    const [activeTab, setActiveTab] = useState("community"); // Initially set to "community"
    const handleTabClick = (tabName: any) => {
        setActiveTab(tabName);
    };

    return (
        <section className="bg-white dark:bg-zinc-900">
            <div className="relative flex flex-col justify-center items-center p-4">
                <ul className="flex flex-row items-center gap-2 md:gap-10 mx-4 md:mx-8 text-xs md:text-lg text-neutral-700 dark:text-gray-200  cursor-pointer">
                    <li onClick={() => handleTabClick("community")}>
                        <span className={`${activeTab === "community" ? "active text-[#9466FC] border-b border-violet-200" : ""}`}>
                            Community Guidelines
                        </span>
                    </li>
                    <li onClick={() => handleTabClick("terms")}>
                        <span className={`${activeTab === "terms" ? "text-[#9466FC] border-b border-violet-200" : ""}`}>
                            User Terms and Conditions
                        </span>
                    </li>
                    <li onClick={() => handleTabClick("privacypolicay")}>
                        <span className={`${activeTab === "privacypolicay" ? "text-[#9466FC] border-b border-violet-200" : ""}`}>
                            Privacy Policy
                        </span>
                    </li>
                </ul>
            </div>

            <div className="md:mt-10">
                {activeTab === "community" && <CommunityGuidelines />}
                {activeTab === "terms" && <Terms />}
                {activeTab === "privacypolicay" && <PrivacyPolicay />}
            </div>
        </section>
    );
}
