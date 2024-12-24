import { useRouter } from "next/navigation";
import React from "react";
import { MdDelete } from "react-icons/md";

interface Props {
  videoData: {
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
    _id: string;
  };
  handleBookmarkDelete: (videoId: string) => void;
}

const BookMarkPost = ({ videoData, handleBookmarkDelete }: Props) => {
  const router = useRouter();
  return (
    <div
      className="relative hover:cursor-pointer group overflow-hidden"
      style={{
        borderRadius: "18px",
      }}
      onClick={() => router.push("/watch?v=" + videoData.videoId)}
    >
      <video
        autoPlay={false}
        playsInline
        loop
        muted
        className="aspect-[4/6] w-full object-cover group-hover:scale-110 group-hover:brightness-75
          transition-all duration-200"
      >
        <source
          //   src="https://videos.pexels.com/video-files/8531896/8531896-uhd_3840_2160_25fps.mp4"
          src={videoData.cdnVideoPath}
          type="video/mp4"
        />
      </video>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleBookmarkDelete(videoData.videoId);
        }}
        className="absolute right-0 top-0 bg-gray-900/50 p-1 text-white rounded-bl-md
          hover:text-red-500"
      >
        <MdDelete className="size-5" />
      </button>
    </div>
  );
};

export default BookMarkPost;
