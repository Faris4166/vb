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
  "1": {
    title: "Oppenheimer",
    video: "/video/videoplayback.mp4",
  },
  "2": {
    title: "The Batman",
    video: "/video/videoplayback2.mp4",
  }
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
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!movie) return null;

  return (
    <div 
      ref={playerContainerRef}
      className="relative h-screen w-screen bg-black overflow-hidden group/player select-none"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={movie.video}
        className="h-full w-full cursor-pointer"
        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onClick={togglePlay}
        autoPlay
        muted={isMuted}
        onEnded={() => router.back()}
      />

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 right-0 p-8 z-50 flex items-center justify-between transition-opacity duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
        <button onClick={() => router.back()} className="flex items-center gap-4 text-white hover:scale-105 transition-all">
          <ArrowLeft className="h-10 w-10" />
          <span className="text-2xl font-bold tracking-tight">{movie.title}</span>
        </button>
        <button onClick={() => router.back()} className="h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
          <X className="h-8 w-8" />
        </button>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-32 right-12 z-50 w-64 rounded-xl bg-black/80 border border-white/10 backdrop-blur-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm font-bold text-gray-400 mb-3 px-2">ความคมชัด</p>
          <div className="space-y-1">
            {["4K (Ultra HD)", "1080p (Full HD)", "720p", "480p"].map((q) => (
              <button
                key={q}
                onClick={() => { setQuality(q); setShowSettings(false); }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${quality === q ? "bg-yellow-400 text-black" : "text-white hover:bg-white/10"}`}
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
        className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-all duration-500 ${showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="group/progress relative mb-6">
           <div className="flex justify-between text-sm mb-3 font-medium text-gray-300">
             <span>{formatTime(currentTime)}</span>
             <span className="text-gray-500">-{formatTime(duration - currentTime)}</span>
           </div>
           <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden group-hover/progress:h-2 transition-all">
              <div className="absolute top-0 left-0 h-full bg-red-600 z-10" style={{ width: `${(currentTime / duration) * 100}%` }} />
              <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full opacity-0 cursor-pointer z-20" />
           </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <button onClick={togglePlay} className="hover:scale-110 transition-transform text-white">{isPlaying ? <Pause className="h-10 w-10 fill-white" /> : <Play className="h-10 w-10 fill-white" />}</button>
            <button onClick={() => skip(-10)} className="hover:scale-110 transition-transform flex flex-col items-center text-white"><Rewind className="h-8 w-8 fill-white" /><span className="text-[10px] font-bold mt-1">10</span></button>
            <button onClick={() => skip(10)} className="hover:scale-110 transition-transform flex flex-col items-center text-white"><FastForward className="h-8 w-8 fill-white" /><span className="text-[10px] font-bold mt-1">10</span></button>
            <button onClick={() => setIsMuted(!isMuted)} className="hover:scale-110 transition-transform text-white">
              {isMuted ? <VolumeX className="h-8 w-8 text-yellow-400" /> : <Volume2 className="h-8 w-8" />}
            </button>
          </div>
          <div className="flex items-center gap-6 md:gap-8 text-white">
            <button className="hover:scale-110 transition-transform"><Subtitles className="h-7 w-7" /></button>
            <button onClick={() => setShowSettings(!showSettings)} className={`hover:scale-110 transition-transform ${showSettings ? "text-yellow-400" : ""}`}><Settings className="h-7 w-7" /></button>
            <button onClick={toggleFullscreen} className="hover:scale-110 transition-transform"><Maximize className={`h-7 w-7 ${isFullscreen ? "text-yellow-400" : ""}`} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
