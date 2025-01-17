"use client";
import {
  fetchProfilePosts,
  fetchTaggedVideos,
  followUser,
  unFollowUser,
} from "@/apis/profile";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/co/react-scroll-area";
import {
  Bookmark,
  Grip,
  Star,
  Tag,
  UserCheck,
  UserRoundCheckIcon,
  UserRoundPlusIcon,
  VideoIcon,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProfileItem from "./profileItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FollowersList } from "./followers";
import { ProfileDataProps, VideoData } from "./dataTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialMedia from "./SocialMedia";
import EditProfile from "./edit-profile";
import { FollowingList } from "./following";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import EditProfilePicture from "./profilePicture";

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
  const [videoData, setvideodata] = useState<VideoData[] | []>([]);
  const [taggedVideo, setTaggedVideo] = useState<VideoData[] | []>([]);
  const [count, setCount] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [follower, setFollower] = useState<boolean>();
  const [data, setData] = useState<{
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
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
    SocialUrls: {
      whatsapp: "",
      linkedin: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });
  console.log("profile data::::", profileData);
  useEffect(() => {
    if (profileData) {
      console.log("profile data::1::");
      const data = localStorage.getItem("uib");
      const name = JSON.parse(data || "").userName;
      if (name === profileData.userName) {
        setMyProfile(true);
      }
      init();
      setFollower(profileData?.isFollow || false);
      setFollowerCount(profileData?.totalFollowers);
    }
  }, []);

  const init = async () => {
    try {
      if (profileData?._id) {
        setData((prev) => ({
          ...prev,
          fname: profileData.indFirstName,
          lname: profileData.indLastName,
          desc: profileData.desc,
          title: profileData.title,
          dob: new Date(profileData.indDob),
          gender: profileData.indGender,
          email: profileData?.indEmail,
          phone: profileData?.indMobileNum,
          SocialUrls: {
            whatsapp: profileData?.socialUrls.whatsapp,
            linkedin: profileData?.socialUrls.linkedin,
            facebook: profileData?.socialUrls.facebook,
            instagram: profileData?.socialUrls.instagram,
            twitter: profileData?.socialUrls.twitter,
          },
        }));

        const responseData = await fetchProfilePosts(profileData?._id, count);
        setvideodata(responseData?.data);
        const responseDataTagged = await fetchTaggedVideos(
          profileData?._id,
          count,
        );

        setTaggedVideo(responseDataTagged?.data);
        // setFollower(profileData.isFollow)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMoreData = async () => {
    try {
      if (profileData?._id) {
        console.log("more data!!!");
        setCount(count + 10);
        const responseData = await fetchProfilePosts(
          profileData?._id,
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

  const handleTouchStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = "auto";
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.style.overflow = "hidden";
        }
      }, 3000); // Adjust the delay in milliseconds (e.g., 3000ms = 3 seconds)
    }
  };
  return (
    profileData && (
      <div className="min-h-screen p-4">
        {/* Profile Header Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <Image
              src={
                profileData?.indPic?.original || "https://github.com/shadcn.png"
              }
              width={500}
              height={500}
              alt="Profile Image"
              className="w-180 h-auto sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg"
            />
          </div>

          {/* Profile Details */}
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col px-4">
              <div className="flex gap-6 items-center">
                <p className="font-bold text-lg sm:text-xl md:text-2xl">
                  {data.fname} {data.lname}
                </p>

                <div className="flex gap-3">
                  {!myProfile && (
                    <Button
                      variant={"default"}
                      className="rounded-full w-8 h-8 font-bold"
                      // size={"default"}
                      onClick={async () => {
                        if (follower) {
                          // await  handlefollowUser();
                          await handleUnfollowUser();
                        } else {
                          // await  handleUnfollowUser();
                          await handlefollowUser();
                        }
                      }}
                    >
                      {follower ? (
                        <UserRoundCheckIcon />
                      ) : (
                        <UserRoundPlusIcon />
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
                          Edit profile
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
              </div>

              <div
                style={{
                  paddingBlock: "4px",
                }}
                className="flex items-center gap-4"
              >
                <small className="text-base font-semibold text-gray-500">
                  {profileData?.userName || "Username"}
                </small>
              </div>
            </div>

            <div className="flex text-xs sm:text-base font-semibold text-gray-500">
              {/* <Button
                  variant={"ghost"}
                  // size={"icon"}
                  className="hover:bg-transparent disabled:text-black dark:disabled:text-white"
                  disabled
                >
                  <div className="flex gap-1 text-xs sm:text-base">
                    <span>{profileData?.totalPublishedPosts || 0} </span>
                    <span >Reviews</span>
                  </div>
                </Button> */}

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

            <div className="max-w-[650px] flex flex-col px-4 pb-6">
              <p className="text-sm font-normal sm:text-md md:text-base leading-tight">
                {data?.title}
              </p>
              <p className="text-xs sm:text-sm md:text-md text-muted-foreground mb-2 truncate">
                {data?.desc}
              </p>

              {/* rating */}
              <div className="flex items-center mt-1 gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                    index < Math.round(profileData?.avgRating || 0)
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                ))}
                <span className="text-xs sm:text-sm md:text-base">
                  <span className="text-green-500">
                    {profileData?.avgRating}/5
                  </span>{" "}
                  on{" "}
                  <span className="text-red-500">
                    {profileData?.totalRating || 0}
                  </span>{" "}
                  Ratings
                </span>
              </div>
            </div>
          </div>

          {/* <EditProfilePicture  profileData={profileData}/> */}
          {/* Social Icons */}
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
                  <span>{taggedVideo.length || 0} </span>
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
                  {videoData.length > 0 || !videoData ? (
                    videoData.map((item: VideoData, index: number) => (
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
                    <div className="w-full h-full">no data</div>
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
                  onScroll={handleScrollEvent}
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
    )
  );
};

export default ProfilePage;
