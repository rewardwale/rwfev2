"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import LoadingUI from "../app/loading";
import { motion } from "framer-motion";
import HorizontalScrollWithArrows from "@/components/horizontalScrollWithArrows/HorizontalScrollWithArrows.component";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Hls from "hls.js";


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
  videoId: string;
  title: string;
  description: string;
  cdnThumbPath: string[];
  cdnVideoPath: string;
  cta1Action?: string;
  cta1URL?: string;
  cta2Action?: string;
  cta2URL?: string;
  isLive?: boolean;
  validity?: {
    from: string;
    to: string;
  };
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

const HLSVideo: React.FC<{
  src: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, poster, className, style }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Playback failed:", e));
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which has native HLS support
      video.src = src;
      video.play().catch((e) => console.log("Playback failed:", e));
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      className={className}
      style={style}
      autoPlay
      loop
      muted
      playsInline
    />
  );
};

const HeroSlideContent: React.FC<{
  slide: HeroSlide;
  isActive: boolean;
}> = ({ slide, isActive }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isActive) {
      setShowVideo(false);
      timeoutId = setTimeout(() => {
        if (slide.cdnVideoPath) {
          setShowVideo(true);
        }
      }, 3000);
    } else {
      setShowVideo(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isActive, slide.cdnVideoPath]);

  return (
    <div className="relative w-full h-[60vh]">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={slide.cdnThumbPath[0]}
          alt={slide.description}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-700 ease-in-out"
          priority
        />
      </div>
      
      {slide.cdnVideoPath && showVideo && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
          <HLSVideo
            src={slide.cdnVideoPath}
            poster={slide.cdnThumbPath[0]}
            className="w-full object-cover transition-transform duration-700 ease-in-out"
            style={{
              height: "60vh",
            }}
          />
        </div>
      )}
      
      <div
        className="absolute inset-0 flex flex-col justify-end p-8 transition-all duration-500"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)"
        }}
      >
        <h2 className="text-2xl text-white mb-2 transform transition-all duration-500 translate-y-0 opacity-100 font-semibold">
          {slide.title}
        </h2>
        <p className="text-xl text-white mb-6 transform transition-all duration-500 translate-y-0 opacity-100">
          {slide.description}
        </p>
        <div className="flex gap-6 transform transition-all duration-500 translate-y-0 opacity-100">
          {slide.cta1Action && slide.cta1URL && (
            <button
              onClick={() => window.open(slide.cta1URL, '_blank')}
              className="px-8 py-3 rounded-lg transition-all duration-300 bg-white text-black font-semibold hover:bg-opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 transform text-base uppercase tracking-wide"
            >
              {slide.cta1Action}
            </button>
          )}
          {slide.cta2Action && slide.cta2URL && (
            <button
              onClick={() => window.open(slide.cta2URL, '_blank')}
              className="px-8 py-3 rounded-lg transition-all duration-300 bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg active:scale-95 transform text-base uppercase tracking-wide"
            >
              {slide.cta2Action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroSection: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  console.log("HeroSection rendering with:", {
    slidesLength: slides?.length,
    firstSlide: slides?.[0],
    allSlides: slides
  });

  if (!slides || slides.length === 0) {
    console.log("No slides available for HeroSection");
    return null;
  }

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        navigation
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        effect="fade"
        loop={true}
        className="w-full h-[35rem]"
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        speed={1000}
        fadeEffect={{
          crossFade: true,
        }}
        onSlideChange={(swiper) => {
          console.log("Slide changed to:", swiper.realIndex);
          setActiveIndex(swiper.realIndex);
        }} 
      >
        {slides.map((slide, index) => {
          return (
            <SwiperSlide
              key={`${slide.videoId}-${index}`}
              className="transition-opacity duration-500 ease-in-out"
            >
              <HeroSlideContent 
                slide={slide} 
                isActive={index === activeIndex} 
              />
            </SwiperSlide>
          );
        })}
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
    <div
      style={{
        maxWidth: "min-content",
      }}
    >
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
        textAlign: "left",
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
}> = ({ categoryName, categoryContent }) => {
  console.log(`CategorySection - ${categoryName}:`, {
    hasAdvertisement: !!categoryContent?.advertisement,
    adLength: categoryContent?.advertisement?.length,
    fullContent: categoryContent
  });
  
  return (
    <div className="mb-12">
      <div
        className="text-2xl font-bold mb-4 pb-5"
        style={{
          fontSize: "32px",
          fontWeight: "600",
          marginBlock: "32px",
          marginLeft: "15px",
          textAlign: "left",
        }}
      >
        {categoryName}
      </div>
      {categoryContent?.advertisement && categoryContent.advertisement.length > 0 && (
        <div className="mb-8">
          <HeroSection slides={categoryContent.advertisement} />
        </div>
      )}
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
};


const LandingPage: React.FC<LandingPageProps> = ({ categoriesData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LandingPage Data:", {
      hasData: !!categoriesData?.data,
      categories: categoriesData?.data ? Object.keys(categoriesData.data) : [],
      fullData: categoriesData
    });
    
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
    console.log("No categoriesData available");
    return <LoadingUI />;
  }

  // Get global advertisements (null category)
  const globalAds = categoriesData.data["null"]?.advertisement || [];
  console.log("Global Ads:", {
    hasGlobalAds: !!globalAds?.length,
    adsCount: globalAds?.length,
    ads: globalAds
  });

  return (
    <>
      <div className="min-h-screen">
        {globalAds && globalAds.length > 0 && (
          <div className="mb-12">
            <HeroSection slides={globalAds} />
          </div>
        )}
        <div className="container mx-auto">
          {Object.entries(categoriesData.data)
            .filter(([categoryName]) => categoryName !== "null")
            .map(([categoryName, categoryContent]) => (
              <CategorySection
                key={categoryName}
                categoryName={categoryName}
                categoryContent={categoryContent}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
