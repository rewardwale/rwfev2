"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CommentsContent } from "./commets-content";

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerName: string;
  videoId: string | undefined
}

export function CommentsModal({
  isOpen,
  onClose,
  ownerName,
  videoId,
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    const videoContainer = document.getElementById("video-container");
    if (videoContainer && !isMobile) {
      if (isOpen) {
        videoContainer.style.transform = "translateX(-275px)";
      } else {
        videoContainer.style.transform = "translateX(0)";
      }
    }
  }, [isOpen, isMobile]);

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl p-0">
          <CommentsContent
            ownerName={ownerName}
            onClose={onClose}
            newComment={newComment}
            setNewComment={setNewComment}
            videoId={videoId}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    isOpen && (
      <div
        style={{
          translate: "150%",
          border: "1px solid #979797",
          borderRadius: "18px",
          zIndex:'9999'
        }}
        className={`hidden md:block fixed top-4 right-0 w-[450px] h-[calc(88vh-64px)] bg-background
          border-l transform transition-transform duration-700 ease-in-out `}
      >

        <CommentsContent
          // totalComments={totalComments}
          ownerName={ownerName}
          onClose={onClose}
          newComment={newComment}
          setNewComment={setNewComment}
          videoId={videoId}
        />
      </div>
    )
  );
}
