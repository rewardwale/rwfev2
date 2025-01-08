"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BookMarkPost from "./list";
import { deleteBookMark, getAllBookMarks } from "@/apis/bookmarks";
import { ScrollBar,ScrollArea } from "@/components/ui/scroll-area";

export type TypeBookmark = {
  count: number;
  data: {
    cdnThumbPath: string;
    cdnVideoPath: string;
    desc: string;
    srcCdnThumbPath: string;
    title: string;
    videoId: string;
    uploaderRating: {
      rating: number;
      count: number;
    };
    userDetails: {
      indFirstName: string;
      indLastName: string;
      indPic: { thumbnail: string; original: string };
    };
    avgRating: number;
    totalRating: number;
    totalViewCount: number;
    _id: string;
  }[];
};

export default function BookMarkComponent() {
  const [bookmarks, setBookmarks] = useState<TypeBookmark | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const handleBackButton = () => {
    router.back();
  };

  const getAllBookmarks = async () => {
    try {
      setIsLoading(true);
      const response = await getAllBookMarks(count);
      setBookmarks(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkDelete = async (videoId: string) => {
    try {
      const response = await deleteBookMark(videoId);
      if (bookmarks) {
        const tempBookmarks = [...bookmarks.data];
        const newBookmarks = tempBookmarks.filter(
          (bookmark) => bookmark.videoId !== videoId,
        );
        setBookmarks({ ...bookmarks, data: newBookmarks });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllBookmarks();
  }, []);

  const getMoreData = async () => {
    try {
      setCount(count + 50);
      const responseData = await getAllBookMarks(count + 50);

      let newData = responseData.data;
      if (newData.length > 0) {
        setBookmarks(newData);
      } else {
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function handleScrollEvent(e: React.UIEvent<HTMLDivElement>) {
    if (
      e.currentTarget.clientHeight + e.currentTarget.scrollTop + 1 >=
      e.currentTarget.scrollHeight
    ) {
      // setCount(count + 10);
      await getMoreData();
    }
  }

  return (
    <div className="w-full h-screen">
      <h2 className="max-sm:text-lg text-2xl font-semibold tracking-tight">
        Bookmarked Reviews
      </h2>

      {isLoading && (
        <div className="flex items-center gap-4 text-black dark:text-white">
          <p>Loading...</p>
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-2">
        Total bookmarks : {bookmarks?.data?.length}
      </p>
      <ScrollArea
        className="h-full w-full pb-48  " 
        ref={scrollContainerRef}
        onScroll={handleScrollEvent}
      >
        <div className="flex flex-wrap w-full h-full overflow-y-scroll  gap-3 scrollbar-hide">
          {bookmarks?.data?.length || 0 > 0 || !bookmarks?.data ? (
            bookmarks?.data.map((data) => (
              <BookMarkPost
                handleBookmarkDelete={handleBookmarkDelete}
                data={data}
                key={data._id}
                height={1000}
                width={1000}
                className="w-[105px] sm:w-[140px] lg:w-[200px]"
                aspectRatio="portrait"
              />
            ))
          ) : (
            <div className="items-center gap-4 flex justify-center text-black dark:text-white">
              <p>You have no bookmarks to show.</p>
            </div>
          )}
        </div>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
