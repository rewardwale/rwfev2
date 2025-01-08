import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdDelete } from "react-icons/md";
import { cn } from "@/lib/utils";
import { videoProps } from "@/lib/searchTypes";
import { Badge } from "@/components/ui/badge";

interface Data{
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


 export interface VideoProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Data;
    width: number;
    height: number;
    aspectRatio: "portrait";
    handleBookmarkDelete: (videoId: string) => void;
  }

  export default function BookMarkPost({
    data,
    height,
    width,
    aspectRatio,
    className,
    handleBookmarkDelete,
    ...props
  }: VideoProps) {
    const router = useRouter();
    return (
    <div className={cn(" relative", className)} {...props}>
        <div className="overflow-hidden relative cursor-pointer" 
        onClick={() => router.push("/watch?v=" + data.videoId)}
  >
          <Image
            src={data.cdnThumbPath[0]}
            alt={data.title}
            width={width}
            height={height}
            className={
              "h-auto w-auto object-cover transition-all hover:scale-105 rounded-md"
            }
          />
       
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-semibold text-xs sm:tex-sm line-clamp-2 mb-2">
                  {data?.title}
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
                          src={data?.userDetails?.indPic?.original}
                          alt={data?.title}
                          className="rounded-full h-full w-full"
                        />
                        <AvatarFallback>
                          {" "}
                          {data?.userDetails?.indFirstName[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
  
                    <div className="flex-1 min-w-0 flex flex-col">
                      <p className="text-xs font-medium truncate">
                        {data?.userDetails?.indFirstName}{" "}
                        {data?.userDetails?.indLastName}
                      </p>
                      <div className="flex items-center gap-1  sm:text-xs text-[5px] 
                       text-white/70">
                        <span>{data?.totalViewCount} views</span>
                        <span>•</span>
                        <span>{data?.totalRating} ★</span>
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
  
              <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkDelete(data.videoId);
                      }}
                      className="absolute right-0 top-0 p-1 text-white rounded-bl-md hover:text-red-500"
                    >
                      <MdDelete className="size-5" />
                    </button>
  
      </div>
    );
  }
  



