"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Rewind, 
  FastForward,
  Settings,
  Subtitles,
  Check
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  src: string;
  qualities?: Record<string, string>; // { "1080p": "url1", "720p": "url2" }
  title: string;
  poster: string;
  onEnded?: () => void;
  hasNext?: boolean;
  onNext?: () => void;
  startTime?: number; // เริ่มต้นที่วินาทีที่...
  onProgress?: (currentTime: number, duration: number) => void;
}

export default function VideoPlayer({ src, qualities = {}, title, poster, onEnded, hasNext, onNext, startTime = 0, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentSrc, setCurrentSrc] = useState(src);

  // Sync currentSrc with src prop when it changes
  useEffect(() => {
    setCurrentSrc(src);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState("1080p");
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // เพิ่มสถานะการโหลด

  // Sync playing state with video element
  useEffect(() => {
    let isMounted = true;
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = async () => {
      if (playing) {
        try {
          await video.play();
        } catch (e: any) {
          if (e.name === "NotAllowedError") {
            // Browser blocked auto-play with sound, try muted
            console.warn("Auto-play with sound blocked, muting...");
            setMuted(true);
            try {
              await video.play();
            } catch (err) {
              setPlaying(false);
            }
          } else if (e.name === "AbortError") {
            // Ignore abort
          } else {
            console.warn("Playback error:", e);
            if (isMounted) setPlaying(false);
          }
        }
      } else {
        video.pause();
      }
    };

    handlePlay();

    return () => {
      isMounted = false;
      video.pause();
    };
  }, [playing]);

  // Sync muted and volume
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    videoRef.current.volume = volume;
  }, [muted, volume]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showControls && playing) {
      timer = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showControls, playing]);

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);

  const handleTimeUpdate = () => {
    if (!seeking && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setPlayed(currentTime / duration);
      onProgress?.(currentTime, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // ข้ามไปยังเวลาที่ดูค้างไว้
      if (startTime > 0) {
        videoRef.current.currentTime = startTime;
      }
      
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      const label = height >= 2160 ? "4K" : height >= 1080 ? "1080p" : height >= 720 ? "720p" : "SD";
      setQuality(`${label} (Original)`);
      setIsReady(true);
      setIsLoading(false);
    }
  };

  const handleDurationChange = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleQualityChange = (newQuality: string) => {
    if (newQuality === quality) return;
    
    const currentTime = videoRef.current?.currentTime || 0;
    const wasPlaying = playing;
    
    const newSrc = qualities[newQuality];
    if (!newSrc) return;

    setIsLoading(true);
    setQuality(newQuality);
    setCurrentSrc(newSrc);
    setShowSettings(false);
    
    // โหลดไฟล์ใหม่และขยับเวลาไปที่เดิม
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) {
          videoRef.current.play().catch(() => {});
          setPlaying(true);
        }
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0]);
    setSeeking(true);
  };

  const handleSeekCommit = (value: number[]) => {
    setSeeking(false);
    if (videoRef.current) {
      videoRef.current.currentTime = value[0] * videoRef.current.duration;
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
          // iOS Safari fallback
          (videoRef.current as any).webkitEnterFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    return `${mm}:${ss}`;
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full bg-black overflow-hidden group/player select-none touch-none"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={currentSrc}
        poster={poster}
        className="h-full w-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onDurationChange={handleDurationChange}
        onCanPlay={handleCanPlay}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={onEnded}
        playsInline
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="h-12 w-12 md:h-16 md:w-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Overlay - Click to toggle play */}
      <div 
        className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        {/* Big Play Button - Shows only when paused by user */}
        {!playing && isReady && (
          <div className="group/playbtn bg-yellow-400/90 hover:bg-yellow-400 p-6 md:p-8 rounded-full shadow-[0_0_50px_rgba(250,204,21,0.3)] transform transition-all duration-300 hover:scale-110 active:scale-90">
            <Play className="h-10 w-10 md:h-16 md:w-16 fill-black text-black ml-1" />
          </div>
        )}
      </div>

      {/* Controls Container */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-between transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        
        {/* Top Gradient */}
        <div className="h-32 bg-gradient-to-b from-black/80 to-transparent p-8" />

        {/* Bottom Controls */}
        <div className="bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-12 space-y-4">
          
          {/* Progress Bar */}
          <div className="group/progress relative mb-2">
            <div className="flex justify-between text-xs md:text-sm text-gray-300 mb-2 font-medium">
              <span>{formatTime(played * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[played]}
              max={1}
              step={0.001}
              onValueChange={handleSeekChange}
              onValueCommit={handleSeekCommit}
              className="cursor-pointer"
            />
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-10">
              <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="text-white hover:text-yellow-400 transition-colors">
                <Rewind className="h-6 w-6 md:h-10 md:w-10 fill-current" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white transform hover:scale-110 transition-all">
                {playing ? <Pause className="h-8 w-8 md:h-12 md:w-12 fill-current" /> : <Play className="h-8 w-8 md:h-12 md:w-12 fill-current" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="text-white hover:text-yellow-400 transition-colors">
                <FastForward className="h-6 w-6 md:h-10 md:w-10 fill-current" />
              </button>
              
              {hasNext && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onNext?.(); }} 
                  className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 bg-white/20 hover:bg-yellow-400 hover:text-black backdrop-blur-md rounded-lg text-white font-bold text-xs md:text-sm transition-all"
                >
                  <FastForward className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                  ตอนต่อไป
                </button>
              )}

              <div className="flex items-center gap-2 group/volume">
                <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="text-white">
                  {muted || volume === 0 ? <VolumeX className="h-6 w-6 md:h-8 md:w-8 text-red-500" /> : <Volume2 className="h-6 w-6 md:h-8 md:w-8" />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                  <Slider 
                    value={[muted ? 0 : volume]} 
                    max={1} 
                    step={0.01} 
                    onValueChange={(v) => { setVolume(v[0]); setMuted(false); }}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 text-white">
              <button className="hidden sm:block hover:text-yellow-400 transition-colors"><Subtitles className="h-6 w-6 md:h-8 md:w-8" /></button>
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className={`hover:text-yellow-400 transition-colors ${showSettings ? "text-yellow-400 rotate-90" : ""} transition-transform duration-300`}>
                  <Settings className="h-6 w-6 md:h-8 md:w-8" />
                </button>
                
                {showSettings && (
                  <div className="absolute bottom-12 right-0 w-48 rounded-xl bg-black/90 border border-white/10 backdrop-blur-xl p-3 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase tracking-tighter">ความละเอียด</p>
                    {Object.keys(qualities).length > 0 ? (
                      Object.keys(qualities).map((q) => (
                        <button 
                          key={q}
                          onClick={(e) => { e.stopPropagation(); handleQualityChange(q); }}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm ${quality === q ? "bg-yellow-400 text-black font-bold" : "text-white hover:bg-white/10"}`}
                        >
                          {q}
                          {quality === q && <Check className="h-4 w-4" />}
                        </button>
                      ))
                    ) : (
                      <div className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm bg-yellow-400 text-black font-bold">
                        {quality}
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="hover:text-yellow-400 transition-colors">
                <Maximize className={`h-6 w-6 md:h-8 md:w-8 ${isFullscreen ? "text-yellow-400" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Gestures Overlays */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-10" onDoubleClick={() => skip(-10)} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-10" onDoubleClick={() => skip(10)} />

      <style jsx global>{`
        .SliderRoot {
          position: relative;
          display: flex;
          align-items: center;
          user-select: none;
          touch-action: none;
          width: 100%;
          height: 20px;
        }
        .SliderTrack {
          background-color: rgba(255, 255, 255, 0.2);
          position: relative;
          flex-grow: 1;
          border-radius: 9999px;
          height: 4px;
        }
        .SliderRange {
          position: absolute;
          background-color: #ef4444;
          border-radius: 9999px;
          height: 100%;
        }
        .SliderThumb {
          display: block;
          width: 14px;
          height: 14px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          border-radius: 10px;
          transition: transform 0.1s;
        }
        .SliderThumb:hover { transform: scale(1.2); }
      `}</style>
    </div>
  );
}
