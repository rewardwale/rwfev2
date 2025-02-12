"use client";
import React, { useEffect } from "react";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";

export default function MerchantItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  // const location = data.location ? data.location.split(",")[0] : "No Location";

  useEffect(() => {}, [data]);
  return (
    <div className="gap-2 flex flex-col cursor-pointer">
      <div
        className="flex justify-center items-center relative"
        onClick={() => router.push("/" + data?.handle)}
        style={{
          width:"120px",
          height:'100px',
          background:'grey',
          padding:'12px',
          borderRadius:'12px',
          fontSize:'16px',
          fontWeight:'500'
        
        }}
      >
        <div>{data?.handle}</div>
      </div>
    </div>
  );
}
