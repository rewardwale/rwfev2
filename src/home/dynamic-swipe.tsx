'use client'

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

interface HeroSlide {
  cdnThumbPath: string;
  cdnVideoPath: string;
  description: string;
}

interface DynamicSwiperProps {
  slides: HeroSlide[];
}

const DynamicSwiper: React.FC<DynamicSwiperProps> = ({ slides }) => {
  return (
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
                height:'60vh',
                marginBottom:'2rem'
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
  );
};

export default DynamicSwiper;