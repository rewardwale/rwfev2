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
import { Sidebar } from "../(user)/home/components/sidebar";
import { Button } from "@/components/ui/button";
import useIsOwner from "@/hooks/use-owner";
import { isUserLoggedIn } from "@/lib/utils";

// import SingleCategoryShorts from "./components/postSection";

interface BrandInfo {
  name: string;
  logo: string;
  rating: number;
  banner: string;
  Id: string;
  isFollow: boolean;
  businessPageOwner: string[];
  title?: string;
  desc?: string;
  _id: string;
  custId: string;
  handle: string;
  websiteURLs: string[];
  defaultCommunication: string;
  [key: string]: any; // Allow additional properties for flexibility
}

export default function BrandPage({ params }: { params: any }) {
  const resolvedParams = React.useMemo(() => params, [params]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number>(0);
  const [videoData, setVideoData] = useState<VideoData[] | []>([]);
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

    try {
      const data = await fetchbusinessPageData(handle);
      setBusinessID(data.data[0]._id);

      const brandData: BrandInfo = {
        _id: data.data[0]?._id || "",
        name: data.data[0]?.businessName || "Unknown Brand",
        logo: data.data[0]?.defaultBusinessImage.original || "",
        rating: data.data[0]?.avgRating || 0,
        banner: data.data[0]?.defaultBusinessBanner.original || "",
        Id: data.data[0]?._id || "",
        isFollow: data.data[0]?.isFollow || false,
        businessPageOwner: data.data[0]?.businessPageOwner || [],
        title: data.data[0]?.title || "Default Title",
        desc: data.data[0]?.desc || "Default Description",
        custId: data.data[0]?.custId || "",
        handle: data.data[0]?.handle || "",
        websiteURLs: data.data[0]?.websiteURLs || [],
        // Include other properties if needed
        ...data.data[0],
      };

      if (data.data) {
        setBrandInfo(brandData);
      }
    } catch (error) {
      console.error("Error fetching brand details:", error);
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
    try {
      if (businessId) {
        const responseData = await fetchBusinessPostsVideos(
          businessId,
          count + 10,
        );
        const newData = responseData?.data;

        if (newData.length > 0) {
          setVideoData(videoData.concat(newData));
        }
      }
    } catch (error) {
      console.error("Error fetching post data:", error);
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
        const newData = responseData?.data;

        if (newData.length > 0) {
          setTaggedVideo(taggedVideo.concat(newData));
        }
      }
    } catch (error) {
      console.error("Error fetching tagged data:", error);
    }
  };

  useEffect(() => {
    getPostData();
    getTaggedData();
  }, [businessId]);

  const isMobile = useIsMobile();

  const router = useRouter();

  return (
    <div className="flex h-screen bg-background overflow-scroll">
      {isLoggedIn && !isMobile && <Sidebar />}
      <div className="flex-1">
        {isLoggedIn && <Header />}

        <div>
          {brandInfo ? <BrandHeader info={brandInfo} /> : <div>Loading...</div>}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="container">
            <Tabs
              defaultValue="posts"
              className="w-full mt-44 md:mt-52 max-sm:mt-72 p-2 font-bold"
            >
              <TabsList className="w-full flex items-center justify-center dark:text-white text-white rounded-lg">
                <TabsTrigger
                  value="posts"
                  className={`max-lg:text-sm text-md rounded-md m-3 w-full px-2 ${
                    selectedTab === "posts"
                      ? "text-black dark:bg-gray-800 dark:text-white"
                      : "text-gray-200 dark:bg-black dark:text-gray-400"
                    }`}
                  onClick={() => setSelectedTab("posts")}
                >
                  POSTS
                </TabsTrigger>
                <TabsTrigger
                  value="tag"
                  className={`max-lg:text-sm text-md rounded-md m-3 w-full px-2 ${
                    selectedTab === "tag"
                      ? "text-black dark:bg-gray-800 dark:text-white"
                      : "text-gray-200 dark:bg-black dark:text-gray-400"
                    }`}
                  onClick={() => setSelectedTab("tag")}
                >
                  TAGGED
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <Separator />
                <div className="py-6">
                  <div className="flex w-full justify-center">
                    <ScrollArea className="h-full w-full pb-36">
                      <div
                        className="flex flex-wrap w-full h-full gap-4 lg:gap-5"
                        style={{ padding: "10px" }}
                      >
                        {videoData.length > 0 ? (
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
                            className="w-full text-center"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span>No Posts Yet</span>
                            {isOwner && (
                              <Button
                                variant="default"
                                style={{ width: "25%" }}
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
                <div className="py-6">
                  <div className="flex w-full justify-center">
                    <ScrollArea className="h-full w-full pb-36">
                      <div className="flex flex-wrap w-full h-full gap-3 lg:gap-5">
                        {taggedVideo.length > 0 ? (
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
                          <div className="w-full text-center">No Tags Yet</div>
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
      </div>
    </div>
  );
}
