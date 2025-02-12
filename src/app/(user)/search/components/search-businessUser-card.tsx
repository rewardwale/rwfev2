"use client";
import React, { useEffect, useState } from "react";
import { Profile } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
// import UserItem from "./search-user-item";
import { searchBusinessUsers } from "@/apis/search";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MerchantItem from "./search-businessUser-item";
import { Button } from "@/components/ui/button";
// import { followUser } from "@/lib/usersApi/userapi";

export default function BusinessUser() {
  let router = useRouter();
  const [userData, setuserData] = useState<Profile[]>([]);
  const [count, setCount] = useState<number>(0);
  const [searchWord, setSearchWord] = useState<string | null>("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramInput = params.get("i");
      const responseData = await searchBusinessUsers(paramInput, count, 10);
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full sm:mb-4 mb-1">
        <div className="gap-1 flex justify-between items-center w-full">
          <h2 className="text-2xl font-semibold tracking-tight max-sm:text-sm">
            Businesses
          </h2>
          <Button variant={"link"}>
            <Link
              href={`/search/result/merchant?i=${searchWord}`}
              className="text-blue-600 max-sm:text-xs disabled:text-gray-600/50"
            >
              See All
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative">
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {userData.length > 0 || !userData ? (
              userData.map((item: Profile, index: number) => (
                <MerchantItem
                  data={item}
                  key={index}
                  handleFollow={handleFollowMerchants}
                />
              ))
            ) : (
              <div className="max-sm:text-xs w-full text-center">
                Can't Find Any Business with this Keyword
              </div>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
