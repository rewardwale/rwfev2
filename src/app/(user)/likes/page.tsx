"use client";

import { useEffect, useState } from "react";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { getLikedVideos } from "@/apis/home";
import { useIsMobile } from "@/hooks/use-mobile";

interface LikedVideo {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePic: {
    original: string;
    thumbnail: string;
  };
  isOwnProfile: boolean;
  isFollow: boolean;
  likeDateTime: string;
}

export default function LikesPage() {
  const [likes, setLikes] = useState<LikedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await getLikedVideos();
        if (response.success && response.data?.data?.data) {
          setLikes(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : likes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No liked videos found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {likes.map((like) => (
                <Card
                  key={like._id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/profile/${like.userName}`)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={like.profilePic.thumbnail} />
                      <AvatarFallback>{like.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {like.firstName} {like.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        @{like.userName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Liked{" "}
                        {formatDistanceToNow(new Date(like.likeDateTime), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
