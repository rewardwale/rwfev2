export interface Profile {
    _id: string;
    indEmail: string;
    indFirstName: string;
    indLastName: string;
    indGender: string;
    indLanPref: string;
    indContentPref: string;
    indPic: IndPic;
    updatedAt: string;
    bio: string;
    isBusinessUser: boolean;
    desc: string;
    indDob: string;
    userName: string;
    __v: number;
    totalPublishedPosts: number;
    totalUnpublishedPosts: number;
    totalFollowers: number;
    totalFollowing: number;
    pRoleId: string;
    pRelationId: string;
    userCompositeId: string;
    shortCompositeId: string;
    isFollow: boolean;
    location?: string;
    individualId?:string;
  }
  
  export interface IndPic {
    original: string;
    thumbnail: string;
    _id: string;
  }
  
  export interface DashboardCategory {
    totalComments: number;
    _id: string;
    videoId: string;
    shortVideoId: string;
    hashtags: string[];
    title: string;
    desc: string;
    avgRating: number;
    cdnVideoPath: string;
    srcCdnThumbPath: string;
    cdnThumbPath: string;
    totalViewCount: number;
    totalLikes: number;
    totalDislikes: number;
    userDetails: UserDetails;
    primaryCategoryId: string;
    secondaryCategoryLevel1Id: string;
    secondaryCategoryLevel2Id: string;
    primaryCategoryName: string;
    secondaryCategoryLevel1Name: string;
    secondaryCategoryLevel2Name: string;
    isLiked: boolean;
    isBookmarked: boolean;
    totalShareCount: number;
    myRating: number | 0;
    isPaused: boolean | false;
    uploaderRating: {
      [key: string]: UploaderRatingItem;
    };
    isFollowed: boolean;
  }
  
  export interface UserDetails {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
    pRoleId: string;
    pRelationId: string;
    userCompositeId: string;
    isFollowed: boolean;
    isOwnProfile: boolean;
    indPic: IndPic;
  }
  
  export interface UploaderRatingItem {
    value: string;
    rating: number;
  }
  
  export interface userProps {
    data: Profile;
    handleFollow: (id: string) => void;
  }
  
  export interface videoProps extends React.HTMLAttributes<HTMLDivElement> {
    data: videoData;
    width: number;
    height: number;
    aspectRatio: "portrait";
  }
  export interface videoData {
    _id: string;
    videoId: string;
    hashtags: string[];
    title: string;
    uploaderRating: {
      [key: string]: UploaderRatingItem;
    };
    desc: string;
    cdnVideoPath: string;
    cdnThumbPath: string;
    srcCdnThumbPath: string;
    totalViewCount: number;
    totalShareCount: number;
    totalLikes: number;
    totalComments: number;
    status: string;
    avgRating: number;
    userDetails: {
      userId: string;
      firstName: string;
      lastName: string;
      userName: string;
      isFollowed: boolean;
    };
    isLiked: boolean;
    isBookmarked: boolean;
  }
  
  export type customerType = "all" | "video" | "user";
  