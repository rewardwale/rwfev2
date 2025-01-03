"use client";

import { Loader2 } from "lucide-react";

export function VideoLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-white/80 text-sm">Loading video...</p>
      </div>
    </div>
  );
}