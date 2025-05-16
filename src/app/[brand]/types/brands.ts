export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  image: string;
  title: string;
  description: string;
  likes: number;
  date: string;
}

export interface BrandInfo {
  name: string;
  logo: string;
  rating: number;
  banner: string;
  Id: string;
  isFollow: boolean;
  businessPageOwner: string[];
  title?: string;
  desc?: string;
  _id: string;
  custId: string;
  handle: string;
  websiteURLs: string[];
  defaultCommunication: string;
  [key: string]: any; // Allow additional properties for flexibility
}

export interface BusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
  _id: string;
}

export interface OperationalHours {
  monday: BusinessHours[];
  tuesday: BusinessHours[];
  wednesday: BusinessHours[];
  thursday: BusinessHours[];
  friday: BusinessHours[];
  saturday: BusinessHours[];
  sunday: BusinessHours[];
}

export interface ContactUsDetails {
  indCountryCode: string;
  indMobileNum: string;
  indEmail: string;
}

export interface Image {
  original: string;
  thumbnail: string;
  _id: string;
}

export interface Business {
  _id: string;
  custId: string;
  businessName: string;
  contactUsDetails: ContactUsDetails;
  operationalHours: OperationalHours
  banner: string;
  handle: string;
  title: string;
  desc: string;
  websiteURLs: string[];
  location: string;
  locationCoordinates: {
    type: string;
    coordinates: number[];
  };
  socialUrls: {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  status: string;
  avgRating: number;
  totalRating: number;
  defaultBusinessBanner: Image;
  defaultBusinessImage: Image;
  defaultCommunication: string;
  businessBanners: Image[];
  businessImages: Image[];
}

export interface BusinessPage {
  _id: string;
  custId: string;
  businessName: string;
  contactUsDetails: {
    indEmail: string;
    indCountryCode: string;
    indMobileNum: string;
  };
  operationalHours: {
    monday: OperationalHour[];
    tuesday: OperationalHour[];
    wednesday: OperationalHour[];
    thursday: OperationalHour[];
    friday: OperationalHour[];
    saturday: OperationalHour[];
    sunday: OperationalHour[];
  };
  handle: string;
  banner: string;
  logo: string;
  title: string;
  desc: string;
  websiteURLs: string;
  location: string;
  locationCoordinates: {
    type: string;
    coordinates: number[];
  };
  socialUrls: {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  defaultCommunication: string;
  status: string;
  avgRating: number;
  totalRating: number;
  defaultBusinessBanner: {
    original: string;
    thumbnail: string;
  };
  defaultBusinessImage: {
    original: string;
    thumbnail: string;
  };
  totalUnpublishedPosts: number;
  totalPublishedPosts: number;
  totalTaggedCount: number;
  totalFollowers: number;
  businessPageOwner: string[];
  keywords: string[];
  content: {
    [key: string]: string[];
  };
  createdBy: string;
  subscription: {
    planId: string;
    status: string;
    startDate: string;
    endDate: string | null;
    nextBillingDate: string | null;
    paymentMethod: string | null;
    _id: string;
  };
  businessBanners: {
    original: string;
    thumbnail: string;
    _id: string;
  }[];
  businessImages: {
    original: string;
    thumbnail: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  isFollow: boolean;
  isVerified: boolean;
}

export interface OperationalHour {
  open: string;
  close: string;
  isOpen: boolean;
  _id: string;
}

export interface BusinessPostsVideos {
  count: number;
  data: BusinessPost[];
}

export interface BusinessPost {
  _id: string;
  userDetails: {
    userId: string;
    firstName: string;
    lastName: string;
    userName: string;
  };
  videoId: string;
  hashtags: string[];
  title: string;
  desc: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  totalViewCount: number;
  totalShareCount: number;
  totalLikes: number;
  totalComments: number;
  isCommentingAllowed: boolean;
  avgRating: number;
  status: string;
  uploadedAt: string;
  videoLocation: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  isAdvertisement: boolean;
  categoryId: string;
  categoryName: string;
  businessPageId: string;
  businessDetails: {
    businessName: string;
    handle: string;
    defaultBusinessBanner: {
      original: string;
      thumbnail: string;
    };
    defaultBusinessImage: {
      original: string;
      thumbnail: string;
    };
    defaultCommunication: string;
  };
}

export interface BusinessTaggedVideos {
  count: number;
  data: BusinessPost[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}