import Image from "next/image";
import styles from "./BrandPageBanner.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, PhoneCall, Share2, Star, StarHalf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandInfo } from "../types/brands";
import { animateFollow } from "@/lib/animation";
import { useIsMobile } from "@/hooks/use-mobile";
import ResponsiveImages from "@/components/responsiveImages/images.component";
import WhatsappLogo from "../../../../public/whatsApp-logo.png";
import { uploadBusinessProfile } from "@/apis/business";
import { toast } from "sonner";

export function BrandHeader({ info }: { info: BrandInfo }) {
  const followButtonRef = useRef<HTMLButtonElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFollow = () => {
    if (followButtonRef.current) {
      animateFollow(followButtonRef.current);
    }
  };

  const handleLogoClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = async (id: string) => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);

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

      console.log("checking res of upload", res.message === "Success.");
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
        console.log("Content shared successfully");
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

  return (
    <div className="relative w-full">
      <div
        className="w-full h-[400px] relative bg-gradient-to-b from-gray-200 to-white"
        style={{
          backgroundImage: info?.banner
            ? `url(${info.banner})`
            : 'url("m.media-amazon.com/images/S/al-eu-726f4d26-7fdb/090833d5-7b09-4745-9d2d-3f4d31a035c1._CR0%2C0%2C3000%2C600_SX1920_.png")', // Fallback background
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 px-4 py-6">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-4">
              <div
                className="bg-white"
                style={{
                  borderRadius: "50%",
                  minWidth: "70px",
                  width: "120px",
                  height: "120px",
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
                  width={isMobile ? 70 : 120}
                  height={isMobile ? 70 : 120}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{info.name}</h1>
                  {/* {info.isVerified && (
                    <Badge variant="secondary">Verified Brand</Badge>
                  )} */}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-300">Rating:</span>
                    <StarRating rating={info.rating} />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">Rank:</span>
                    {/* <span>#{info.rank}</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div
                className="cursor-pointer absolute"
                style={{
                  top: "-220%",
                  right: "3%",
                }}
              >
                <PhoneCall size={36} />
              </div>
              <div
                className="cursor-pointer absolute"
                style={{
                  top: "-180%",
                  right: "3%",
                }}
              >
                <Image
                  src={WhatsappLogo}
                  alt="social-icon"
                  height={40}
                  width={36}
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button>More Details</Button>
              <Button
                ref={followButtonRef}
                onClick={handleFollow}
                className="px-6"
              >
                Follow
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
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
    </div>
  );
}
