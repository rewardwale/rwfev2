"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreVertical, ThumbsUp, Share2, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation"
import { Review } from "../types/video";

interface VideoCardProps {
  review: Review;
}

export function VideoCard({ review }: VideoCardProps) {
  const router = useRouter();
  // console.log("checking review in videoCard", review.cdnThumbPath[1]);
  return (
    // remove link

    <Card
      className="group overflow-hidden cursor-pointer"
      onClick={() => router.push(`/watch?v=${review.videoId}`)}
    >
      <CardContent className="p-0">
        <div className="relative">
          {/* 9:16 aspect ratio container */}
          <div className="relative pb-[177.78%]">
            <img
              src={review.cdnThumbPath[0]}
              alt={review.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90" />
          </div>

          {/* Overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">
              {review.title}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Avatar className="w-8 h-8 border border-white/20">
                  <AvatarImage src={review.userDetails.indPic.thumbnail} />
                  <AvatarFallback>
                    {review.userDetails.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {review.userDetails.firstName} {review.userDetails.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <span>{review.totalViewCount.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{review.avgRating} ★</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/10"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Add to playlist</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Not interested</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick action buttons */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/20 text-white"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ThumbsUp
                          className={`h-5 w-5 ${review.isLiked ? "fill-current" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{review.totalLikes} likes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/20 text-white"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}

              {/* <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm hover:bg-white/20 text-white"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${review.isBookmarked ? "fill-current" : ""}`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bookmark this Review</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider> */}
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="px-3 py-2 flex flex-wrap gap-1">
          {review.hashtags.map(
            (tag, index) =>
              index < 4 && (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-secondary/50 hover:bg-secondary"
                >
                  {tag}
                </Badge>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

  