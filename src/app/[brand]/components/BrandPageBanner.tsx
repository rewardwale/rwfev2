import { Button } from "@/components/ui/button";
import { Link, Pencil, PhoneCall, Share2, Star, StarHalf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandInfo } from "../types/brands";
import { animateFollow } from "@/lib/animation";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveImages from "@/components/responsiveImages/images.component";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editBusiness,
  followMerchant,
  unFollowMerchant,
  uploadBusinessBanner,
  uploadBusinessProfile,
} from "@/apis/business";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BusinessModal } from "./BusinessModal";
import useIsOwner from "@/hooks/use-owner";
import { EditBusinessDialog } from "./EditBusinessDialog";

export function BrandHeader({ info }: { info: BrandInfo }) {
  const followButtonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFollowed, setIsFollowed] = useState(info?.isFollow);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockData = {
    _id: info?._id || "",
    custId: info.custId || "",
    businessName: info.name || "",
    contactUsDetails: {
      indCountryCode: info.contactUsDetails?.indCountryCode || "+91",
      indMobileNum: info.contactUsDetails?.indMobileNum || "",
      indEmail: info.contactUsDetails?.indEmail || "",
    },
    operationalHours: info.operationalHours || {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    handle: info.handle || "",
    title: info.title || "",
    desc: info.desc || "",
    websiteURLs: info.websiteURLs || "",
    location: info.location || "",
    locationCoordinates: info.locationCoordinates || {
      type: "Point",
      coordinates: [],
    },
    socialUrls: {
      whatsapp: info.socialUrls?.whatsapp || "",
      linkedin: info.socialUrls?.linkedin || "",
      facebook: info.socialUrls?.facebook || "",
      instagram: info.socialUrls?.instagram || "",
      twitter: info.socialUrls?.twitter || "",
    },
    status: info.status || "",
    avgRating: info.avgRating || 0,
    totalRating: info.totalRating || 0,
    defaultCommunication: info.defaultCommunication,
    defaultBusinessBanner: info.defaultBusinessBanner || {
      original: "",
      thumbnail: "",
      _id: "",
    },
    defaultBusinessImage: info.defaultBusinessImage || {
      original: "",
      thumbnail: "",
      _id: "",
    },
    businessBanners: info.businessBanners || [],
    businessImages: info.businessImages || [],
  };

  const isOwner = useIsOwner(info.businessPageOwner);

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        let res = await followMerchant(info.Id);
        if (res) {
          setIsFollowed(!isFollowed);
        } else {
          // console.log("checking res of follow", res);
          setIsFollowed(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (isFollowed) {
        await unFollowMerchant(info.Id); // Call the API to unfollow the user
        setIsFollowed(false); // Update the state to reflect that the user is no longer followed
      }
    } catch (error) {
      console.error("Error unfollowing user:", error); // Handle any errors
    }
  };

  const handleLogoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsBannerModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleBannerFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    setSelectedBannerFile(file || null);
  };

  const handleUpload = async (id: string) => {
    if (selectedFile) {
      // Boilerplate for API call to upload logo
      const formData = new FormData();
      formData.append("image", selectedFile);

      // Call API to upload the logo
      let res = await uploadBusinessProfile(id, formData);
      if (res.message === "Success.") {
        toast.success("Logo updated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else if (selectedBannerFile) {
      // Boilerplate for API call to upload logo
      const formData = new FormData();
      formData.append("image", selectedBannerFile);

      // Call API to upload the logo
      let res = await uploadBusinessBanner(id, formData);
      if (res.message === "Success.") {
        toast.success("Banner updated");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      // alert("Logo uploaded successfully!");
      handleCloseModal();
    } else {
      alert("Please select a file.");
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <StarHalf
                key={index}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
        <span className="ml-2 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this video",
          text: "I found this interesting video. Take a look!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing content:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log("Web Share API not supported");
      // You can implement a custom share dialog here
      alert(
        "Sharing is not supported on this browser. You can copy the URL to share.",
      );
    }
  };

  const isMobile = useIsMobile();
  const router = useRouter();

  const handleEditSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        websiteURLs:
          Array.isArray(data.websiteURLs) && data.websiteURLs.length > 0
            ? data.websiteURLs[0]
            : "",
      };

      const response = await editBusiness(info.handle, formattedData);
      console.log("checking response fo edit business", response.message);
      if (response.success === 'Success') {
        toast.success("Business details updated successfully");
        window.location.reload();
      } else {
        toast.error("Failed to update business details");
      }
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business details");
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="w-full h-[350px] relative bg-gradient-to-b from-gray-200 to-white"
        style={{
          backgroundImage: `url(${encodeURI(info.banner)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwner && (
          <div className="absolute bottom-0 top-2 right-3 cursor-pointer">
            <Pencil
              size={isMobile ? 28 : 38}
              strokeWidth={1.5}
              color="black"
              onClick={() => setIsBannerModalOpen(true)}
            />
          </div>
        )}
        {!isMobile ? (
          <div
            className="absolute bottom-0 top-48 min-md:top-68 px-4 py-4 text-black dark:text-white"
            style={{
              display: "flex",
            }}
          >
            <div
              className="flex items-end lg:justify-between md:justify-center md:items-center gap-5 h-64
                lg:space-x-96 md:flex-col md:gap-12 md:p-4 md:mt-16 md:m-3 xl:space-x-96"
            >
              <div className="md:top-68">
                <div className="flex items-center lg:text-sm gap-4">
                  <div
                    className="bg-black"
                    style={{
                      borderRadius: "80%",
                      minWidth: "120px",
                      width: "190px",
                      height: "190px",
                      display: "flex",
                      alignContent: "center",
                      padding: "5px",
                      cursor: "pointer",
                    }}
                    onClick={handleLogoClick}
                  >
                    <ResponsiveImages
                      imageSrc={info?.logo}
                      objectFitProp="contain"
                      layout="fixed"
                      classname="circularImage"
                      width={isMobile ? 90 : 180}
                      height={isMobile ? 90 : 180}
                    />
                  </div>
                  <div className="h-10 mb-4">
                    <div className="flex md:mt-4 lg:top-48 h-10 items-center gap-2">
                      <div className="text-2xl font-bold text-black dark:text-white lg:text-xl">
                        {info.name}
                      </div>
                      {/* {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )} */}
                    </div>
                    <div className="flex-col sm:flex-row gap-4 text-sm max-lg:text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-zinc-500">
                          Rating:
                        </span>
                        <StarRating rating={info.rating} />
                      </div>
                      {/* <div className="flex items-center gap-1">
                      <span className="font-semibold text-zinc-500 ">Rank:</span>
                       <span>#{info.rank}</span> 
                    </div> */}
                      <div className="flex-col items-center gap-1">
                        <div className="font-semibold text-black dark:text-white text-lg">
                          {info.title}{" "}
                        </div>
                        <div className="text-black dark:text-white pb-3 w-60 h-10 text-sm">
                          {info.desc}{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mb:justify-center mb:items-center lg:flex-col md:-mb-1">
                {/* <div className="flex justify-center gap-3 p-2 mb-2">
                <div
                  className="cursor-pointer"
                >
                  <PhoneCall className="text-black text-4xl lg:text-3xl dark:text-white" />
                </div>
                <div
                  className="cursor-pointer "
                >
                  <Image
                    src={WhatsappLogo}
                    alt="social-icon"
                    height={56}
                    width={44}
                  />
                  <IoLogoWhatsapp className="text-green-500 text-4xl lg:text-3xl" />
                </div>
             </div> */}
                {/*  this div needs to be aligned*/}
              </div>
            </div>
            <div
              className="flex lg:justify-end lg:items-center gap-2 w-full absolute bottom-0 top-48
                min-md:top-6"
              style={{
                left: "100%",
              }}
            >
              <Button
                onClick={() => setIsDetailsModalOpen(true)}
                className="lg:text-xs lg:p-2 xl:text-sm xl:p-3"
              >
                More Details
              </Button>
              {isOwner && (
                <Button
                  onClick={() =>
                    router.push(`/post?data=${encodeURIComponent(info.Id)}`)
                  }
                  className="lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                >
                  Post Review
                </Button>
              )}
              {isOwner && (
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                >
                  Edit
                </Button>
              )}
              {!isOwner && (
                <Button
                  ref={followButtonRef}
                  onClick={isFollowed ? handleUnfollow : handleFollow}
                  className="px-6 lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                >
                  {isFollowed ? "Following" : "Follow"}
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4 min-lg:h-1 min-lg:w-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              paddingTop: "40px",
            }}
          >
            <div className="mt-52">
              <div
                className="bg-white dark:bg-black"
                style={{
                  borderRadius: "50%",
                  minWidth: "150px",
                  width: "150px",
                  height: "150px",
                  display: "flex",
                  alignContent: "center",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={handleLogoClick}
              >
                <ResponsiveImages
                  imageSrc={info?.logo}
                  objectFitProp="contain"
                  layout="fixed"
                  classname="circularImage"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <div>
              <div className="flex-col justify-center text-center items-center gap-2">
                <div className="text-2xl font-bold text-black dark:text-white mb-3">
                  {info.name}
                </div>
                {/* {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )} */}
                <div className="text-lg font-bold text-black dark:text-white">
                  {info.title}{" "}
                </div>
                <div className="text-md text-black dark:text-white">
                  {" "}
                  {info.desc}{" "}
                </div>
                <div className="flex gap-2 justify-center w-full">
                  <div className="font-semibold flex gap-1 text-zinc-500">
                    Rating : {}
                    <StarRating rating={info.rating} />
                  </div>
                  {/* <div className="font-semibold text-zinc-500  ">Rank:{ }
                    <span className="gap-2">#{info.rank}</span>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex gap-5">
              {!isOwner && (
                <div>
                  <Button
                    ref={followButtonRef}
                    onClick={isFollowed ? handleUnfollow : handleFollow}
                    className="px-6"
                  >
                    {isFollowed ? "UnFollow" : "Follow"}
                  </Button>
                </div>
              )}

              <div>
                <div className="flex gap-5">
                  <Button onClick={() => setIsDetailsModalOpen(true)}>
                    More Details
                  </Button>
                  {isOwner && (
                    <Button
                      onClick={() => setIsEditModalOpen(true)}
                      className="lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                    >
                      Edit
                    </Button>
                  )}
                  {isOwner && (
                    <Button
                      onClick={() =>
                        router.push(`/post?data=${encodeURIComponent(info.Id)}`)
                      }
                      className="lg:text-xs lg:p-2 xl:text-sm xl:p-3"
                    >
                      Post Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
            {/* <div>5</div>
            <div>6</div> */}
          </div>
        )}
      </div>
      {/* Modal */}
      {isModalOpen && isOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Change Logo
              </h2>
              <p className="text-gray-500 text-sm">
                Upload a new logo to update your brand identity.
              </p>
            </div>

            {/* Preview Section */}
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2
                  border-gray-200 shadow-md"
              >
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={info?.logo}
                    alt="Current logo"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>

              <button
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                Select New Image
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>

            {/* Upload and Cancel Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                onClick={() => handleUpload(info.Id)}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Change Background
              </h2>
              <p className="text-gray-500 text-sm">
                Upload a new Banner to update your brand identity.
              </p>
            </div>

            {/* Preview Section */}
            <div className="mt-6 flex flex-col items-center justify-center gap-4">
              <div
                className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2
                  border-gray-200 shadow-md"
              >
                {selectedBannerFile ? (
                  <img
                    src={URL.createObjectURL(selectedBannerFile)}
                    alt="Selected logo"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <img
                    src={info?.banner}
                    alt="Current logo"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>

              <button
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                Select New Image
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleBannerFileChange}
              />
            </div>

            {/* Upload and Cancel Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 text-sm"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                onClick={() => handleUpload(info.Id)}
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      )}
      <BusinessModal
        business={mockData}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <EditBusinessDialog
        business={mockData}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
