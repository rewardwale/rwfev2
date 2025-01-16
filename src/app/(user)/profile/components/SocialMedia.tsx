import Image from "next/image";
import Link from "next/link";
import { ProfileDataProps } from "./dataTypes";

interface Props {
  profileData: {
    fname: string;
    lname: string;
    desc: string;
    title: string;
    dob: Date;
    gender: string;
    email: string | undefined;
    phone: string | undefined;
    SocialUrls :{
      whatsapp: string;
      linkedin: string;
      facebook: string;
      instagram: string;
      twitter: string;
    }
  };
}

export default function SocialMedia({ profileData }: Props) {
  console.log("checking profileData", profileData.SocialUrls?.whatsapp.length);

  return (
    <div className="social-icons flex sm:flex-col ms-4 mt-1 items-center justify-center sm:mt-0">
      {profileData.SocialUrls?.whatsapp.length !== 0 && (
        <Link href={profileData.SocialUrls?.whatsapp.trim()}>
          <Image
            className="mb-2 mr-5"
            src="/whatsApp-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.twitter.length !== 0 && (
        <Link href={profileData.SocialUrls?.twitter}>
          <Image
            className="mb-2 mr-5"
            src="/twitter-old-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.instagram.length !== 0 && (
        <Link href={profileData.SocialUrls?.instagram}>
          {" "}
          <Image
            className="mb-2 mr-5"
            src="/Instagram-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}

      {profileData.SocialUrls?.linkedin.length !== 0 && (
        <Link href={profileData.SocialUrls?.linkedin}>
          {" "}
          <Image
            className="mb-2 mr-5"
            src="/Linkedin-logo.png"
            alt="social-icon"
            height={50}
            width={40}
          />{" "}
        </Link>
      )}
    </div>
  );
}
