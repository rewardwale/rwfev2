"use client";

import { Button } from "@/components/ui/button";
import {ArrowUp, ArrowDown } from "lucide-react";

interface ScrollButtonProps {
  direction: "up" | "down";
  onClick: () => void;
  disabled?: boolean;
}

export function ScrollButton({ direction, onClick, disabled }: ScrollButtonProps) {
  return (
    <Button
      variant="secondary"
      size="icon"
      className={`right-4 ${
        direction === "up" ? "top-20" : "bottom-4"
      } bg-white/10 hover:bg-white/20 backdrop-blur-sm`}
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "up" ? (
        <ArrowUp  className="h-6 w-6"  />
      ) : (
        <ArrowDown className="h-6 w-6" />
      )}
    </Button>
  );
}