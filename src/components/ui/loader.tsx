"use client";

import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
  return (
    <div className={`
      fixed inset-0 
      ${fullScreen ? 'z-50' : 'z-40'} 
      flex items-center justify-center 
      bg-black/50 backdrop-blur-sm
    `}>
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-white text-lg font-medium">Please wait while we submit your details</span>
      </div>
    </div>
  );
};

export default Loader;