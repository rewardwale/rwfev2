"use client"
import React, { useEffect } from "react";
import avatar from "../../../../../public/company-terms/character.png";
import { userProps } from "@/lib/searchTypes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AllMerchantItem({ data, handleFollow }: userProps) {
  let router = useRouter();
  const location = data.location ? data.location : "No Location";
  useEffect(() => {}, [data]);
  return (
    <Card
      className=" px-4 py-2 w-full space-y-3 my-3
    rounded-md flex border-none shadow-none  items-center justify-between"
    >
      <div className="flex items-center justify-center gap-4 ">
        <div className="relative space-y-2 justify-center items-center">
          <Avatar className="w-12 h-12 object-cover ">
            <AvatarImage
              src={data?.indPic?.thumbnail ?? avatar}
              width={100}
              height={100}
            />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>

          <Badge variant={"default"} className="rounded-full bg-emerald-600">
            4.5
          </Badge>
        </div>

        <div className=" space-y-1.5 ">
          <div className="flex items-end gap-0.5">
            <p className="text-sm font-medium leading-none max-sm:max-w-28  overflow-hidden truncate">
              {" "}
              {data?.indFirstName}
            </p>
            <p className="text-sm font-medium leading-none">.</p>
            <div className="">
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

          <p className="text-sm text-muted-foreground max-sm:w-28   overflow-hidden truncate">
            {data?.indLastName}{" "}
          </p>

          <Badge
            className="flex justify-between items-center gap-1 p-1 bg-emerald-400 "
            variant={"default"}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="red"
                className="bi bi-geo-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"
                />
              </svg>
            </span>
            <span className="text-xs text-white max-sm:w-28 overflow-hidden text-wrap ">
              {location}
            </span>
          </Badge>
          <Badge
            className="text-xs text-muted-foreground pl-2 bg-purple-400
          font-thin text-white"
          >
            11m away from you
          </Badge>
        </div>
      </div>

      {!data?.isFollow ? (
        <Button
          className="bg-blue-400 max-sm:text-xs"
          onClick={() => handleFollow(data._id)}
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
      )}
    </Card>
  );
}
