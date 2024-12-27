"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";
import { Footer } from "@/components/layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthRedirect } from "../watch/hooks/use-auth-redirect";
import {
  searchBusinessUsers,
  searchNonBusinessUsers,
  searchReviews,
} from "@/apis/search";
import { useRouter } from "next/navigation";

interface SearchResult {
  _id: string;
  userDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    isFollowed: boolean;
  };
  videoId: string;
  hashtags: string[];
  title: string;
  uploaderRating: {
    "1": {
      value: string;
      rating: number;
    };
  };
  desc: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  totalShareCount: number;
  totalLikes: number;
  totalComments: number;
  status: string;
  avgRating: number;
  isLiked: boolean;
  isDisliked: boolean;
  isBookmarked: boolean;
}

export default function HomePage() {
  const [input, setinput] = useState("");
  const router = useRouter()

  const handleEnterPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push("/search/dashboard?i=" + input);
      // location.href = "/search/dashboard?i=" + input;
    }
  };

  const handleSearchOnClick = (e: any) => {
    e.preventDefault();
    router.push("/search/dashboard?i=" + input);
    // location.href = "/search/dashboard?i=" + input;
  };

  const isMobile = useIsMobile();
  return (
    <div className="flex h-screen bg-background">
      {!isMobile && <Sidebar />}

      <div className="flex-1 overflow-hidden">
        <Header
          handleEnterPress={handleEnterPress}
          handleSearchOnClick={handleSearchOnClick}
          handleSearchInput={(value: string) => setinput(value)}
        />
        <CategoryFilter />
        <Suspense fallback={<div>Loading...</div>}>
          <VideoFeed />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}

//reference needed
