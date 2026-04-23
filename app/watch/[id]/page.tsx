"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

// โหลด VideoPlayer เฉพาะฝั่ง Client เท่านั้นเพื่อแก้ปัญหา State Proxy Error ใน Next.js 15/16
const VideoPlayer = dynamic(() => import('@/components/video-player'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-black animate-pulse flex items-center justify-center text-white font-bold">กำลังโหลดตัวเล่น...</div>
});

// Mock Data
const MOVIES_DETAILS = {
  "1": { 
    title: "Oppenheimer", 
    poster: "/Oppenheimer.jpg",
    qualities: {
      "1080p": "/video/videoplayback.mp4",
      "720p": "/video/videoplayback.mp4"
    }
  },
  "2": { 
    title: "The Batman", 
    poster: "/batman.webp",
    qualities: {
      "1080p": "/video/videoplayback2.mp4",
      "720p": "/video/videoplayback2.mp4"
    }
  },
  "3": {
    title: "Arcane",
    poster: "/arcane-bg.jpg",
    episodes: [
      { 
        id: "e1", 
        title: "ตอนที่ 1: Welcome to the Playground", 
        qualities: {
          "1080p": "/video/videoplayback.mp4",
          "720p": "/video/videoplayback.mp4"
        }
      },
      { 
        id: "e2", 
        title: "ตอนที่ 2: Some Mysteries Are Better Left Unsolved", 
        qualities: {
          "1080p": "/video/videoplayback2.mp4"
        }
      }
    ]
  }
};

export default function PlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const epId = searchParams.get('ep');
  
  const movie = MOVIES_DETAILS[id as keyof typeof MOVIES_DETAILS];
  
  let currentQualities = (movie as any)?.qualities || {};
  let currentTitle = movie?.title;
  
  if ((movie as any)?.episodes && epId) {
    const episode = (movie as any).episodes.find((e: any) => e.id === epId);
    if (episode) {
      currentQualities = episode.qualities || {};
      currentTitle = `${movie.title} - ${episode.title}`;
    }
  }

  // เลือกคุณภาพเริ่มต้น (1080p ถ้ามี หรือตัวแรกที่เจอ)
  const defaultQuality = currentQualities["1080p"] ? "1080p" : Object.keys(currentQualities)[0];
  const initialVideo = currentQualities[defaultQuality];

  useEffect(() => {
    if (currentTitle) {
      document.title = `กำลังเล่น: ${currentTitle}`;
    }
  }, [currentTitle]);

  if (!movie) return null;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden group/player">
      
      {/* Top Bar - Custom Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-8 z-[100] flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 md:gap-4 text-white pointer-events-auto active:scale-95 transition-transform"
        >
          <ArrowLeft className="h-6 w-6 md:h-10 md:w-10" />
          <span className="text-lg md:text-2xl font-bold truncate max-w-[200px] md:max-w-none drop-shadow-lg">
            {currentTitle}
          </span>
        </button>
      </div>

      {/* Render the isolated Player component */}
      <VideoPlayer 
        key={`${id}-${epId}`} // Force re-render when switching episodes
        src={initialVideo} 
        qualities={currentQualities}
        title={currentTitle} 
        poster={movie.poster} 
        onEnded={() => router.back()}
      />

    </div>
  );
}
