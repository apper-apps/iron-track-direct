import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-surface rounded-lg"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-surface rounded w-3/4"></div>
          <div className="h-3 bg-surface rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-20 bg-surface rounded-lg"></div>
        <div className="h-20 bg-surface rounded-lg"></div>
        <div className="h-20 bg-surface rounded-lg"></div>
      </div>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-surface rounded-lg"></div>
        <div className="h-16 bg-surface rounded-lg"></div>
        <div className="h-16 bg-surface rounded-lg"></div>
      </div>
    </div>
  );
};

export default Loading;