"use client";
import React, { useEffect, useRef, useState } from "react";
import { Profile } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { searchBusinessUsers } from "@/apis/search";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AllMerchantItem from "./search-allMerchant-item";
import PathBreadCrumbs from "./search-breadCrums";
// import { followUser } from "@/apis/search";

export default function AllBusinessUser() {
  let router = useRouter();
  const [userData, setuserData] = useState<Profile[]>([]);
  const [count, setCount] = useState<number>(0);
  const [searchWord, setSearchWord] = useState<string | null>("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchBusinessUsers(paramInput, count, 60);
      setSearchWord(paramInput);
      setuserData(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowMerchants = async (id: string) => {
    try {
      // const request = await followUser(id);
      const index = userData.findIndex((item: Profile) => item._id === id);
      const newData = userData;
      newData[index] = {
        ...newData[index],
        isFollow: true,
      };
      setuserData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      setCount(count + 60);

      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchBusinessUsers(
        paramInput,
        count + 60,
        60
      );

      let newData = responseData;
      if (newData.length > 0) {
        setuserData(userData.concat(newData));
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
            path3="Merchants"
            word={searchWord}
          />
        </div>

        <div className="space-y-1">
          <h2 className="max-sm:text-lg text-2xl font-semibold tracking-tight">
            Merchants
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
        {/* <div className="flex flex-wrap w-full h-full   gap-1"> */}
        {userData?.length > 0 || !userData ? (
          userData.map((item: Profile, index: number) => (
            <AllMerchantItem
              data={item}
              key={index}
              handleFollow={handleFollowMerchants}
            />
          ))
        ) : (
          <div>no data</div>
        )}
        {/* </div> */}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
