"use client";
import {
  fetchProfilePosts,
  fetchTaggedVideos,
  followUser,
  postShareUrl,
  unFollowUser,
} from "@/apis/profile";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/co/react-scroll-area";
import {
  Share2Icon,
  UserRoundCheckIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import ProfileItem from "./profileItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FollowersList } from "./followers";
import { ProfileDataProps, VideoData } from "./dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfile from "./edit-profile";
import { FollowingList } from "./following";
import EditProfilePicture from "./profilePicture";
import { isUserLoggedIn } from "@/lib/utils";
import AuthModal from "@/components/ui/AuthModal";
import SocialMedia from "./SocialMedia";

export async function generateMetadata(
  profileData: ProfileDataProps,
): Promise<Metadata> {
  const username = profileData.indFirstName;
  return {
    title: `${username}'s Profile | Rewardwale`,
    description: `View the profile of ${username} on Rewardwale.`,
  };
}

interface Props {
  profileData: ProfileDataProps | undefined;
  id: string;
}

const ProfilePage = ({ profileData, id }: Props) => {
  const isLoggedIn = isUserLoggedIn();
  const [videoData, setvideodata] = useState<VideoData[] | []>([]);
  const [taggedVideo, setTaggedVideo] = useState<VideoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [follower, setFollower] = useState<boolean>();
  const [shareLink, setShareLink] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Replace the existing data state definition with:
  const [data, setData] = useState<{
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
    profileImage: string;
    userName: string;
    location: string;
    interest: string;
    categoryPref: string[];
    SocialUrls: {
      whatsapp: string;
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
    };
  }>({
    fname: "",
    lname: "",
    desc: "",
    title: "",
    dob: new Date(),
    gender: "",
    email: "",
    phone: "",
    profileImage: "",
    userName: "",
    location: "",
    interest: "",
    categoryPref: [],
    SocialUrls: {
      whatsapp: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      const data = localStorage.getItem("uib");

      // Safe parsing of JSON
      let parsedData;
      try {
        parsedData = data ? JSON.parse(data) : null; // Ensure it's valid JSON
      } catch (error) {
        console.error("Error parsing localStorage 'uib':", error);
        parsedData = null;
      }

      // Check if parsedData exists before accessing properties
      if (parsedData?.userName === profileData.userName) {
        setMyProfile(true);
      }

      isLoggedIn && init();
      setFollower(profileData?.isFollow || false);
      setFollowerCount(profileData?.totalFollowers);
    }
  }, []);

  const init = async () => {
    try {
      if (profileData?._id) {
        setData((prev) => ({
          ...prev,
          // Personal Info
          fname: profileData.indFirstName,
          lname: profileData.indLastName,
          userName: profileData.userName, // Added
          location: profileData.location || "", // Added (assuming this comes from videoLocation.locationName)
          interest: profileData.interest || "", // Added
          categoryPref: profileData.indCategories || [], // Added

          // Profile Info
          desc: profileData.desc,
          title: profileData.title,
          dob: new Date(profileData.indDob),
          gender: profileData.indGender,
          email: profileData?.indEmail,
          phone: profileData?.indMobileNum,
          profileImage: profileData?.indPic.original,

          // Social URLs
          SocialUrls: {
            whatsapp: profileData?.socialUrls?.whatsapp || "", // Added
            linkedin: profileData?.socialUrls?.linkedin || "", // Added
            facebook: profileData?.socialUrls?.facebook || "", // Added
            instagram: profileData?.socialUrls?.instagram || "", // Added
            twitter: profileData?.socialUrls?.twitter || "", // Added
          },
        }));

        const responseData = await fetchProfilePosts(profileData?._id, count, 1);
        setvideodata(responseData?.data);
        const responseDataTagged = await fetchTaggedVideos(
          profileData?._id,
          count,
        );
        setTaggedVideo(responseDataTagged?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      if (profileData?._id) {
        setCount(count + 10);
        const responseData = await fetchProfilePosts(
          profileData?._id,
          count + 10,
          1
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

  async function handleScrollEvent(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreData();
    }
  }

  const getMoreDatatagged = async () => {
    try {
      if (profileData?._id) {
        setCount(count + 10);
        const responseData = await fetchTaggedVideos(
          profileData?._id,
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

  async function handleScrollEventTagged(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreDatatagged();
    }
  }

  const handleUnfollowUser = async () => {
    const response = await unFollowUser(profileData?._id || "");
    if (response.message === "Success.") {
      setFollower(false);
      setFollowerCount(followerCount - 1);
      init();
    }
  };

  const handlefollowUser = async () => {
    const response = await followUser(profileData?._id || "");
    if (response.message === "Success.") {
      setFollower(true);
      setFollowerCount(followerCount + 1);
      init();
    }
  };
  const reload = (
    fname: string,
    lname: string,
    desc: string,
    title: string,
    dob: Date,
    gender: string,
    email: string | undefined,
    phone: string | undefined,
    whatsapp: string,
    linkedin: string,
    facebook: string,
    instagram: string,
    twitter: string,
  ) => {
    if (profileData) {
      setData((prev) => ({
        ...prev,
        fname: fname,
        lname: lname,
        desc: desc,
        title: title,
        dob: new Date(dob),
        gender: gender,
        email: email,
        phone: phone,
        SocialUrls: {
          whatsapp: whatsapp,
          linkedin: linkedin,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
        },
      }));
    }
  };

  const imageReload = (profileImage: string) => {
    if (profileData) {
      setData((prev) => ({
        ...prev,
        profileImage: profileImage,
      }));
    }
  };

  const handleTouchStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "auto";
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.overflow = "hidden";
        }
      }, 10000); // Adjust the delay in milliseconds (e.g., 3000ms = 3 seconds)
    }
  };

  const handleShareFunctionality = async () => {
    const path = "/profile/" + profileData?.userName;
    const urlShortner = await postShareUrl(path);
    setShareLink(urlShortner?.data.shortUrl);
  };

  const handleFollow = async () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else if (follower) {
      await handleUnfollowUser();
    } else {
      await handlefollowUser();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this video",
          text: "I found this interesting video. Take a look!",
          url: `${window.location.href + "/" + profileData?.userName}`,
        });
      } catch (error) {
        console.log("Error sharing content:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log("Web Share API not supported");
      // You can implement a custom share dialog here
      alert(
        "Sharing is not supported on this browser. You can copy the URL to share.",
      );
    }
  };

  return (
    profileData && (
      <>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        <div className="p-4">
          {/* Profile Header Section */}
          <div className="flex flex-col sm:flex-row items-start">
            {/* Profile Image */}

            <div className="flex-shrink-0 relative">
              <Image
                src={profileData?.indPic.thumbnail}
                width={500}
                height={500}
                alt="Profile Image"
                className="w-180 h-auto sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg"
              />
              {myProfile && (
                <div className="absolute -bottom-1 -right-1">
                  <EditProfilePicture
                    profileData={data}
                    imageReload={imageReload}
                  />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 sm:flex-1 mt-4 sm:mt-0">
              <div className="col-span-1 flex items-end align-baseline gap-2 px-4">
                <p className="dark:text-white font-bold text-lg sm:text-xl md:text-2xl">
                  {data.fname} {data.lname}
                </p>
              </div>

              <div className="col-span-1 flex items-end align-baseline gap-2 px-4">
                <small className="text-base font-semibold text-gray-500">
                  {profileData?.userName || "Username"}
                </small>
              </div>

              <div className="flex col-span-1 pb-1 text-xs sm:text-base font-semibold text-gray-500">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      // size={"icon"}
                      className="hover:bg-transparent"
                      disabled={!follower && !myProfile}
                    >
                      <div className="flex gap-2 text-xs sm:text-base">
                        <span>{followerCount}</span>
                        <span>Follower</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  {(follower || myProfile) && (
                    <FollowersList
                      id={profileData._id}
                      usern={profileData.userName}
                      followers={follower || myProfile}
                    />
                  )}
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"ghost"}
                      // size={"icon"}
                      className="hover:bg-transparent"
                      disabled={!follower && !myProfile}
                    >
                      <div className="flex gap-1 text-xs sm:text-base">
                        <span> {profileData?.totalFollowing || 0}</span>
                        <span>Followings</span>
                      </div>
                    </Button>
                  </DialogTrigger>
                  {(follower || myProfile) && (
                    <FollowingList
                      id={profileData._id}
                      usern={profileData.userName}
                      followers={follower || myProfile}
                    />
                  )}
                </Dialog>
              </div>

              <div
                style={{
                  paddingBlock: "4px",
                }}
                className="flex items-end gap-2 px-4 col-span-1"
              >
                <div className="flex items-center">
                  {!myProfile && (
                    <Button
                      variant={"default"}
                      className="font-bold"
                      size={"default"}
                      onClick={() => {
                        handleFollow();
                      }}
                    >
                      {follower ? (
                        <>
                          <UserRoundCheckIcon /> <small>Following</small>
                        </>
                      ) : (
                        <>
                          <UserRoundPlusIcon />
                          <small>Follow</small>
                        </>
                      )}
                    </Button>
                  )}

                  {myProfile && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="hover:bg-transparent font-bold hover:underline"
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <EditProfile
                        profileData={profileData}
                        data={data}
                        reload={reload}
                      />
                    </Dialog>
                  )}
                </div>
                {/* <ShareLinkModal
                  shareLink={handleShareFunctionality}
                  link={shareLink}
                /> */}
                <div
                  style={{
                    border: "1px solid rgb(52,52,52,1)",
                    borderRadius: "6px",
                    padding: "6px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleShare}
                >
                  Share <Share2Icon size={16} />
                </div>
              </div>

              <div className="max-w-[650px] col-span-1 flex flex-col px-4">
                <p className="text-sm font-normal sm:text-md md:text-base leading-tight">
                  {data?.title}
                </p>
                <p className="text-xs sm:text-sm md:text-md text-muted-foreground mb-2 truncate">
                  {data?.desc}
                </p>
              </div>

              {/* rating */}
              <div className="flex items-center mt-1 gap-2 px-4 pb-2">
                {/* {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                  index < Math.round(profileData?.avgRating || 0)
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                />
              ))} */}
                <span className="text-xs sm:text-sm md:text-base">
                  <span className="text-green-500">
                    {profileData?.avgRating
                      ? (Math.round(profileData.avgRating * 10) / 10).toFixed(1)
                      : "0.0"}
                    /5
                  </span>{" "}
                  on{" "}
                  <span className="text-red-500">
                    {profileData?.totalRating || 0}
                  </span>{" "}
                  Ratings
                </span>
              </div>
            </div>

            <SocialMedia profileData={data} />
          </div>

          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full flex items-center justify-center bg-black">
              <TabsTrigger
                value="posts"
                className="text-xs sm:text-sm md:text-base w-full text-gray-200"
              >
                POSTS (
                {
                  <div className="flex gap-1 text-xs sm:text-base">
                    <span>{profileData?.totalPublishedPosts || 0} </span>
                    {/* <span >Reviews</span> */}
                  </div>
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="tag"
                className="text-xs sm:text-sm md:text-base w-full text-gray-200"
              >
                TAG (
                {
                  <div className="flex gap-1 text-xs sm:text-base">
                    <span>{taggedVideo?.length || 0} </span>
                    {/* <span >Reviews</span> */}
                  </div>
                }
                )
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Separator className="my-4" />

              {/* Posts Section */}
              <div className="py-6">
                <div className="flex w-full justify-center">
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-1 gap-y-1
                      h-[700px]"
                    ref={scrollContainerRef}
                    onScroll={handleScrollEvent}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.overflow = "auto")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.overflow = "hidden")
                    }
                    onTouchStart={handleTouchStart}
                  >
                  {videoData?.length > 0 || !videoData ? (
                      videoData.map((item: VideoData, index: number) => (
                        <ProfileItem
                          data={item}
                          key={index}
                          height={1000}
                          width={1000}
                          className="min-w-[130px] max-w-[300px] s:min-w-[260px] sm:max-w-[290px] h-[250px]
                            md:h-[350px] lg:h-[400px] xl:h-[450px]"
                          aspectRatio="portrait"
                        />
                      ))
                    ) : (
                      <div className="w-full h-full">
                        {!isLoggedIn ? "Login to See Profile" : "No posts Yet"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tag">
              <Separator className="my-4" />

              {/* Tgged Section */}
              <div className="py-6">
                <div className="flex w-full justify-center">
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                      gap-x-1 gap-y-1 h-[700px]"
                    ref={scrollContainerRef}
                    onScroll={handleScrollEventTagged}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.overflow = "auto")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.overflow = "hidden")
                    }
                    onTouchStart={handleTouchStart}
                  >
                    {taggedVideo.length > 0 || !taggedVideo ? (
                      taggedVideo.map((item: VideoData, index: number) => (
                        <ProfileItem
                          data={item}
                          key={index}
                          height={1000}
                          width={1000}
                          className="min-w-[130px] max-w-[290px] s:min-w-[240px] sm:max-w-[290px] h-[250px]
                            md:h-[350px] lg:h-[400px] xl:h-[450px]"
                          aspectRatio="portrait"
                        />
                      ))
                    ) : (
                      <div className="w-full h-[700px]">no data</div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    )
  );
};

export default ProfilePage;
