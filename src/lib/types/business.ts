export interface BusinessFormData {
  businessName: string;
  contactUsDetails: {
    indEmail: string;
    indCountryCode: string;
    indMobileNum: string;
  };
  operationalHours: {
    [key: string]: Array<{ isOpen: boolean; open: string; close: string }>;
  };
  handle: string;
  title: string;
  desc: string;
  websiteURLs: string;
  location: string;
  locationCoordinates: {
    latitude: number;
    longitude: number;
  };
  socialUrls: {
    whatsapp: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    twitter: string;
  };
  defaultCommunication:
    | "WHATSAPP_NUMBER"
    | "EMAIL"
    | "PHONE_NUMBER"
    | "WEBSITE";
  keywords: string[];
  content: Record<string, string[]>;
}

export type FormStep =
  | "business"
  | "contact"
  | "hours"
  | "location"
  | "social"
  | "content";
