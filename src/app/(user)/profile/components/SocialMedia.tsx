import Image from "next/image";
import Link from "next/link";
import { ProfileDataProps } from "./dataTypes";

interface Props{
    profileData:ProfileDataProps
}

export default function SocialMedia({profileData}:Props){
    return(
        <div className="social-icons flex sm:flex-col ms-4 mt-1 items-center justify-center sm:mt-0">
        {profileData.socialUrls?.whatsapp && (
          <Link
            href={
              profileData.socialUrls?.whatsapp.trim().length !== 0
                ? profileData.socialUrls?.whatsapp
                : "/"
            }
          >
            <Image
              className="mb-2 mr-5"
              src="/whatsApp-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
        ) }

        {profileData.socialUrls?.twitter && (
          <Link
            href={
              profileData.socialUrls?.twitter.trim().length !== 0
                ? profileData.socialUrls?.twitter
                : "/"
            }
          >
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/twitter-old-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
        ) }

        {profileData.socialUrls?.instagram && (
          <Link
            href={
              profileData.socialUrls?.instagram.trim().length !== 0
                ? profileData.socialUrls?.instagram
                : "/"
            }
          >
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/Instagram-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
        ) }

        {profileData.socialUrls?.linkedin && (
          <Link
            href={
              profileData.socialUrls?.linkedin.trim().length !== 0
                ? profileData.socialUrls?.linkedin
                : "/"
            }
          >
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/Linkedin-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
        ) }
      </div>
    )
}