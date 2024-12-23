"use client";

import { useState, useEffect } from "react";
import { Comment } from "../types/comments";
import {
  addNewComment,
  deleteComment,
  getVideoComments,
  likeComment,
  unlikeComment,
} from "@/apis/watch";

export function useComments(videoId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      const response = await getVideoComments(videoId);
      setComments(response.data.data);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  console.log("checking for data", comments, videoId);

  const handleLikeComment = async (
    commentId: string,
    isCurrentlyLiked: boolean
  ) => {
    try {
      if (isCurrentlyLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }

      // Optimistic update
      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLiked: !isCurrentlyLiked,
              totalLikes: isCurrentlyLiked
                ? comment.totalLikes - 1
                : comment.totalLikes + 1,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error toggling comment like:", error);
      // Revert optimistic update on error
      const response = await getVideoComments(videoId);
      setComments(response.data.data);
    }
  };

  const handleNewComment = async (comment: string) => {
    let payload = {
      comment: comment,
    };
    try {
      let res = await addNewComment(videoId, payload);
      if (res) {
        fetchComments();
      }
      console.log("checking add comment", res);
    } catch (error) {
      console.error("not able to comment", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    console.log("handle delete called")
    try {
      const previousComments = [...comments];
      setComments(comments.filter((comment) => comment._id !== commentId));
      setTotalCount((prev) => prev - 1);
      await deleteComment(videoId, commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
      const response = await getVideoComments(videoId);
      setComments(response.data.data);
      setTotalCount(response.data.count);
    }
  };

  return {
    comments,
    loading,
    error,
    totalCount,
    handleLikeComment,
    handleNewComment,
    handleDeleteComment,
  };
}
