"use client";

import { useEffect, useState } from "react";
// import { useVideoContext } from "../providers/video-controls-provider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideoContext } from "../providers/video-control-provider";
import { VideoLoading } from "./video-loading";

interface VideoPlayerProps {
  videoUrl?: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } =
    useVideoContext();
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

    // Update progress
    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [videoUrl, videoRef]);

  // Hide controls after video starts playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying]);

  if (!videoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        No video URL provided
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-black group"
      onClick={togglePlay}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        controls={false}
        loop
        playsInline
        muted={isMuted}
      />

      {/* {isLoading && <VideoLoading />} */}

      {/* Center play/pause button - only shown when controls are visible */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity
          duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="bg-black/30 rounded-full p-4">
          {isPlaying ? (
            <Pause className="w-12 h-12 text-white" />
          ) : (
            <Play className="w-12 h-12 text-white" />
          )}
        </div>
      </div>

      {/* Top controls */}
      <div
        className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0" }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-black/30"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
