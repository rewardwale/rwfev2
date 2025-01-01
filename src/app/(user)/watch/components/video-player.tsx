"use client";

import { useEffect, useState } from "react";
import { useVideoContext } from "../providers/video-control-provider";


interface VideoPlayerProps {
  videoUrl?: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const { videoRef, isMuted } = useVideoContext();
  // const { viewCount, incrementViewCount } = useVideoViews();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);


  // const handleVideoEnd = (id: any) => {
  //   incrementViewCount(id);
  //   console.log("checking videourl in videoplayer", viewCount);

  //   if (!isLoggedIn && viewCount >= 2) {
  //     setShowAuthPrompt(true);
  //   }
  // };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    // Reset video when URL changes
    video.load();

    // Try to autoplay
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, [videoUrl, videoRef]);

  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        No video URL provided
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        controls={false}
        loop
        playsInline
        muted={isMuted}
        // onEnded={() => handleVideoEnd(videoId)}
      />
    </div>
  );
}
