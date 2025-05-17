"use client";

import React, { use, useState } from "react";
import { BusinessPost } from "../types/brands";
import { useRouter } from "next/navigation";
import useIsOwner from "@/hooks/use-owner";

interface BusinessPostsProps {
  posts: BusinessPost[];
  reviews: BusinessPost[];
  pending: BusinessPost[];
  businessName: string;
  isOwnerData: string[];
}

const BusinessPosts: React.FC<BusinessPostsProps> = ({
  posts,
  reviews,
  pending,
  businessName,
  isOwnerData,
}) => {
  const [selectedTab, setSelectedTab] = useState<
    "posts" | "reviews" | "pending"
  >("posts");

  const router = useRouter();
  const isOwner = useIsOwner(isOwnerData);

  console.log("isOwner", isOwner);

  const EmptyState = ({
    icon,
    title,
    message,
  }: {
    icon: React.ReactNode;
    title: string;
    message: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md">{message}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-6 py-3 text-base font-medium ${
            selectedTab === "posts"
              ? "border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-700"
            }`}
          onClick={() => setSelectedTab("posts")}
        >
          Posts
        </button>
        <button
          className={`px-6 py-3 text-base font-medium ${
            selectedTab === "reviews"
              ? "border-b-2 border-gray-900"
              : "text-gray-400 hover:text-gray-700"
            }`}
          onClick={() => setSelectedTab("reviews")}
        >
          Reviews
        </button>
        {isOwner && (
          <button
            className={`px-6 py-3 text-base font-medium ${
            selectedTab === "pending"
                ? "border-b-2 border-gray-900"
                : "text-gray-400 hover:text-gray-700"
            }`}
            onClick={() => setSelectedTab("pending")}
          >
            Pending Approvals
          </button>
        )}
      </div>

      {/* Posts Grid */}
      {selectedTab === "posts" &&
        (posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group relative rounded-xl overflow-hidden aspect-[9/16] shadow-md
                  hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/watch?v=${post.videoId}`)}
              >
                {/* Thumbnail */}
                <img
                  src={post.cdnThumbPath[0] || ""}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-105"
                />

                {/* Overlay with info */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col
                    justify-end p-4"
                >
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {post.desc}
                  </p>

                  <div className="flex items-center mt-3 text-xs text-gray-300">
                    <div className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {post.totalViewCount}
                    </div>

                    <div className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {post.totalLikes}
                    </div>

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {post.totalComments}
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12
                    md:w-16 md:h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center
                    justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="No Posts Available"
            message={`${businessName} hasn't shared any posts yet.`}
          />
        ))}

      {/* Reviews Tab (Placeholder) */}
      {selectedTab === "reviews" &&
        (reviews.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {reviews.map((post) => (
              <div
                key={post._id}
                className="group relative rounded-xl overflow-hidden aspect-[9/16] shadow-md
                  hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/watch?v=${post.videoId}`)}
              >
                {/* Thumbnail */}
                <img
                  src={post.cdnThumbPath[0] || ""}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-105"
                />

                {/* Overlay with info */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col
                    justify-end p-4"
                >
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {post.desc}
                  </p>

                  {/* <div className="flex items-center mt-3 text-xs text-gray-300">
                    <div className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Awaiting Approval
                    </div>
                  </div> */}
                </div>

                {/* Play Button */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12
                    md:w-16 md:h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center
                    justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
            title="No Reviews Available"
            message={`${businessName} hasn't shared any posts yet.`}
          />
        ))}

      {/* Pending Approvals Tab */}
      {selectedTab === "pending" &&
        (pending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {pending.map((post) => (
              <div
                key={post._id}
                className="group relative rounded-xl overflow-hidden aspect-[9/16] shadow-md
                  hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/watch?v=${post.videoId}`)}
              >
                {/* Thumbnail */}
                <img
                  src={post.cdnThumbPath[0] || ""}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500
                    group-hover:scale-105"
                />

                {/* Pending Badge */}
                <div
                  className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium
                    rounded-full"
                >
                  Pending
                </div>

                {/* Overlay with info */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col
                    justify-end p-4"
                >
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {post.desc}
                  </p>

                  <div className="flex items-center mt-3 text-xs text-gray-300">
                    <div className="flex items-center mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Awaiting Approval
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12
                    md:w-16 md:h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center
                    justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 md:h-8 md:w-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            title="No Pending Approvals"
            message="All caught up! There are no posts waiting for approval."
          />
        ))}
    </div>
  );
};

export default BusinessPosts;
