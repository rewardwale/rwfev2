import { useEffect, useRef, useState, ReactNode } from "react";
import ResponsiveImages from "../responsiveImages/images.component";
import styles from "./HorizontalScrollWithArrows.module.css";

interface HorizontalScrollWithArrowsProps {
  children: ReactNode;
  arrowType: "white" | "productListing" | "default";
  data: any[]; // Adjust type based on the data structure
  className?: string;
}

const HorizontalScrollWithArrows: React.FC<HorizontalScrollWithArrowsProps> = ({
  children,
  arrowType,
  data,
  className,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [scrollX, setScrollX] = useState<number>(0); // For detecting start scroll position
  const [scrollEnd, setScrollEnd] = useState<boolean>(false); // For detecting end of scrolling

  useEffect(() => {
    if (
      ref.current &&
      data?.length !== 0 &&
      ref.current.scrollWidth === ref.current.offsetWidth
    ) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  }, [
    data,
    ref.current?.childElementCount,
    ref.current?.scrollWidth,
    ref.current?.offsetWidth,
  ]);

  const clickHorizontal = (scrollOffset: number) => {
    if (ref.current) {
      ref.current.scrollLeft += scrollOffset;
      if (
        Math.floor(ref.current.scrollWidth - ref.current.scrollLeft) <=
        ref.current.offsetWidth
      ) {
        setScrollEnd(true);
      } else {
        setScrollEnd(false);
      }
    }
  };

  const scrollCheck = () => {
    if (ref.current) {
      setScrollX(ref.current.scrollLeft);
      if (
        Math.floor(ref.current.scrollWidth - ref.current.scrollLeft) <=
        ref.current.offsetWidth
      ) {
        setScrollEnd(true);
      } else {
        setScrollEnd(false);
      }
    }
  };

  const getImageSrc = (direction: "left" | "right") => {
    if (arrowType === "white") {
      return direction === "left"
        ? "https://images.woovly.com/assets/arrow-white-left.png"
        : "https://images.woovly.com/assets/arrow-white-right.png";
    }
    if (arrowType === "productListing") {
      return direction === "left"
        ? "https://images.woovly.com/assets/leftScrollArrow.png"
        : "https://images.woovly.com/assets/Frame+1640+(1).png";
    }
    return direction === "left"
      ? "https://cdn.shopify.com/s/files/1/0522/7020/3059/files/leftArrow.png?v=1650441231"
      : "https://cdn.shopify.com/s/files/1/0522/7020/3059/files/rightArrow.png?v=1650441220";
  };

  return (
    <div className={styles.container}>
      {scrollX !== 0 && (
        <div
          className={`${styles.leftArrow}`}
          onClick={() => clickHorizontal(-1000)}
        >
          <ResponsiveImages
            imageSrc={getImageSrc("left")}
            height={arrowType === "productListing" ? 52 : 46}
            width={arrowType === "productListing" ? 52 : 46}
            objectFitProp="contain"
            layout="fixed"
          />
        </div>
      )}
      <div
        className={`${styles.productList} ${className ?? ""}`}
        ref={ref}
        onScroll={scrollCheck}
      >
        {children}
      </div>
      {!scrollEnd && (
        <div
          className={`${styles.rightArrow}`}
          onClick={() => clickHorizontal(1000)}
        >
          <ResponsiveImages
            imageSrc={getImageSrc("right")}
            height={arrowType === "productListing" ? 52 : 46}
            width={arrowType === "productListing" ? 52 : 46}
            objectFitProp="contain"
            layout="fixed"
          />
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollWithArrows;
