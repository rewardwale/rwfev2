"use client";

interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export function VideoPreview({ videoUrl, className = "" }: VideoPreviewProps) {
  if (!videoUrl) return null;

  return (
    <div className={`aspect-[9/16] bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls={false}
        playsInline
        autoPlay
        muted
      />
    </div>
  );
}