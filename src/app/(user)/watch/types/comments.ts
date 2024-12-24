export interface CommentResponse {
    data: {
      count: number;
      data: Comment[];
    };
  }
  
  export interface Comment {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    profilePic: {
      original: string;
      thumbnail: string;
    };
    comment: string;
    commentedDateTime: string;
    totalLikes: number;
    isLiked: boolean;
  }