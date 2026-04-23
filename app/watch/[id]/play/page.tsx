"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Pause, 
  FastForward, 
  Rewind, 
  Maximize, 
  Settings,
  Subtitles,
  X,
  Check
} from "lucide-react";

// Mock Data
const MOVIES_DETAILS = {
  "1": { title: "Oppenheimer", video: "/video/videoplayback.mp4" },
  "2": { title: "The Batman", video: "/video/videoplayback2.mp4" }
};

export default function PlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState("1080p");
  
  const movie = MOVIES_DETAILS[id as keyof typeof MOVIES_DETAILS];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls && !isHovering && !showSettings) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isHovering, showSettings]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (amount: number) => {
    if (videoRef.current) videoRef.current.currentTime += amount;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) playerContainerRef.current.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!movie) return null;

  return (
    <div 
      ref={playerContainerRef}
      className="relative h-screen w-screen bg-black overflow-hidden group/player select-none"
      onMouseMove={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={movie.video}
        className="h-full w-full"
        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onClick={togglePlay}
        autoPlay
        muted={isMuted}
        onEnded={() => router.back()}
      />

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 right-0 p-4 md:p-8 z-50 flex items-center justify-between transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button onClick={() => router.back()} className="flex items-center gap-2 md:gap-4 text-white">
          <ArrowLeft className="h-6 w-6 md:h-10 md:w-10" />
          <span className="text-lg md:text-2xl font-bold truncate max-w-[200px] md:max-w-none">{movie.title}</span>
        </button>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-24 right-4 md:bottom-32 md:right-12 z-50 w-56 md:w-64 rounded-xl bg-black/90 border border-white/10 backdrop-blur-xl p-4">
          <p className="text-xs md:text-sm font-bold text-gray-400 mb-3 px-2">ความคมชัด</p>
          <div className="space-y-1">
            {["4K", "1080p", "720p", "480p"].map((q) => (
              <button
                key={q}
                onClick={() => { setQuality(q); setShowSettings(false); }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${quality === q ? "bg-yellow-400 text-black" : "text-white hover:bg-white/10"}`}
              >
                {q}
                {quality === q && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Progress Bar */}
        <div className="group/progress relative mb-4 md:mb-8">
           <div className="flex justify-between text-[10px] md:text-sm mb-2 font-medium text-gray-300">
             <span>{formatTime(currentTime)}</span>
             <span>{formatTime(duration)}</span>
           </div>
           <div className="relative h-1.5 md:h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-red-600 z-10" style={{ width: `${(currentTime / duration) * 100}%` }} />
              <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full opacity-0 cursor-pointer z-20" />
           </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            <button onClick={() => skip(-10)} className="text-white active:scale-90"><Rewind className="h-7 w-7 md:h-10 md:w-10 fill-white" /></button>
            <button onClick={togglePlay} className="text-white active:scale-90">
              {isPlaying ? <Pause className="h-8 w-8 md:h-12 md:w-12 fill-white" /> : <Play className="h-8 w-8 md:h-12 md:w-12 fill-white" />}
            </button>
            <button onClick={() => skip(10)} className="text-white active:scale-90"><FastForward className="h-7 w-7 md:h-10 md:w-10 fill-white" /></button>
            <button onClick={() => setIsMuted(!isMuted)} className="text-white active:scale-90">
              {isMuted ? <VolumeX className="h-7 w-7 md:h-10 md:w-10 text-yellow-400" /> : <Volume2 className="h-7 w-7 md:h-10 md:w-10" />}
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-8 text-white">
            <button className="hidden sm:block"><Subtitles className="h-6 w-6 md:h-8 md:w-8" /></button>
            <button onClick={() => setShowSettings(!showSettings)} className={showSettings ? "text-yellow-400" : ""}><Settings className="h-6 w-6 md:h-8 md:w-8" /></button>
            <button onClick={toggleFullscreen}><Maximize className={`h-6 w-6 md:h-8 md:w-8 ${isFullscreen ? "text-yellow-400" : ""}`} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
