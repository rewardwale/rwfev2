export interface Review {
    _id: string;
    title: string;
    cdnThumbPath: string;
    videoId: string;
    cdnVideoPath: string;
    totalViewCount: number;
    avgRating: number;
    hashtags: string[];
    userDetails: {
      firstName: string;
      lastName: string;
      indPic: {
        thumbnail: string;
      };
    };
    isLiked: boolean;
    totalLikes: number;
    isBookmarked: boolean;
  }
  
  export interface Category {
    categoryId: string;
    categoryName: string;
    totalReviews: number;
    reviews: Review[];
  }