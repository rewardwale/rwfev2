"use client";
import React, { useEffect } from "react";
// import avatar from "../../../../../public/company-terms/character.png";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

export default function UserItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  useEffect(() => {}, [data]);
  return (
    <div
      className="gap-3 flex flex-col justify-center
       items-center "
      onClick={() => router.push("/profile/" + data.userName)}
    >
      <div>
      <Avatar className="w-16 h-16 max-sm:w-12 max-sm:h-12 border-2 object-fill">
        <AvatarImage
          src={data?.indPic?.thumbnail ?? null}
          width={100}
          height={100}
          className="bg-white"
        />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>
      </div>
     

      <div className="text-center">
        <p
          className="text-sm max-sm:text-[10px] font-medium leading-none w-24 overflow-hidden
            truncate"
        >
          {" "}
          {data?.indFirstName} {data?.indLastName}
        </p>
        {/* <p className="text-sm max-sm:text-[10px] text-muted-foreground w-24 overflow-hidden truncate">
          {data?.indLastName}
        </p> */}
      </div>
    </div>
  );
}
