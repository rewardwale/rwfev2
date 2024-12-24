"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useVideoContext } from "../providers/video-control-provider";
import { RatingModal } from "./rating-modal";
import { fetchVideoDetails } from "@/apis/watch";

export function VideoPlayer() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");
  const { videoRef, isPlaying, isMuted, togglePlay } = useVideoContext();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoId) return;

    const handleVideoEnd = () => {
      setShowRating(true);
    };

    video.addEventListener("ended", handleVideoEnd);
    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [videoId, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (isPlaying) {
      video.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, videoUrl, videoRef]);

  useEffect(() => {
    const getData = async () => {
      if (videoId) {
        const watchdata = await fetchVideoDetails(videoId);
        if (watchdata) {
          setVideoUrl(watchdata?.data?.cdnVideoPath);
          
        }
      }
    };

    getData();
  }, [videoId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && videoUrl && !isPlaying) {
      video.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, [videoUrl, videoRef, isPlaying]);

  const handleRatingSubmit = (rating: number) => {
    // TODO: Implement API call to submit rating
    console.log(`Submitted rating: ${rating}`);
    setShowRating(false);
  };

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        No video URL provided
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          playsInline
          muted={isMuted}
          autoPlay
        />
      )}
      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
