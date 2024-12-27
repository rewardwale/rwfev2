"use client"
import React, { useEffect } from "react";
import avatar from "../../../../../public/company-terms/character.png";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  useEffect(() => {}, [data]);
  return (
    <Card
      className=" px-4 py-2 max-sm:px-2 max-sm:py-2 
      max-sm:min-w-32 max-sm:max-w-52 min-w-52 max-w-72 space-y-3 max-sm:space-y-0 gap-4 
    rounded-md flex  items-center"
    >
      <Avatar className="w-20 h-20 max-sm:w-12 max-sm:h-12 object-cover">
        <AvatarImage
          src={data?.indPic?.thumbnail ?? null}
          width={100}
          height={100}
        />
        <AvatarFallback>OM</AvatarFallback>
      </Avatar>

      <div className=" space-y-1 max-sm:space-y-0.5">
        <p className="text-sm max-sm:text-[10px] font-medium leading-none w-24 overflow-hidden truncate">
          {" "}
          {data?.indFirstName}
        </p>
        <p className="text-sm max-sm:text-[10px] text-muted-foreground w-24 overflow-hidden truncate">
          {data?.indLastName}
        </p>
        {!data?.isFollow ? (
          <Button
            className="bg-blue-400 text-sm max-sm:text-[10px]"
            onClick={() => handleFollow(data._id)}
          >
            Follow
          </Button>
        ) : (
          <Badge
            className="p-1.5 text-sm max-sm:text-[10px] max-sm:p-0.5 max-sm:px-1 bg-yellow-100 text-slate-400 font-thin "
            variant="outline"
          >
            Following
          </Badge>
        )}
      </div>
    </Card>
  );
}
