"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  onChange: (rating: number) => void;
  value?: number;
}

export function StarRating({ onChange, value }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="transition-transform hover:scale-110"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-8 w-8 ${
              (hoverRating || value) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}