"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoCard } from "./video-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "../types/video";
import { fetchHomePageData } from "@/apis/home";



export function VideoFeed() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        const data = await fetchHomePageData();
        setCategories(data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load content. Please try again later.");
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="pb-[177.78%] relative" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-8.5rem)] flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8.5rem)]">
      {categories.map((category) => (
        category.reviews.length > 0 && (
          <div key={category.categoryId} className="mb-8 mt-6">
            <h2 className="text-2xl font-semibold px-4 mb-4">
              {category.categoryName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4"
         
            >
              {category.reviews.map((review) => (
                <VideoCard key={review._id} review={review} />
              ))}
            </div>
          </div>
        )
      ))}
    </ScrollArea>
  );
}