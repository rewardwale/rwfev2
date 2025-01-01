"use client";

export interface Video {
  _id: string;
  videoId: string;
  title: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  avgRating: number;
  hashtags: string[];
  userDetails: {
    indFirstName: string;
    indLastName: string;
    userName: string;
    indPic: {
      original: string;
      thumbnail: string;
    };
  };
  isLiked: boolean;
  totalLikes: number;
  isBookmarked: boolean;
  categoryId: string;
  totalComments: number;
}
