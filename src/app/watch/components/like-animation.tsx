"use client";

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface LikeAnimationProps {
  isLike: boolean;
  show: boolean;
}

export function LikeAnimation({ isLike, show }: LikeAnimationProps) {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (show) {
      setAnimationClass('animate-in');
      const timer = setTimeout(() => {
        setAnimationClass('animate-out');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return show ? (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
      <div
        className={`transform transition-all duration-500 ${animationClass} ${
          animationClass === 'animate-in'
            ? 'scale-100 opacity-100'
            : 'scale-150 opacity-0'
        }`}
      >
        {isLike ? (
          <ThumbsUp className="w-24 h-24 text-purple-500 fill-white" />
        ) : (
          <ThumbsDown className="w-24 h-24 text-purple-500 fill-white" />
        )}
      </div>
    </div>
  ) : null;
}