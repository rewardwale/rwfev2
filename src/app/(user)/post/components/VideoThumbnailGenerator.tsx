"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Grid2X2, Upload, X } from "lucide-react";

interface VideoThumbnailGeneratorProps {
  videoUrl: string;
  selectedThumbnail: string | undefined;
  onThumbnailSelect: (thumbnailUrl: string, blob: Blob) => void;
}

export function VideoThumbnailGenerator({ 
  videoUrl, 
  selectedThumbnail,
  onThumbnailSelect 
}: VideoThumbnailGeneratorProps) {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateThumbnails = async () => {
      const video = document.createElement('video');
      video.src = videoUrl;
      
      await new Promise((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          resolve(true);
        });
      });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return;

      const duration = video.duration;
      const timestamps = [
        duration * 0.25,
        duration * 0.5,
        duration * 0.75,
        duration * 0.9
      ];

      const thumbnailUrls: string[] = [];

      for (const time of timestamps) {
        video.currentTime = time;
        await new Promise((resolve) => {
          video.addEventListener('seeked', resolve, { once: true });
        });

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        thumbnailUrls.push(thumbnailUrl);
      }

      setThumbnails(thumbnailUrls);
      setIsGenerating(false);
    };

    generateThumbnails();
  }, [videoUrl]);

  const handleThumbnailSelect = async (thumbnailUrl: string) => {
    // Convert data URL to Blob
    const response = await fetch(thumbnailUrl);
    const blob = await response.blob();
    onThumbnailSelect(thumbnailUrl, blob);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Grid2X2 className="h-4 w-4" />
        <h3 className="font-medium">Select Cover Photo</h3>
      </div>
      
      {isGenerating ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-video bg-secondary rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {thumbnails.map((thumbnail, index) => (
            <button
              key={index}
              type="button"
              className={`relative aspect-video rounded-lg overflow-hidden hover:ring-2 transition-all ${
                selectedThumbnail === thumbnail ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleThumbnailSelect(thumbnail)}
            >
              <img
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedThumbnail === thumbnail && (
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onThumbnailSelect("", new Blob([]));
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Upload className="h-4 w-4" />
        <p>Or upload your own cover photo</p>
      </div>
    </div>
  );
}