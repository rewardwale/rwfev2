"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, VolumeX, Volume2 } from "lucide-react";
import Hls from "hls.js";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export function VideoPreview({ videoUrl, className = "" }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  console.log("checking video urlss", videoUrl)

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const initializeVideo = () => {
      if (videoUrl.includes(".m3u8")) {
        // HLS playback
        if (Hls.isSupported()) {
          if (hlsRef.current) {
            hlsRef.current.destroy();
          }

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });

          hls.attachMedia(videoRef.current!);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(videoUrl);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log("Network error, trying to recover...");
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log("Media error, trying to recover...");
                  hls.recoverMediaError();
                  break;
                default:
                  console.error("Unrecoverable error");
                  hls.destroy();
                  break;
              }
            }
          });

          hlsRef.current = hls;
        } else if (
          videoRef.current!.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Native HLS support (Safari)
          videoRef.current!.src = videoUrl;
        }
      } else {
        // Regular video playback
        videoRef.current!.src = videoUrl;
      }
    };

    initializeVideo();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  if (!videoUrl) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  return (
    <div
      onClick={handleVideoClick}
      className={`relative aspect-[9/16] bg-black rounded-lg overflow-hidden cursor-pointer
        ${className}`}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={false}
        playsInline
        autoPlay
        muted
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Play size={48} className="text-white" />
        </div>
      )}
      <div className="absolute bottom-4 left-4 z-20 flex space-x-4">
        <div
          onClick={toggleMute}
          className="p-2 rounded-full bg-gray-700 bg-opacity-75 text-white"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </div>
      </div>
    </div>
  );
}
