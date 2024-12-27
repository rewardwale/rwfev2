"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { videoProps } from "@/lib/searchTypes";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";

export default function VideoCardItem({
  data,
  height,
  width,
  aspectRatio,
  className,
  ...props
}: videoProps) {
  const [brief,setBrief]=useState<boolean>(false);
  return (
    <div className={cn(" relative", className)} {...props}>
      <div className="overflow-hidden relative">
        <Image
          src={data.cdnThumbPath[0]}
          alt={data.title}
          width={width}
          height={height}
          className={cn(
            "h-auto w-auto object-cover transition-all hover:scale-105 rounded-t-md",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
          )}
        />
        <p
          className={`absolute px-1 bottom-0 text-sm text-ellipsis overflow-hidden whitespace-nowrap
            text-pretty w-full h-5 hover:h-auto text-white bg-black/20` }
        >
          {data.title}
        </p>
      </div>
      <div className="h-20 bg-slate-700/50 rounded-b-md p-1 overflow-hidden"></div>
    </div>
  );
}
