import { Header } from "@/app/home/components/header";
import { VideoPlayer } from "./components/video-player";
import { VideoControls } from "./components/video-control";
import { VideoControlsProvider } from "./providers/video-control-provider";

export default function WatchPage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full max-w-[400px] md:max-w-fit  transition-all duration-400 ease-in-out"
            style={{
              height: "-webkit-fill-available",
              paddingBlock:'12px'
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
