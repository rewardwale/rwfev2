import { Separator } from "@/components/ui/separator";
import { Bookmark, Grip, Star, Tag } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface SocialUrls {
  whatsapp: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

interface IndPic {
  original: string;
  thumbnail: string;
}

interface ProfileData {
  _id: string;
  indFirstName: string;
  indLastName: string;
  businessName: string;
  userName: string;
  desc: string;
  indDob: string;
  interest: string;
  socialUrls: SocialUrls;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  isBusinessUser: boolean;
  indEmailNotify: boolean;
  indMobileNotify: boolean;
  isAccountVerified: boolean;
  isPrivateAccount: boolean;
  avgRating: number;
  totalRating: number;
  indGender: string;
  indPic: IndPic;
  indLanPref: string;
  indContentPref: string;
  totalUnpublishedPosts: number;
  totalPublishedPosts: number;
  totalFollowers: number;
  totalFollowing: number;
  indCategories: string[];
  profileImages: string[];
  title: string;
}

interface ProfilePageProps {
  profileData: {
    message: string;
    data: ProfileData;
  };
}

export async function generateMetadata({
  profileData,
}: ProfilePageProps): Promise<Metadata> {
  const username = profileData.data.indFirstName;
  return {
    title: `${username}'s Profile | Rewardwale`,
    description: `View the profile of ${username} on Rewardwale.`,
  };
}

const ProfilePage = ({ profileData }: ProfilePageProps) => {
  return (
    <div className="min-h-screen p-4">
      {/* Profile Header Section */}
      <div className="flex flex-col sm:flex-row  items-start gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <Image
            src={profileData?.data?.indPic?.original}
            width={500}
            height={500}
            alt="Profile Image"
            className="w-180 h-auto sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg"
          />
        </div>

        {/* Profile Details */}
        <div className="flex flex-col gap-2 flex-grow">
          <p className="font-bold text-lg sm:text-xl md:text-2xl">
            {profileData?.data?.indFirstName} {profileData?.data?.indLastName}
          </p>
          <div className="flex items-center gap-2 text-sm sm:text-md md:text-base text-muted-foreground">
            <span>@Avinasshhhh</span>
            <span>4k Followers</span>
            <span>1.2k Reviews</span>
          </div>
          <div className="max-w-[650px]">
            <p className="text-md font-normal sm:text-base md:text-lg leading-tight">
              UI/UX Designer & Frontend Dev @Rewardwale
            </p>
            <p className="text-sm sm:text-md md:text-base text-muted-foreground mt-2">
              Mastering the digital realm for 15 years, I'm a web dev warrior,
              crafting innovation and conquering challenges in orcis{" "}
              <span>...more</span>
            </p>
          </div>
          <div className="flex items-center mt-1 gap-2">
            <Star className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <Star className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <Star className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <Star className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <Star className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="text-xs sm:text-sm md:text-base">
              <span className="text-green-500">{profileData?.data?.avgRating}/5</span> on{" "}
              <span className="text-red-500">{profileData?.data?.totalRating}</span> Ratings
            </span>
          </div>

          {/* Rank Information */}
          <div className="mt-2 text-xs sm:text-sm md:text-base">
            <p className="font-semibold">Rank</p>
            <ul className="list-inside list-none ml-6">
              <li>
                <span className="font-bold">#368</span>
                <span className="text-muted-foreground"> in Bangalore</span>
              </li>
              <li>
                <span className="font-bold">#8864</span>
                <span className="text-muted-foreground"> in India</span>
              </li>
            </ul>
          </div>
        </div>
        {/* <div>
          Following
        </div> */}

        {/* Social Icons */}
        <div className="social-icons flex sm:flex-col ms-4 mt-1 items-center justify-center sm:mt-0">
          <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/whatsApp-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
          <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/facebook-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
          <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/twitter-old-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
          <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/Instagram-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
          <Link href="http://">
            {" "}
            <Image
              className="mb-2 mr-5"
              src="/Linkedin-logo.png"
              alt="social-icon"
              height={50}
              width={40}
            />{" "}
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="py-4">
        <div className="flex justify-evenly">
          {/* POSTS */}
          <div className="flex items-center gap-2">
            <Grip className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="text-xs sm:text-sm md:text-base">POSTS</span>
          </div>

          {/* TAG */}
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="text-xs sm:text-sm md:text-base">TAG</span>
          </div>

          {/* SAVED */}
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            <span className="text-xs sm:text-sm md:text-base">SAVED</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Posts Section */}
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Image 1 */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src="/img2.jpg"
              alt="Description 1"
              className="object-cover w-full h-full rounded"
            />
          </div>

          {/* Image 2 */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src="/img2.jpg"
              alt="Description 2"
              className="object-cover w-full h-full rounded"
            />
          </div>

          {/* Image 3 */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src="/img2.jpg"
              alt="Description 3"
              className="object-cover w-full h-full rounded"
            />
          </div>

          {/* Image 4 */}
          <div className="aspect-w-16 aspect-h-9">
            <img
              src="/img2.jpg"
              alt="Description 4"
              className="object-cover w-full h-full rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
