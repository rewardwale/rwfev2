import { Suspense } from "react";
import { Sidebar } from "../home/components/sidebar";
import BookMarkComponent from "./components/bookmark";

export default function BookMark() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-8">
            <div className="max-w-7xl mx-auto">
              <BookMarkComponent />
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  );
}
