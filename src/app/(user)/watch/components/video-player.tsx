"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideoContext } from "../providers/video-control-provider";
import { rateVideo } from "@/apis/watch";
import { useSearchParams } from "next/navigation";
import { StarRating } from "../../post/components/StarRating";
import Hls from "hls.js";

interface VideoPlayerProps {
  videoUrl?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ videoUrl, autoPlay = false }: VideoPlayerProps) {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } = useVideoContext();
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const isVideoEnded = useRef(false);
  const [rating, setRating] = useState(0);
  const hlsRef = useRef<Hls | null>(null);

  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    // Clean up previous HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Reset video when URL changes
    video.load();

    // Check if the video is HLS (.m3u8)
    if (videoUrl.endsWith('.m3u8')) {
      // Check if HLS is supported
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch((error) => {
              console.error("Autoplay prevented:", error);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Network error, trying to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Media error, trying to recover...");
                hls.recoverMediaError();
                break;
              default:
                console.error("Fatal error, destroying HLS instance...");
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari which has built-in HLS support
        video.src = videoUrl;
      }
    } else {
      // Regular video file (e.g., .mp4)
      video.src = videoUrl;
    }

    // Update progress
    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      isVideoEnded.current = true;
      setShowOverlay(true);
      setCountdown(10);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      video.play().catch((error) => {
        console.error("Autoplay failed:", error);
      });
    } else {
      video.pause();
    }
  }, [autoPlay, videoRef]);

  // Hide controls after video starts playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (showOverlay) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setShowOverlay(false);
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOverlay]);

  const handleRatingChange = async (rating: number) => {
    setRating(rating);
    let payload = {
      rating: rating,
    };
    let res = await rateVideo(videoId, payload);
    if (res) {
      setShowThankYou(true);
    }
    setShowOverlay(false);
    setTimeout(() => setShowThankYou(false), 3000);
  };

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
      onClick={toggleMute}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={false}
        playsInline
        muted={isMuted}
      />

      {/* Top controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity
          duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className="text-white hover:bg-black/30"
        >
          {isMuted ? (
            <VolumeX className="h-12 w-12" />
          ) : (
            <Volume2 className="h-12 w-12" />
          )}
        </div>
      </div>

      {/* Center play/pause button - only shown when controls are visible */}
      <div
        className={
          "absolute top-4 right-4 flex gap-2 transition-opacity duration-300"
        }
      >
        <div
          className="bg-black/30 rounded-full p-4"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center
            text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">Rate this video</h2>
          <StarRating
            value={rating}
            onChange={handleRatingChange}
            type="interactive"
          />
          <p className="text-sm mt-2">
            This overlay will disappear in {countdown} seconds.
          </p>
        </div>
      )}

      {/* Thank you message */}
      {showThankYou && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
          <h2 className="text-2xl font-semibold">Thank you for your rating!</h2>
        </div>
      )}
    </div>
  );
}