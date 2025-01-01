"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  onChange: (rating: number) => void;
  value?: number;
  type?: "interactive" | "static";
}

export function StarRating({ onChange, value, type = "interactive" }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-transform ${type === "interactive" ? "hover:scale-110" : ""}`}
          onMouseEnter={() => type === "interactive" && setHoverRating(star)}
          onMouseLeave={() => type === "interactive" && setHoverRating(0)}
          onClick={() => type === "interactive" && onChange(star)}
          disabled={type !== "interactive"}
        >
          <Star
            className={`h-8 w-8 ${
              ((hoverRating || value) ?? 0) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
