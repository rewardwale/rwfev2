"use client"
import React, { useEffect } from "react";
import avatar from "../../../../../public/company-terms/character.png";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AllUserItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  console.log("data",data)
  useEffect(() => {}, [data]);
  return (
    <Card
      className="  px-4 py-2 w-full space-y-3 my-3
    rounded-md flex border-none shadow-none  items-center justify-between"
    >
      <div className="flex items-center justify-center gap-2" onClick={()=>router.push("/profile/"+data?.userName)}>
        <Avatar className="w-12 h-12 object-cover">
          <AvatarImage
            src={data?.indPic?.thumbnail ?? avatar}
            width={100}
            height={100}
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>

        <div className=" space-y-1">
          <p className="text-sm max-sm:text-xs font-medium leading-none max-sm:max-w-28  overflow-hidden truncate">
            {" "}
            {data?.indFirstName}
          </p>
          <p className="text-sm max-sm:text-xs text-muted-foreground max-sm:w-28   overflow-hidden truncate">
            {data?.indLastName}
          </p>
        </div>
      </div>

      {/* {!data?.isFollow ? (
        <Button
          className="bg-blue-400 max-sm:text-xs"
          onClick={() => handleFollow(data?.individualId || "")}
        >
          Follow
        </Button>
      ) : (
        <Badge
          className="p-1.5 max-sm:p-1 bg-yellow-100 text-slate-600 font-thin max-sm:text-[10px]"
          variant="outline"
        >
          Following
        </Badge>
      )} */}
    </Card>
  );
}
