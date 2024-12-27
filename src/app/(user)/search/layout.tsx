import { ReactNode } from "react";
import { Suspense } from "react";
import { Sidebar } from "../home/components/sidebar";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-8 h-full overflow-scroll scrollbar-hide">
            <div className="max-w-7xl mx-auto">
            {children}
            </div>
          </main>
        </Suspense>
      </div>
    </div>
  );
}