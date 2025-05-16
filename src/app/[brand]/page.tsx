"use client";

import React, { Suspense, useEffect, useState } from "react";
import { BusinessPage, BusinessPost } from "./types/brands";
import {
  fetchbusinessPageData,
  fetchBusinessPendingPostsVideos,
  fetchBusinessPostsVideos,
  fetchBusinessTaggedVideos,
} from "@/apis/business";
import BusinessHeader from "./components/BusinessHeader";
import BusinessPosts from "./components/BusinessPosts";
import { Header } from "../(user)/home/components/header";
import { isUserLoggedIn } from "@/lib/utils";
import { Sidebar } from "../(user)/home/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isLoggedIn = isUserLoggedIn();
  const isMobile = useIsMobile();

  const [businessData, setBusinessData] = useState<BusinessPage | null>(null);
  const [businessPosts, setBusinessPosts] = useState<BusinessPost[]>([]);
  const [taggedVideos, setTaggedVideos] = useState<BusinessPost[]>([]);
  const [pendingPosts, setPendingPosts] = useState<BusinessPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<{
    business?: string;
    posts?: string;
    tagged?: string;
  } | null>(null);
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get handle from pathname
        const handle = window.location.pathname.split("/")[1] || "Cocobolo"; // Fallback for testing

        // Fetch business page data
        const businessResponse = await fetchbusinessPageData(handle);
        if (businessResponse.data && businessResponse.data.length > 0) {
          const businessData = businessResponse.data[0];
          setBusinessData(businessData);
          setBusinessId(businessData._id);

          // Fetch business posts/videos and tagged videos after getting business ID
          try {
            const postsResponse = await fetchBusinessPostsVideos(
              businessData._id,
            );
            console.log("checking postsResponse data", postsResponse.data);

            if (postsResponse.data) {
              setBusinessPosts(postsResponse.data);
            }
          } catch (err) {
            console.error("Error fetching posts:", err);
            setError((prev) => ({
              ...prev,
              posts: "Failed to load posts. Please try again later.",
            }));
          }

          try {
            const taggedResponse = await fetchBusinessTaggedVideos(
              businessData._id,
            );
            if (taggedResponse.data) {
              setTaggedVideos(taggedResponse.data);
            }
          } catch (err) {
            console.error("Error fetching tagged videos:", err);
            setError((prev) => ({
              ...prev,
              tagged: "Failed to load tagged videos. Please try again later.",
            }));
          }

          try {
            const pendingResponse = await fetchBusinessPendingPostsVideos(
              businessData._id,
            );
            if (pendingResponse.data) {
              setPendingPosts(pendingResponse.data);
            }
          } catch (err) {
            console.error("Error fetching tagged videos:", err);
            setError((prev) => ({
              ...prev,
              tagged: "Failed to load tagged videos. Please try again later.",
            }));
          }
        } else {
          setError((prev) => ({ ...prev, business: "Business not found." }));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError((prev) => ({
          ...prev,
          business: "Failed to load business data. Please try again later.",
        }));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error?.business || !businessData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-4 py-8 max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.business || "Failed to load business data."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background flex-col">
      {isLoggedIn && <Header />}

      <div className="flex overflow-hidden">
        <div>{!isMobile && <Sidebar />}</div>
        <div className="flex-1 overflow-scroll">
          <div>
            <BusinessHeader business={businessData} />
          </div>

          <div className="container">
            {error?.posts ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-800">{error.posts}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              // Update the BusinessPosts import
              <BusinessPosts
                posts={businessPosts}
                reviews={taggedVideos}
                pending={pendingPosts}
                businessName={businessData.businessName}
                isOwnerData={businessData.businessPageOwner}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
