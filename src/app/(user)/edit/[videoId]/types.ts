export interface EditPostData {
    cdnVideoPath: string;
    title: string;
    hashtags: string[];
    desc: string;
    tags: string[];
    isProduct: boolean;
    isService: boolean;
    isPlaces: boolean;
    uploaderRating: Record<string, { value: string; rating: number }>;
  }
  
  export interface ApiResponse {
    message: string;
    data: {
      _id: string;
      videoId: string;
      cdnVideoPath: string;
      title: string;
      hashtags: string[];
      desc: string;
      tags: string[];
      isProduct: boolean;
      isService: boolean;
      isPlaces: boolean;
      uploaderRating: Record<string, { value: string; rating: number }>;
      [key: string]: any;
    };
  }