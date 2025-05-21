"use client";

import { useEffect, useState } from "react";
import { Header } from "../home/components/header";
import { Sidebar } from "../home/components/sidebar";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useIsMobile } from "@/hooks/use-mobile";
import { getViewingHistory } from "@/apis/home";

interface HistoryItem {
  _id: string;
  videoId: string;
  title: string;
  reviewerUserName: string;
  totalViewCount: number;
  desc: string;
  cdnVideoPath: string;
  cdnThumbPath: string[];
  isAdvertisement: boolean;
  viewedOn: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getViewingHistory();
        if (response.success && response.data?.data?.data) {
          setHistory(response.data.data.data);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {!isMobile && <Sidebar />}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Viewing History</h1>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative w-full pb-[56.25%] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No viewing history found
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4
                gap-4"
            >
              {history.map((item) => (
                <Card
                  key={item._id}
                  className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] border
                    border-border"
                  onClick={() => router.push(`/watch?v=${item.videoId}`)}
                >
                  <div className="relative w-full pb-[90%] bg-muted">
                    <Image
                      src={item.cdnThumbPath[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.desc}
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                      <span>{item.reviewerUserName}</span>
                      <span>
                        {formatDistanceToNow(new Date(item.viewedOn), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {item.isAdvertisement && (
                      <div className="text-[10px] text-orange-600 font-semibold uppercase mt-1">
                        Sponsored
                      </div>
                    )}
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