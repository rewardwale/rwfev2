"use client"
import Image from "next/image";
import { cn } from "@/lib/utils";
import { videoProps } from "@/lib/searchTypes";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function AllVideoCardItem({
  data,
  height,
  width,
  aspectRatio,
  className,
  ...props
}: videoProps) {
  const router = useRouter();
  return (
  <div className={cn(" relative", className)} {...props}>
      <div className="overflow-hidden relative cursor-pointer" 
      onClick={() => router.push("/watch?v=" + data.videoId)}
>
        <Image
          src={data.cdnThumbPath[0]}
          alt={data.title}
          width={width}
          height={height}
          className={
            "h-auto w-auto object-cover transition-all hover:scale-105 rounded-md"
          }
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/90
            rounded-md"
        />

        <div className="flex-1 min-w-0 absolute bottom-0 p-2">
          <p
            className={`font-semibold sm:text-sm text-md text-ellipsis overflow-hidden whitespace-nowrap
              text-pretty w-full h-5 hover:h-auto text-white cursor-pointer`}
          >
            {data.title}
          </p>

          <div className="flex items-center gap-1 sm:text-xs text-[8px] text-white/70">
            <span>{data.totalViewCount.toLocaleString()} views</span>
            <span>•</span>
            <span>{data.avgRating} ★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
