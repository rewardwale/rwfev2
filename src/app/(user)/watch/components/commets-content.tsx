"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useComments } from "../hooks/use-comment";
import { CommentItem } from "./comment-item";
import { useSearchParams } from "next/navigation";
import { addNewComment } from "@/apis/watch";
import { useIsMobile } from "@/hooks/use-mobile";

interface CommentsContentProps {
  onClose: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
}

export function CommentsContent({
  onClose,
  newComment,
  setNewComment,
}: CommentsContentProps) {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v") || "";
  const isMobile = useIsMobile();
  const {
    comments,
    loading,
    error,
    totalCount,
    handleLikeComment,
    handleNewComment,
    handleDeleteComment,
  } = useComments(videoId);

  console.log("checking for comment update", comments);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          Comments {totalCount > 0 && `(${totalCount})`}
        </h2>
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {loading ? (
          <div className="py-4 text-center text-muted-foreground">
            Loading comments...
          </div>
        ) : error ? (
          <div className="py-4 text-center text-destructive">{error}</div>
        ) : comments.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onLike={handleLikeComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 bg-background border-t">
        <div className="flex items-start gap-3">

          {/* commenting for now have to take profile image of the commenter */}
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar> */}

          <div className="flex-1">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-secondary"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setNewComment("")}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!newComment.trim()}
            onClick={() => {
              handleNewComment(newComment);
              setNewComment("");
            }}
          >
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
