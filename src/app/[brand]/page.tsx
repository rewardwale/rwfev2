"use client";
import { animateCards } from "@/lib/animation";
import { Metadata } from "next";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { BrandHeader } from "./components/BrandPageBanner";
import {
  ProfileDataProps,
  VideoData,
} from "../(user)/profile/components/dataTypes";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Separator } from "@radix-ui/react-select";
import ProfileItem from "../(user)/profile/components/profileItem";
import { ScrollBar } from "@/components/ui/scroll-area";
import {
  fetchbusinessPageData,
  fetchBusinessPostsVideos,
  fetchBusinessTaggedVideos,
} from "@/apis/business";
import { useRouter } from "next/navigation";
import { Header } from "../(user)/home/components/header";
import { useIsMobile } from "@/hooks/use-mobile";
import {Sidebar} from "../(user)/home/components/sidebar";
import { Button } from "@/components/ui/button";
import useIsOwner from "@/hooks/use-owner";
import { isUserLoggedIn } from "@/lib/utils";

// import SingleCategoryShorts from "./components/postSection";

interface BrandInfo {
  name: string;
  logo: string;
  // isVerified: boolean;
  rating: number;
  banner: string;
  Id: string;
  isFollow: boolean;
  businessPageOwner: string[];
  rank: number;
  title?: string;
  desc?: string;
  
}

export default function BrandPage({ params }: { params: any }) {
  const resolvedParams = React.useMemo(() => params, [params]);
  const contentRef = useRef<HTMLDivElement>(null);
  // const [userId, setUserId] = useState<any>(null);
  const [count, setCount] = useState<number>(0);
  const [videoData, setvideodata] = useState<VideoData[] | []>([]);
  const [taggedVideo, setTaggedVideo] = useState<VideoData[] | []>([]);
  const [brandInfo, setBrandInfo] = useState<BrandInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [businessId, setBusinessID] = useState("");
  const [selectedTab, setSelectedTab] = useState("posts");
  const [profileData, setProfilePageData] = useState<
    ProfileDataProps | undefined
  >(undefined);

  const fetchBrandDetails = async () => {
    const handle = window.location.pathname.split("/")[1];

    const data = await fetchbusinessPageData(handle);
    setBusinessID(data.data[0]._id);

    const brandData: BrandInfo = {
      name: data.data[0]?.businessName || "Unknown Brand",
      rating: data.data[0]?.avgRating || 0,
      // isVerified: data.data[0]?.isVerified || false, // Add other required properties
      logo: data.data[0].defaultBusinessImage.original || "",
      banner: data.data[0].defaultBusinessBanner.original || "",
      Id: data.data[0]._id,
      businessPageOwner: data?.data[0]?.businessPageOwner || [],
      title : data.data[0]?.title || "Default Title", 
      // isFollow: data.data[0]?.isFollow
      isFollow: false,
      rank: data.data[0]?.rank || 0,
      
      desc: data.data[0]?.desc ?? "Default Description",
      
    };

    if (data.data) {
      setBrandInfo(brandData); // Store a single object
    }
  };

  const isOwner = useIsOwner(brandInfo?.businessPageOwner || []);

  useEffect(() => {
    fetchBrandDetails();
  }, []);

  
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(isUserLoggedIn());
    };

    checkLoginStatus();
  }, []);


  useEffect(() => {
    if (contentRef.current) {
      animateCards(contentRef.current);
    }
  }, []);

  const getPostData = async () => {
    console.log("inside getPostsData");

    try {
      if (businessId) {
        // setCount(count + 10);
        const responseData = await fetchBusinessPostsVideos(
          businessId,
          count + 10,
        );

        let newData = responseData?.data;
        if (newData.length > 0) {
          setvideodata(videoData.concat(newData));
        } else {
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTaggedData = async () => {
    try {
      if (businessId) {
        setCount(count + 10);
        const responseData = await fetchBusinessTaggedVideos(
          businessId,
          count + 10,
        );

        let newData = responseData?.data;
        if (newData.length > 0) {
          setTaggedVideo(taggedVideo.concat(newData));
        } else {
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPostData();
    getTaggedData();
  }, [businessId]);

  const isMobile = useIsMobile();

  // async function handleScrollEventTagged(e: React.UIEvent<HTMLDivElement>) {
  //   if (
  //     e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
  //     e.currentTarget.scrollHeight
  //   ) {
  //     // setCount(count + 10);
  //     await getMoreDatatagged();
  //   }
  // }
  // async function handleScrollEvent(e: React.UIEvent<HTMLDivElement>) {
  //   if (
  //     e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
  //     e.currentTarget.scrollHeight
  //   ) {
  //     // setCount(count + 10);
  //     await getMoreData();
  //   }
  // }

  // const brandInfo = {};

  // Fetch brand data (replace this with API call)
  //   const brandData = {
  //     name: brand,
  //     description: `This is the page for the brand ${brand}.`,
  //   };

  const router = useRouter();



  return (
    <div className="flex h-screen bg-background">
      {/* post section */}

      {isLoggedIn && !isMobile  &&  <Sidebar />}
      <div className="flex-1">
       {isLoggedIn && <Header />}

        <div>
          {brandInfo ? <BrandHeader info={brandInfo} /> : <div>Loading...</div>}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="container">
            <Tabs defaultValue="posts" className="w-full mt-44 md:mt-52 max-sm:mt-80 p-2  font-bold">
              <TabsList className="w-full flex items-center justify-center0 dark:bg-white bg-black dark:text-white text-white rounded-lg ">
                <TabsTrigger
                  value="posts"
                  // style={{
                  //   marginBlock: "5px",
                  // }}
                  onClick={() => setSelectedTab("posts")}
                  className={`max-lg:text-sm text-md min-md:text-base rounded-md m-3 w-full px-2 min-md:m-2 min-md:py-3 ${
                    selectedTab === "posts"
                      ? "bg-white text-black dark:bg-gray-800 dark:text-white"
                      : "bg-black text-gray-200 dark:bg-black dark:text-gray-400"
                  }`}
                  
                >
                  POSTS

                </TabsTrigger>
                <TabsTrigger
                  value="tag"
                  onClick={() => setSelectedTab("tag")}
                  className={`max-lg:text-sm text-md min-md:text-base rounded-md m-3 w-full px-2 min-md:m-2 min-md:py-3 ${
                    selectedTab === "tag"
                      ? "bg-white text-black dark:bg-gray-800 dark:text-white"
                      : "bg-black text-gray-200 dark:bg-black dark:text-gray-400" 
                  }`}
                  
                >
                  TAGGED
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                <Separator />

                {/* Posts Section */}
                <div className="py-6">
                  <div className="flex w-full justify-center">
                    <ScrollArea
                      className="h-full w-full pb-36"
                      // ref={scrollContainerRef}
                      // onScroll={handleScrollEvent}
                    >
                      <div
                        className="flex flex-wrap w-full h-full gap-4 justify-center lg:gap-5"
                        style={{
                          padding: "10px",
                        }}
                      >
                        {videoData.length > 0 || !videoData ? (
                          videoData.map((item: VideoData, index: number) => (
                            <ProfileItem
                              data={item}
                              key={index}
                              height={1000}
                              width={1000}
                              className="w-[127px] h-[200px] max-sm:w-[160px] sm:h-[300px] lg:w-[220px] lg:h-[380px]"
                              aspectRatio="portrait"
                            />
                          ))
                        ) : (
                          <div
                            style={{
                              fontSize: "36px",
                              lineHeight: "24px",
                              fontWeight: "700",
                              display: "flex",
                              gap: "24px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="flex-col w-full text-center"
                          >
                            <span>No Posts Yet</span>
                            {isOwner && (
                              <Button
                                variant="default"
                                style={{
                                  width: "25%",
                                }}
                                onClick={() =>
                                  router.push(
                                    `/post?data=${encodeURIComponent(businessId)}`,
                                  )
                                }
                              >
                                Post now
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tag">
                <Separator />

                {/* Tgged Section */}
                <div className="py-6">
                  <div className="flex w-full justify-center">
                    <ScrollArea
                      className="h-full w-full pb-36"
                      // ref={scrollContainerRef}
                      // onScroll={handleScrollEventTagged}
                    >
                      <div className="flex flex-wrap w-full h-full gap-3 lg:gap-5">
                        {taggedVideo.length > 0 || !taggedVideo ? (
                          taggedVideo.map((item: VideoData, index: number) => (
                            <ProfileItem
                              data={item}
                              key={index}
                              height={1000}
                              width={1000}
                              className="w-[127px] h-[200px] sm:w-[140px] sm:h-[300px] lg:w-[220px] lg:h-[380px]"
                              aspectRatio="portrait"
                            />
                          ))
                        ) : (
                          <div
                            className="w-full text-center"
                            style={{
                              fontSize: "36px",
                              lineHeight: "24px",
                              fontWeight: "700",
                            }}
                          >
                            No Tags Yet
                          </div>
                        )}
                      </div>

                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}

// export default BrandPage;
