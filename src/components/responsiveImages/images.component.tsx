import Image, { ImageLoaderProps } from "next/image";
import { CSSProperties, useEffect, useState } from "react";
import styles from "./images.module.css";

const myLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

interface ResponsiveImagesProps {
  imageSrc: string;
  layout?: "intrinsic" | "fixed" | "responsive" | "fill";
  objectFitProp?: "contain" | "cover" | "fill" | "none" | "scale-down";
  height?: number;
  width?: number;
  classname?: string;
  type?: "productPage" | "productDescriptionPage" | "videoProfile" | "redCover" | "product-image" | "scpMob";
  alt?: string;
  style?: CSSProperties;
  onClick?: () => void;
  [key: string]: any; // For additional props like `id`, `data-*`, etc.
}

const ResponsiveImages: React.FC<ResponsiveImagesProps> = ({
  imageSrc,
  layout = "intrinsic",
  objectFitProp,
  height = 0,
  width = 0,
  classname = "",
  type = "",
  alt = "",
  style,
  ...props
}) => {
  const [src, setSrc] = useState<string>(imageSrc);

  useEffect(() => {
    let img = imageSrc;
    if (imageSrc) {
      let temp: string[];
      if (type === "productPage") {
        if (
          !imageSrc.includes("_600x") &&
          !imageSrc.includes("_400x")
        ) {
          temp = imageSrc.split(".");
          temp[temp.length - 2] += "_600x";
          img = temp.join(".");
        }
        setSrc(img);
      } else if (type === "productDescriptionPage") {
        if (
          !imageSrc.includes("_600x") &&
          !imageSrc.includes("_400x")
        ) {
          temp = imageSrc.split(".");
          temp[temp.length - 2] += "_600x";
          img = temp.join(".");
          setSrc(img);
        } else if (imageSrc.includes("_400x")) {
          img = imageSrc.replace("_400x", "_600x");
          setSrc(img);
        }
      } else {
        setSrc(imageSrc);
      }
    }
  }, [imageSrc, type]);

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <Image
      loader={myLoader}
      src={
        src ||
        (type === "videoProfile"
          ? "https://images.woovly.com/assets/userProfile.png"
          : type === "redCover"
          ? "https://images.woovly.com/assets/placeholder.webp"
          : "https://images.woovly.com/assets/placeholder.png")
      }
      layout={layout}
      style={style}
      objectFit={objectFitProp}
      quality={90}
      height={height}
      width={width}
      loading="lazy"
      onClick={handleClick}
      className={styles[classname] || ""}
      alt={alt || "Image"}
      placeholder={
        src?.includes("assets") ||
        (type !== "product-image" && type !== "videoProfile")
          ? "blur"
          : undefined
      }
      blurDataURL={
        type === "videoProfile"
          ? "https://images.woovly.com/assets/userProfile.png"
          : type === "redCover"
          ? "https://images.woovly.com/assets/placeholder.webp"
          : "https://images.woovly.com/assets/placeholder.png"
      }
      onError={() => {
        const fallbackSrc =
          type === "videoProfile"
            ? "https://images.woovly.com/assets/userProfile.png"
            : type === "redCover"
            ? "https://images.woovly.com/assets/placeholder.webp"
            : "https://images.woovly.com/assets/placeholder.png";
        setSrc(fallbackSrc);
      }}
      {...props}
    />
  );
};

export default ResponsiveImages;
    