"use client";
import React, { useEffect, useState } from "react";
import { DashboardCategory, Profile, videoData } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
// import UserItem from "./search-user-item";
import { searchReviews } from "@/apis/search";
import VideoCardItem from "./search-video-item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
// import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
// import { VideoCard } from "../../home/components/video-card";

export default function Video() {
  const [videoData, setvideodata] = useState<videoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const [searchWord, setSearchWord] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchReviews(paramInput, count, 10);
      setvideodata(responseData.data);
      setSearchWord(paramInput);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="space-y-1 flex justify-between w-full">
          <div>
            <h2 className="sm:text-2xl font-semibold tracking-tight text-sm">
              Reviews
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Top picks for you. Updated daily.
            </p>
          </div>

          {videoData.length > 0 && (
            <Button variant={"link"}>
              <Link
                href={`/search/result/review?i=${searchWord}`}
                className="text-blue-500 max-sm:text-xs"
              >
                See All
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex sm:pb-4 gap-4">
            {videoData.length > 0 || !videoData ? (
              videoData.map((item: videoData, index: number) => (
                <VideoCardItem
                  data={item}
                  key={index}
                  height={10000}
                  width={10000}
                  className="w-[130px] md:w-[200px] sm:w-[145px]"
                  aspectRatio="portrait"
                />
              ))
            ) : (
              <div>no data</div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
