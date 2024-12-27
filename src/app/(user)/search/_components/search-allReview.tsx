"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  videoData,
} from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import PathBreadCrumbs from "./search-breadCrums";
import { Separator } from "@/components/ui/separator";
import AllVideoCardItem from "./search-allReviews-item";
import {searchReviews} from "@/apis/search"

export default function AllVideo() {
  const [videoData, setvideodata] = useState<videoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const [searchWord, setSearchWord] = useState<string | null>("");
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchReviews(paramInput, count, 50);
      setvideodata(responseData?.data);
      setSearchWord(paramInput);
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      setCount(count + 50);

      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchReviews(paramInput, count + 50, 50);

      let newData = responseData.data;
      if (newData.length > 0) {
        setvideodata(videoData.concat(newData));
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleScrollEvent(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreData();
    }
  }

  return (
    <div className="w-full h-screen">
      <div className=" max-md:px-3 max-md:pt-3">
        <div className="mb-4">
          <PathBreadCrumbs
            path1="home"
            path2="dashBoard"
            path3="Review"
            word={searchWord}
          />
        </div>

        <div className="space-y-1">
          <h2 className="max-sm:text-lg text-2xl font-semibold tracking-tight">
            Reviews
          </h2>
          <p className="text-sm text-muted-foreground max-sm:text-xs">
            Displaying the results for the search word {searchWord}
          </p>
        </div>
      </div>
      <Separator className="my-4" />

      <ScrollArea
        className="h-full w-full   pb-36"
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
      >
        <div className="flex flex-wrap w-full h-full   gap-1">
          {videoData.length > 0 || !videoData ? (
            videoData.map((item: videoData, index: number) => (
              <AllVideoCardItem
                data={item}
                key={index}
                height={1000}
                width={1000}
                className="w-[200px]"
                aspectRatio="portrait"
              />
            ))
          ) : (
            <div>no data</div>
          )}
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}


