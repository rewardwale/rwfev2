"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import dynamic from "next/dynamic";

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

// Memoize the HLSVideo component
const HLSVideo = memo(
  ({
    src,
    poster,
    className,
    style,
    onVideoEnd,
  }: {
    src: string;
    poster: string;
    className?: string;
    style?: React.CSSProperties;
    onVideoEnd?: () => void;
  }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      let timeoutId: NodeJS.Timeout;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((e) => console.log("Playback failed:", e));
          timeoutId = setTimeout(() => {
            video.pause();
            if (onVideoEnd) onVideoEnd();
          }, 15000);
        });

        return () => {
          hls.destroy();
          if (timeoutId) clearTimeout(timeoutId);
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.play().catch((e) => console.log("Playback failed:", e));
        timeoutId = setTimeout(() => {
          video.pause();
          if (onVideoEnd) onVideoEnd();
        }, 15000);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [src, onVideoEnd]);

    return (
      <video
        ref={videoRef}
        poster={poster}
        className={className}
        style={style}
        autoPlay
        muted
        playsInline
      />
    );
  },
);

// Memoize the HeroSlideContent component
const HeroSlideContent = memo(
  ({ slide, isActive }: { slide: HeroSlide; isActive: boolean }) => {
    const [showVideo, setShowVideo] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      if (isActive) {
        setShowVideo(false);
        timeoutId = setTimeout(() => {
          if (slide.cdnVideoPath) {
            setShowVideo(true);
          }
        }, 2100);
      } else {
        setShowVideo(false);
      }

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [isActive, slide.cdnVideoPath]);

    const handleVideoEnd = useCallback(() => {
      setShowVideo(false);
      setTimeout(() => {
        if (slide.cdnVideoPath) {
          setShowVideo(true);
        }
      }, 2100);
    }, [slide.cdnVideoPath]);

    return (
      <div className="relative w-full h-[70vh] group">
        <div
          className={`absolute inset-0 transition-all duration-700
            ${showVideo ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
        >
          <Image
            src={slide.cdnThumbPath[0]}
            alt={slide.description}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority={isActive}
            sizes="100vw"
            quality={85}
          />
        </div>

        {slide.cdnVideoPath && showVideo && (
          <div
            className={`absolute inset-0 transition-all duration-700
            ${showVideo ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          >
            <HLSVideo
              src={slide.cdnVideoPath}
              poster={slide.cdnThumbPath[0]}
              className="w-full object-cover transition-transform duration-500 ease-in-out
                group-hover:scale-105"
              style={{
                height: "70vh",
              }}
              onVideoEnd={handleVideoEnd}
            />
          </div>
        )}

        <div
          className="absolute inset-0 flex flex-col justify-end p-12 transition-all duration-350
            bg-gradient-to-t from-black/90 via-black/50 to-transparent
            group-hover:from-black/95"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.14 }}
            className="text-4xl text-white mb-4 transform transition-all duration-350 translate-y-0
              opacity-100 font-bold"
          >
            {slide.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.28 }}
            className="text-xl text-white/90 mb-8 transform transition-all duration-350 translate-y-0
              opacity-100 max-w-2xl"
          >
            {slide.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.42 }}
            className={`flex gap-6 transform transition-all duration-350 translate-y-0 opacity-100
              ${isMobile ? "justify-center" : "justify-start"}`}
          >
            {slide.cta1Action && slide.cta1URL && (
              <button
                onClick={() => window.open(slide.cta1URL, "_blank")}
                className="rounded-lg transition-all duration-210 bg-white text-black font-semibold
                  hover:bg-opacity-90 hover:scale-105 hover:shadow-xl active:scale-95 transform
                  text-base uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  paddingInline: "28px",
                  paddingBlock: "12px",
                }}
              >
                {slide.cta1Action}
              </button>
            )}
            {slide.cta2Action && slide.cta2URL && (
              <button
                onClick={() => window.open(slide.cta2URL, "_blank")}
                className="rounded-lg transition-all duration-210 bg-white text-black font-semibold
                  hover:bg-opacity-90 hover:scale-105 hover:shadow-xl active:scale-95 transform
                  text-base uppercase tracking-wide"
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  paddingInline: "28px",
                  paddingBlock: "12px",
                  lineHeight: "20px",
                }}
              >
                {slide.cta2Action}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  },
);

const HeroSection: React.FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          color: white !important;
        }
        .swiper-pagination {
          position: absolute !important;
          bottom: 20px !important;
          z-index: 10 !important;
        }
        .swiper-pagination-bullet {
          width: 10px !important;
          height: 10px !important;
          background: rgba(255, 255, 255, 0.6) !important;
          opacity: 0.6 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          opacity: 1 !important;
          width: 12px !important;
          height: 12px !important;
        }
      `}</style>
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectFade]}
        navigation
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        effect="fade"
        loop={true}
        allowTouchMove={false}
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
          setActiveIndex(swiper.realIndex);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={`${slide.videoId}-${index}`}
            className="transition-opacity duration-500 ease-in-out"
          >
            <HeroSlideContent slide={slide} isActive={index === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// Memoize the ShortCard component
const ShortCard = memo(
  ({
    title,
    description,
    totalViewCount,
    cdnThumbPath,
    cdnVideoPath,
    videoId,
  }: ShortCardProps) => {
    const router = useRouter();

    const handleClick = useCallback(() => {
      router.push(`/watch?v=${videoId}`);
    }, [router, videoId]);

    return (
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.14 }}
        style={{
          maxWidth: "min-content",
        }}
      >
        <Card
          className="w-[200px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl
            transition-all duration-210 hover:scale-[1.02] bg-black/5 backdrop-blur-sm"
          onClick={handleClick}
        >
          <CardContent className="p-0">
            <motion.div
              className="relative w-full overflow-hidden rounded-md"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.14 }}
              whileTap={{ scale: 0.98 }}
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
                loading="lazy"
              />
            </motion.div>
            <div className="p-4 space-y-2">
              <p
                className="font-semibold text-lg line-clamp-2 h-[3.6rem]"
                style={{
                  height: "2rem",
                }}
              >
                {title}
              </p>
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-[2.8rem]"
                style={{
                  height: "4rem",
                  width: "14rem",
                }}
              >
                {description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{totalViewCount.toLocaleString()} views</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

// Memoize the SubHeadingContent component
const SubHeadingContent = memo(
  ({ title, cards }: { title: string; cards: ShortCardProps[] }) => {
    const cardComponents = useMemo(
      () =>
        cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ShortCard {...card} />
          </motion.div>
        )),
      [cards],
    );

    return (
      <div className="mb-16">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold pl-5 flex items-center gap-2 p-3"
        >
          <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
          {title}
        </motion.h3>
        <div className="">
          <div className="flex space-x-6 p-4 min-w-max scrollbar-hide">
            <HorizontalScrollWithArrows
              arrowType="white"
              data={cards}
              className="pl-5"
            >
              {cardComponents}
            </HorizontalScrollWithArrows>
          </div>
        </div>
      </div>
    );
  },
);

// Memoize the CategorySection component
const CategorySection = memo(
  ({
    categoryName,
    categoryContent,
  }: {
    categoryName: string;
    categoryContent: CategoryData[string];
  }) => {
    const sections = useMemo(
      () =>
        ["popular", "trending", "nearby"].map(
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
        ),
      [categoryContent],
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 p-3 flex"
          style={{
            textAlign: "start",
          }}
        >
          {categoryName}
        </motion.div>
        {categoryContent?.advertisement &&
          categoryContent.advertisement.length > 0 && (
            <div className="mb-12">
              <HeroSection slides={categoryContent.advertisement} />
            </div>
          )}
        {sections}
      </motion.div>
    );
  },
);

const LandingPage: React.FC<LandingPageProps> = ({ categoriesData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("LandingPage Data:", {
      hasData: !!categoriesData?.data,
      categories: categoriesData?.data ? Object.keys(categoriesData.data) : [],
      fullData: categoriesData,
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
    ads: globalAds,
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
