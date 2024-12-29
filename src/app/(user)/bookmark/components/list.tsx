import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdDelete } from "react-icons/md";

interface Props {
  videoData: {
    cdnThumbPath: string;
    cdnVideoPath: string;
    desc: string;
    srcCdnThumbPath: string;
    title: string;
    videoId: string;
    uploaderRating: {
      rating: number;
      count: number;
    };
    userDetails: {
      indFirstName: string;
      indLastName: string;
      indPic: { thumbnail: string; original: string };
    };
    avgRating: number;
    totalRating: number;
    totalViewCount: number;

    _id: string;
  };
  handleBookmarkDelete: (videoId: string) => void;
}

const BookMarkPost = ({ videoData, handleBookmarkDelete }: Props) => {
  const router = useRouter();
  return (
    <>
      {/* <div
      className="relative hover:cursor-pointer group overflow-hidden"
      style={{
        borderRadius: "18px",
      }}
      onClick={() => router.push("/watch?v=" + videoData.videoId)}
    >
      <video
        autoPlay={false}
        playsInline
        loop
        muted
        className="aspect-[4/6] w-full object-cover group-hover:scale-110 group-hover:brightness-75
          transition-all duration-200"
      >
        <source
          //   src="https://videos.pexels.com/video-files/8531896/8531896-uhd_3840_2160_25fps.mp4"
          src={videoData.cdnVideoPath}
          type="video/mp4"
        />
      </video>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleBookmarkDelete(videoData.videoId);
        }}
        className="absolute right-0 top-0 bg-gray-900/50 p-1 text-white rounded-bl-md
          hover:text-red-500"
      >
        <MdDelete className="size-5" />
      </button>
    </div> */}

      <Card
        className="group overflow-hidden cursor-pointer"
        onClick={() => router.push(`/watch?v=${videoData?.videoId}`)}
      >
        <CardContent className="p-0">
          <div className="relative">
            {/* 9:16 aspect ratio container */}
            <div className="relative pb-[177.78%]">
              <Image
                src={videoData?.cdnThumbPath[0]}
                alt={videoData?.title}
                height={10000}
                width={10000}
                className="absolute inset-0 w-full h-full object-cover transition-transform
                  group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90" />
            </div>

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                {videoData?.title}
              </h3>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* <Avatar className="w-8 h-8 border border-white/20">
                    <AvatarImage src={videoData.userDetails.indPic.original}  />
                    <AvatarFallback>
                      {videoData?.userDetails?.indFirstName[0]}
                    </AvatarFallback>
                  </Avatar> */}
                  <div className="w-8 h-8 border border-white/20 rounded-full">
                    <Avatar >
                      <AvatarImage
                        src={videoData?.userDetails?.indPic?.original}
                        alt={videoData?.title}
                        className="rounded-full h-full w-full"
                      />
                      <AvatarFallback>
                        {" "}
                        {videoData?.userDetails?.indFirstName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {videoData?.userDetails?.indFirstName}{" "}
                      {videoData?.userDetails?.indLastName}
                    </p>
                    <div className="flex items-center gap-1  sm:text-xs text-[8px] 
                     text-white/70">
                      <span>{videoData?.totalViewCount} views</span>
                      <span>•</span>
                      <span>{videoData?.totalRating} ★</span>
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>

            <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkDelete(videoData.videoId);
                    }}
                    className="absolute right-0 top-0 p-1 text-white rounded-bl-md hover:text-red-500"
                  >
                    <MdDelete className="size-5" />
                  </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BookMarkPost;
