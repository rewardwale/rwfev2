"use client";

import { StarRating } from "./StarRating";

export interface Question {
  id: string;
  text: string;
  rating: number;
}

interface QuestionRatingProps {
  question: Question;
  onRatingChange: (rating: number) => void;
  // onFeedbackChange: (feedback: string) => void;
}

export function QuestionRating({ question, onRatingChange }: QuestionRatingProps) {
  return (
    <div className="space-y-4 p-4 rounded-lg bg-secondary/20">
      <div className="space-y-2">
        <p className="font-medium">{question.text}</p>
        <div className="flex items-center gap-4">
          <StarRating value={question.rating} onChange={onRatingChange} />
          <span className="text-sm text-muted-foreground">
            {question.rating > 0 ? `${question.rating} out of 5` : "Not rated yet"}
          </span>
        </div>
      </div>
      {/* <textarea
        className="w-full min-h-[100px] p-3 rounded-md border bg-background"
        placeholder="Share your thoughts..."
        // value={question.feedback}
        // onChange={(e) => onFeedbackChange(e.target.value)}
      /> */}
    </div>
  );
}