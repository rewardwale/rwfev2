import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowerList } from "./dataTypes";
import { Button } from "@/components/ui/button";
import { followUser, unFollowUser } from "@/apis/profile";
import { useEffect, useState } from "react";
import { UserRoundCheckIcon, UserRoundPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  item: FollowerList;
}

export default function FollowerItem({ item }: Props) {
  const router = useRouter();
  const [follow, setFollow] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("uib");
    const name = JSON.parse(data || "").userName;
    setFollow(item.isFollowed);
    if (name === item.userName) {
      setMyProfile(true);
    }
  }, []);

  const handleUnfollow = async () => {
    try {
      await unFollowUser(item.userId);
      setFollow(false);
      setIsOpen(false);
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4 w-full">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Avatar>
          <AvatarImage src={item?.profilePic?.original} />
          <AvatarFallback>
            {item?.firstName[0]}
            {item?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            className="text-xs sm:text-sm font-medium leading-none"
            onClick={() => router.push("/profile/" + item.userName)}
          >
            {item?.firstName} {item?.lastName}
          </p>
        </div>
      </div>
      {!myProfile && (
        <div>
          {follow ? (
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer">
                  <span>Following</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unfollow {item.firstName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to unfollow {item.firstName} {item.lastName}? You can follow them again later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnfollow}>
                    Unfollow
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={async () => {
                try {
                  await followUser(item.userId);
                  setFollow(true);
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <span
                style={{
                  background: "#4287f5",
                  padding: "2px 10px",
                  borderRadius: "5px",
                }}
              >
                Follow
              </span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
