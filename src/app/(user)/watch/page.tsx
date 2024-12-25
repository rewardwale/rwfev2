"use client";
import { VideoPlayer } from "./components/video-player";
import { VideoControls } from "./components/video-control";
import { VideoControlsProvider } from "./providers/video-control-provider";
import { Header } from "../home/components/header";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function WatchPage() {
  function navigateBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      console.warn("No history available to navigate back.");
    }
  }

  const router = useRouter();
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col h-screen bg-black">
      <main className="flex-1 relative">
        {!isMobile && (
          <div
            onClick={() => router.back()}
            className="absolute"
            style={{
              top: "5%",
              left: "2%",
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: "600",
              zIndex: "9999",
            }}
          >
            <span>Back</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full max-w-[400px] md:max-w-fit transition-all duration-400
              ease-in-out"
            style={{
              height: "-webkit-fill-available",
              paddingBlock: "12px",
            }}
            id="video-container"
          >
            <div className="h-full rounded-lg overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.75)]">
              <VideoControlsProvider>
                <VideoPlayer />
                <VideoControls />
              </VideoControlsProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
