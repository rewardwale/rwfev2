"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BookMarkPost from "./list";
import { deleteBookMark, getAllBookMarks } from "@/apis/bookmarks";

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
    userDetails:{
      indFirstName: string;
      indLastName: string;
      indPic:{thumbnail:string;original:string}
    },
    avgRating:number;
    totalRating:number;
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
console.log(":::::::::::::::::::::::::",bookmarks?.data.length)
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

  return (
    <div
      className="overflow-scroll overflow-x-hidden max-lg:h-screen py-2 px-2 lg:px-6
        lg:h-[calc(100vh-80px)] w-full"
    >
      {/* <div
        className="lg:hidden flex gap-1 cursor-pointer items-center text-gray-600
          dark:text-gray-400 my-2"
        onClick={() => handleBackButton()}
      >
        <FaChevronLeft className="size-4" />
        <p>Back</p>
      </div> */}
      <div className="text-2xl mb-2 text-black dark:text-white">Bookmarked Reviews</div>
      {isLoading && (
        <div className="flex items-center gap-4 text-black dark:text-white">
          <p>Loading...</p>
        </div>
      )}
      {bookmarks &&
        (bookmarks.data.length === 0 ? (
          <div className="items-center gap-4 flex justify-center text-black dark:text-white">
            <p>You have no bookmarks to show.</p>
          </div>
        ) : (
          <div
            style={{
              borderRadius: "12px",
            }}
          >
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Total bookmarks : {bookmarks.data.length}
            </p>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                gap-1 md:gap-1.5 mx-auto"
            >
              {bookmarks.data.map((data) => (
                <BookMarkPost
                  key={data._id}
                  videoData={data}
                  handleBookmarkDelete={handleBookmarkDelete}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
