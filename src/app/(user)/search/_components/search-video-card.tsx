"use client";
import React, { useEffect, useState } from "react";
import {
  DashboardCategory,
  Profile,
  videoData,
} from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import UserItem from "./search-user-item";
import { searchReviews } from "@/apis/search";
import VideoCardItem from "./search-video-item";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";


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
          <h2 className="text-base font-semibold tracking-tight max-sm:text-sm">
            Reviews
          </h2>
          <Link
            href={`/searchNew/result/review?i=${searchWord}`}
            className="text-blue-500 max-sm:text-xs"
          >
            See All
          </Link>
        </div>
      </div>

      <div className=" relative">
        <ScrollArea className="w-full whitespace-nowrap   ">
          <div className="flex pb-4 gap-1">
            {videoData.length > 0 || !videoData ? (
              videoData.map((item: videoData, index: number) => (
                <VideoCardItem
                  data={item}
                  key={index}
                  height={1000}
                  width={1000}
                  className="w-[200px]  max-sm:w-[145px] "
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
