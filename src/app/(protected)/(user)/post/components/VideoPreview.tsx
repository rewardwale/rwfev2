"use client";

import { useRef, useState } from "react";
import { Play, Pause, VolumeX, Volume2 } from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export function VideoPreview({ videoUrl, className = "" }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
    event.stopPropagation(); // Prevent the mute action from toggling play/pause
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
      className={`relative aspect-[9/16] bg-black rounded-lg overflow-hidden cursor-pointer ${className}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls={false}
        playsInline
        autoPlay
        muted
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {/* Play/Pause and Mute/Unmute icons */}
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
