"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import WorkImage1 from "../../../../public/company-terms/Content creator-bro 2.png";
import WorkImage2 from "../../../../public/company-terms/Video upload-bro 4.png";
import WorkImage3 from "../../../../public/company-terms/Send gift-bro 2.png";
import WorkImage4 from "../../../../public/company-terms/Followers-bro (1) 2.png";
import WorkImage5 from "../../../../public/company-terms/Data analysis-bro 2.png";
import Background1 from "../../../../public/company-terms/bg02.png";
import { Header } from "@/components/layout";

export default function HowItsWork() {
  const router = useRouter();
  return (
    <div>
      <head>
        <meta
          name="How It Works | RewardWale's Simple Rewarding Process"
          content="Discover the easy steps to earning cashback and rewards on RewardWale. Our How It Works page explains how to participate, redeem rewards, and enjoy the benefits of our platform.
"
        />
      </head>
      <Header />

      <div className="absolute -z-10 inset-0 top-19 max-sm:hidden">
        <Image
          src={Background1}
          alt="background"
          className="bg-[#F7F7F7] dark:bg-zinc-900 4k:h-[160em] w-screen md:h-[120em] xl:h-[150em]"
        />
      </div>
      <section className=" top-20 bg-white dark:bg-zinc-900  min-h-screen md:border md:rounded-lg flex justify-center md:my-10 md:mx-12 lg:mx-40 shadow-lg shadow-violet-200 text-neutral-700 dark:text-stone-300">
        <div className="flex-col justify-start gap-7 inline-flex p-7 max-xl:max-w-2xl">
          <h1 className="text-neutral-700 text-2xl 4k:text-5xl font-semibold text-center dark:text-zinc-300">
            How it <span className="text-violet-600">Works</span> ?
          </h1>
          <p className="text-xs 2xl:text-xl 4k:text-4xl md:text-base text-center lg:text-lg">
            As users share video reviews, others gain insights by reading these
            real-world experiences. Merchants, on the other hand, can actively
            manage their profiles, engage with reviews, and cultivate customer
            loyalty through rewarding interactions.
          </p>
          <div className="flex gap-7 md:gap-5 4k:gap-[10em] xl:gap-10 flex-1 justify-center items-center md:text-justify text-xs md:text-base">
            <div className="md:w-96 lg:text-xl 4k:text-4xl text-left">
              User can record a short review video of a product, service or an
              experience.
            </div>
            <div>
              <h1 className="text-center text-violet-600 text-4xl 4k:text-7xl font-semibold">
                1
              </h1>
            </div>
            <div className="md:w-96 md:h-86">
              <Image
                className="max-w-full h-auto"
                src={WorkImage1}
                width={420}
                height={420}
                alt="image"
              />
            </div>
          </div>

          <div className="flex gap-7 md:gap-5 xl:gap-10 4k:gap-[10em] flex-1 justify-center items-center md:text-justify text-xs md:text-base">
            <div className="md:w-96 md:h-86">
              <Image
                className="max-w-full  h-auto"
                src={WorkImage2}
                width={420}
                height={420}
                alt="image"
              />
            </div>
            <div>
              <h1 className="text-center text-violet-600 text-4xl 4k:text-7xl font-semibold">
                2
              </h1>
            </div>
            <div className="md:w-96 lg:text-xl 4k:text-4xl text-left">
              User uploads video on Rewardwale app
            </div>
          </div>

          <div className="flex gap-7 md:gap-5 xl:gap-10 flex-1 4k:gap-[10em] justify-center items-center md:text-justify text-xs md:text-base">
            <div className="md:w-96 lg:text-xl 4k:text-4xl text-left">
              Users get rewarded by Rewardwale/Merchants for uploading videos
              based on the likes/upvotes
            </div>
            <div>
              <h1 className="text-center text-violet-600 text-4xl 4k:text-7xl font-semibold">
                3
              </h1>
            </div>
            <div className="md:w-96 md:h-86">
              <Image
                className="max-w-full  h-auto"
                src={WorkImage3}
                width={420}
                height={420}
                alt="image"
              />
            </div>
          </div>

          <div className="flex gap-7  md:gap-5 xl:gap-10 4k:gap-[10em] flex-1 justify-center items-center md:text-justify text-xs md:text-base">
            <div className="md:w-96 md:h-86">
              <Image
                className="max-w-full  h-auto"
                src={WorkImage4}
                width={420}
                height={420}
                alt="image"
              />
            </div>
            <div>
              <h1 className="text-center text-violet-600 text-4xl 4k:text-7xl font-semibold">
                4
              </h1>
            </div>
            <div className="md:w-96 lg:text-xl 4k:text-4xl text-left">
              Viewers get rewarded by Rewardwale/Merchants for actions on videos
            </div>
          </div>

          <div className="flex gap-7 md:gap-5 xl:gap-10 4k:gap-[10em] flex-1 justify-center items-center md:text-justify text-xs md:text-base">
            <div className="md:w-96 lg:text-xl 4k:text-4xl text-left">
              Merchant watches videos, derives analytics & takes action
            </div>
            <div>
              <h1 className="text-center text-violet-600 text-4xl 4k:text-7xl font-semibold">
                5
              </h1>
            </div>
            <div className="md:w-96 md:h-86">
              <Image
                className="max-w-full  h-auto"
                src={WorkImage5}
                width={420}
                height={420}
                alt="image"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
