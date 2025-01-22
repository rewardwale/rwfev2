"use client";

import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import BookMarkPost from "./list";
import { deleteBookMark, getAllBookMarks } from "@/apis/bookmarks";
import { Button } from "@/components/ui/button";

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
  const [deleteBookmark, setDeleteBookmark] = useState<boolean>(true);
  const [bookmarkList, setBookmarkList] = useState<string[]>([]);
  const [unselect, setUnSelect] = useState<boolean>(false);
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

  const handleBookmarkDelete = async (videoId: string[]) => {
    try {
      const response = await deleteBookMark(videoId);
      if (bookmarks) {
        const tempBookmarks = [...bookmarks.data];
        const newBookmarks = tempBookmarks.filter(
          (bookmark) => !videoId.includes(bookmark.videoId),
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
      <div className="text-2xl mb-2 text-black dark:text-white">
        Bookmarked Reviews
      </div>
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
            <div
              className="flex max-sm:flex-col max-sm:items-start items-center justify-between sm:p-4
                w-full"
            >
              <p className="text-gray-700 max-sm:text-xs dark:text-gray-300 mb-2">
                Total bookmarks : {bookmarks.data.length}
              </p>
              {deleteBookmark && (
                <div className="space-x-2 pb-2">
                  <Button
                    type={"button"}
                    variant={"outline"}
                    className="max-sm:text-xs bg-blue-500 hover:bg-blue-600"
                    onClick={() => {
                      setBookmarkList([]);
                      if (unselect) {
                        setUnSelect(false);
                      } else {
                        setUnSelect(true);
                      }
                    }}
                  >
                    {unselect ? "Un Select All" : "Select All"}
                  </Button>

                  {bookmarkList.length > 0 && (
                    <Button
                      type={"button"}
                      variant={"outline"}
                      className="max-sm:text-xs"
                      disabled={bookmarkList.length === 0}
                      onClick={() => handleBookmarkDelete(bookmarkList)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
                gap-1 md:gap-1.5 mx-auto pb-36"
            >
              {bookmarks.data.map((data) => (
                <BookMarkPost
                  key={data._id}
                  videoData={data}
                  deletebm={deleteBookmark}
                  setDelete={(val: boolean) => setDeleteBookmark(val)}
                  setBookmarkList={(bookmark: string) => {
                    setBookmarkList((prev) => [...prev, bookmark]);
                  }}
                  removeBookmarkList={(id: string) => {
                    setBookmarkList((prevList) =>
                      prevList.filter((item) => item !== id),
                    );
                  }}
                  handleUnSelect={unselect}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
