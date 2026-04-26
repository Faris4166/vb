import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-900 border border-white/5" />
      
      {/* Title & Info Skeleton */}
      <div className="space-y-2 px-1">
        <div className="h-4 w-3/4 bg-zinc-800 rounded" />
        <div className="flex gap-2">
          <div className="h-3 w-10 bg-zinc-800 rounded" />
          <div className="h-3 w-10 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full bg-zinc-900 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-20 left-6 md:left-16 lg:left-24 space-y-4 max-w-2xl">
        <div className="h-12 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-20 w-full bg-zinc-800 rounded-lg" />
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-zinc-800 rounded-xl" />
          <div className="h-12 w-32 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetails() {
  return (
    <div className="min-h-screen bg-black animate-pulse">
      <div className="h-[50vh] md:h-[70vh] w-full bg-zinc-900" />
      <div className="px-6 md:px-16 lg:px-24 -mt-32 relative z-10 space-y-6">
        <div className="h-16 w-64 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-48 bg-zinc-800 rounded" />
        <div className="h-24 w-full max-w-2xl bg-zinc-800 rounded-lg" />
        <div className="flex gap-4">
          <div className="h-14 w-40 bg-zinc-800 rounded-xl" />
          <div className="h-14 w-14 bg-zinc-800 rounded-full" />
          <div className="h-14 w-14 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}
