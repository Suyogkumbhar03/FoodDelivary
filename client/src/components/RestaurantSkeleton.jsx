import React from 'react';

export default function RestaurantSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#161513] border border-[#2A2724] rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-[360px]"
        >
          {/* Hero Banner Skeleton */}
          <div className="h-48 bg-[#2A2724]/60 w-full relative">
            <div className="absolute top-3 left-3 w-24 h-5 rounded bg-[#2A2724]" />
            <div className="absolute top-3 right-3 w-14 h-5 rounded bg-[#2A2724]" />
          </div>

          {/* Info Skeleton */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-3/4 h-5 rounded bg-[#2A2724]/80" />
              <div className="w-1/2 h-3.5 rounded bg-[#2A2724]/40" />
            </div>

            <div className="pt-4 border-t border-[#2A2724]/60 flex items-center justify-between">
              <div className="w-16 h-4 rounded bg-[#2A2724]/60" />
              <div className="w-24 h-8 rounded-lg bg-[#2A2724]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
