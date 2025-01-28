"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import LoadingUI from "../app/loading";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import HorizontalScrollWithArrows from "@/components/horizontalScrollWithArrows/HorizontalScrollWithArrows.component";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

const DynamicSwiper = dynamic(() => import("./dynamic-swipe"), {
  ssr: false,
  loading: () => <LoadingUI />,
});

interface ShortCardProps {
  title: string;
  description: string;
  totalViewCount: number;
  cdnThumbPath: string;
  cdnVideoPath: string;
  viewInLast15Days?: number;
  distance?: number;
  videoId?: string;
}

interface HeroSlide {
  cdnThumbPath: string;
  cdnVideoPath: string;
  description: string;
}

interface CategoryData {
  [key: string]: {
    popular: ShortCardProps[];
    trending: ShortCardProps[];
    advertisement: HeroSlide[];
    nearby: ShortCardProps[];
  };
}

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface LandingPageProps {
  categoriesData: {
    message: string;
    data: CategoryData | null; // Allow null for the loading state.
  } | null; // Allow null when data hasn't loaded.
}

const HeroSection: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation
        autoplay={{ delay: 5000 }}
        loop={true}
        className="w-full h-[35rem]"
        pagination={true}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            {slide.cdnVideoPath ? (
              <video
                src={slide.cdnVideoPath}
                poster={slide.cdnThumbPath}
                className="w-full object-cover"
                autoPlay
                loop
                muted
                style={{
                  height: "60vh",
                  marginBottom: "2rem",
                }}
              />
            ) : (
              <Image
                src={slide.cdnThumbPath}
                alt={slide.description}
                layout="fill"
                objectFit="cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-8">
              <p className="text-xl text-white">{slide.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ShortCard: React.FC<ShortCardProps> = ({
  title,
  description,
  totalViewCount,
  cdnThumbPath,
  cdnVideoPath,
  videoId,
}) => {
  const router = useRouter();
  return (
    <div style={{
      maxWidth:'min-content'
    }}>
      <Card
        className="w-[200px] flex-shrink-0 rounded-md cursor-pointer transition-transform
          hover:scale-105"
        onClick={() => router.push(`/watch?v=${videoId}`)}
      >
        <CardContent className="p-0">
          <motion.div
            className="relative w-full overflow-hidden rounded-md"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image
              src={cdnThumbPath[0]}
              alt={title}
              width={300}
              height={500}
              className="rounded-md object-cover"
              style={{
                aspectRatio: "16/9",
                minWidth: "250px",
                height: "400px",
              }}
            />
          </motion.div>
          <div
            className="p-2"
            // style={{
            //   maxHeight:'30px'
            // }}
          >
            <p
              className="font-semibold truncate"
              style={{
                // fontFamily: "Roboto",
                fontSize: "18px",
                // color: "#ffffff",
                lineHeight: "2.2rem",
                fontWeight: 500,
                overflow: "hidden",
                maxHeight: "4.4rem",
                textOverflow: " ellipsis",
                whiteSpace: "normal",
                height: "40px",
              }}
            >
              {title.length > 20 ? `${title.slice(0, 60)}...` : title}
            </p>
            <p
              className="font-semibold truncate"
              style={{
                // fontFamily:'Roboto',
                fontSize: "12px",
                color: "#b1b3b1",
                lineHeight: "2.2rem",
                fontWeight: 400,
                overflow: "hidden",
                maxHeight: "4.4rem",
                textOverflow: " ellipsis",
                whiteSpace: "normal",
                height: "35px",
              }}
            >
              {description.length > 20
                ? `${description.slice(0, 60)}...`
                : description}
            </p>
            <p
              style={{
                color: "#b1b3b1",
              }}
            >
              {totalViewCount} views
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SubHeadingContent: React.FC<{
  title: string;
  cards: ShortCardProps[];
}> = ({ title, cards }) => (
  <div className="mb-12">
    <h3
      style={{
        marginLeft: "15px",
      }}
      className="text-2xl font-semibold mb-4 pl-5"
    >
      {title}
    </h3>
    <div className="overflow-x-auto">
      <div
        className="flex space-x-4 p-4 min-w-max scrollbar-hide"
        style={{
          overflowX: "scroll",
        }}
      >
        <HorizontalScrollWithArrows
          arrowType="white"
          data={cards} // Pass data for scroll checking
          className="pl-5"
        >
          {cards.map((card, index) => (
            <ShortCard key={index} {...card} />
          ))}
        </HorizontalScrollWithArrows>
      </div>
    </div>
  </div>
);

const CategorySection: React.FC<{
  categoryName: string;
  categoryContent: CategoryData[string];
}> = ({ categoryName, categoryContent }) => (
  <div className="mb-12">
    <div
      className="text-2xl font-bold mb-4 pb-5"
      style={{
        fontSize: "32px",
        fontWeight: "600",
        marginTop: "32px",
        marginLeft: "15px",
      }}
    >
      {categoryName}
    </div>
    {["popular", "trending", "nearby"].map(
      (section) =>
        categoryContent[section as keyof typeof categoryContent] &&
        (
          categoryContent[
            section as keyof typeof categoryContent
          ] as ShortCardProps[]
        ).length > 0 && (
          <SubHeadingContent
            key={section}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
            cards={
              categoryContent[
                section as keyof typeof categoryContent
              ] as ShortCardProps[]
            }
          />
        ),
    )}
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ categoriesData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      let ctx = gsap.context(() => {
        gsap.to(scrollContainerRef.current, {
          y: () =>
            -(scrollContainerRef.current!.scrollHeight - window.innerHeight),
          ease: "back.inOut",
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
      }, scrollContainerRef);

      return () => ctx.revert();
    }
  }, [categoriesData]);
  if (!categoriesData || !categoriesData.data) {
    return <LoadingUI />; // Use your global loader or any spinner component.
  }

  // Get all advertisement slides from all categories
  const allAdvertisements = Object.values(categoriesData.data)
    .flatMap((category) => category.advertisement || [])
    .filter((ad) => ad); // Remove any undefined/null values

  return (
    <>
      <div  className="min-h-screen">
        {allAdvertisements.length > 0 && (
          <HeroSection slides={allAdvertisements} />
        )}
        <div className="container mx-auto px-4">
          {Object.entries(categoriesData.data).map(
            ([categoryName, categoryContent]) => (
              <CategorySection
                key={categoryName}
                categoryName={categoryName}
                categoryContent={categoryContent}
              />
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
