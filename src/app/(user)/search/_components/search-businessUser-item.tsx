"use client"
import React, { useEffect } from "react";
import avatar from "../../../../../public/company-terms/character.png";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MerchantItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  const location = data.location ? data.location.split(",")[0] : "No Location";

  useEffect(() => {}, [data]);
  return (
    <div className="gap-2 flex flex-col">
      <div
        className="flex justify-center
     items-center relative"  onClick={() => router.push("/profile/" + data?.userName)}
      >
        <Avatar className="w-16 h-16 max-sm:w-12 max-sm:h-12 object-cover border-2">
          <AvatarImage
            src={data?.indPic?.thumbnail ?? null}
            width={100}
            height={100}
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div className="absolute max-sm:right-4 right-6 top-0 p-0 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#008539"
            className="bi bi-patch-check-fill"
            viewBox="0 0 16 16"
          >
            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
          </svg>
        </div>
      </div>

    
        <div className="text-center ">
          <p className="text-sm max-sm:text-[10px] font-medium leading-none w-24 overflow-hidden truncate">
            {" "}
            {data?.indFirstName} {data?.indLastName}
          </p>
          {/* <p className="text-sm max-sm:text-xs text-muted-foreground w-24 overflow-hidden truncate">
            {data?.indLastName}
          </p> */}
        </div>
      </div>


 
  );
}
