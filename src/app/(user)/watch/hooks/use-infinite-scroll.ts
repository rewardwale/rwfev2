"use client";

import { useState, useEffect } from "react";
import { Video } from "../types/video";
import { apiClient } from "@/lib/apiClient";
import { isUserLoggedIn } from "@/lib/utils";

interface ApiResponse {
  message: string;
  data: {
    count: number;
    data: Video[];
  };
}

interface UseInfiniteVideosReturn {
  videos: Video[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  mergeVideos: (newVideos: Video[]) => void; // Add this
}

export function useInfiniteVideos(
  categoryId: string,
  initialVideo: Video | null,
): UseInfiniteVideosReturn {
  const [videos, setVideos] = useState<Video[]>(
    initialVideo ? [initialVideo] : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [skip, setSkip] = useState(0);

  const fetchVideos = async () => {
    if (!categoryId || loading || !hasMore) return;

    if (!isUserLoggedIn()) {
      setError("Please login to view videos");
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: "10",
        skip: skip.toString(),
        radius: "0",
      });

      const payload = {
        categoryIds: [categoryId],
      };

      const response = await apiClient<ApiResponse>(
        `/videoUsingCategoryId?${queryParams.toString()}`,
        "POST",
        payload,
      );

      if (response.success && response.data?.data?.data) {
        const newVideos = response.data.data.data;
        if (Array.isArray(newVideos)) {
          // Filter out duplicates and initial video
          const uniqueVideos = newVideos.filter((video) => {
            const isDuplicate = videos.some((v) => v.videoId === video.videoId);
            const isInitial = initialVideo?.videoId === video.videoId;
            return !isDuplicate && !isInitial;
          });

          setVideos((prev) => [...prev, ...uniqueVideos]);
          setHasMore(newVideos.length === 10);
          setSkip((prev) => prev + 10);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load videos");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && initialVideo) {
      // Reset state when category changes
      setVideos([initialVideo]);
      setSkip(0);
      setHasMore(true);
      setCurrentIndex(0);
      fetchVideos();
    }
  }, [categoryId, initialVideo]);

  const loadMore = async () => {
    await fetchVideos();
  };

  const mergeVideos = (newVideos: Video[]) => {
    const uniqueVideos = newVideos.filter(
      (video) => !videos.some((v) => v.videoId === video.videoId),
    );
    setVideos((prev) => [...prev, ...uniqueVideos]);
  };

  return {
    videos,
    loading,
    error,
    hasMore,
    loadMore,
    currentIndex,
    setCurrentIndex,
    mergeVideos,
  };
}
