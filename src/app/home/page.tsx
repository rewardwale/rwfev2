import { Suspense } from "react";
import { Sidebar } from "./components/sidebar";
import { Header } from "./components/header";
import { VideoFeed } from "./components/video-feed";
import { CategoryFilter } from "./components/category-filter";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
        <CategoryFilter />
        <Suspense fallback={<div>Loading...</div>}>
          <VideoFeed />
        </Suspense>
        {/* <Footer/> */}
      </div>
    </div>
  );
}

//reference needed