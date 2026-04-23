"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data
const MOVIES_DETAILS = {
  "1": {
    title: "Oppenheimer",
    titleLogo: "/logo1.png",
    subtitle: "ออปเพนไฮเมอร์",
    description: "เรื่องราวของ เจ. โรเบิร์ต ออปเพนไฮเมอร์ นักฟิสิกส์ทฤษฎีผู้มีบทบาทสำคัญในการพัฒนาอาวุธนิวเคลียร์ชิ้นแรกของโลกในโครงการแมนฮัตตัน ซึ่งนำไปสู่การสิ้นสุดของสงครามโลกครั้งที่ 2 แต่เขากลับต้องเผชิญกับความขัดแย้งในใจและผลกระทบที่ตามมาอย่างมหาศาล",
    image: "/Oppenheimer.jpg",
    video: "/video/videoplayback.mp4",
    year: "2023",
    duration: "3 ชม. 0 นาที",
    rating: "18+",
    genre: "ประวัติศาสตร์ / ดราม่า",
  },
  "2": {
    title: "The Batman",
    titleLogo: "/logo2.webp",
    subtitle: "เดอะ แบทแมน",
    description: "บรูซ เวย์น ในปีที่สองของการเป็นแบทแมน ต้องเผชิญหน้ากับฆาตกรต่อเนื่องสุดวิปริต 'ริดเดลอร์' ที่ทิ้งปริศนาไว้ทั่วเมืองก็อธแฮม พร้อมกับการเปิดโปงความฉ้อฉลที่หยั่งรากลึกในเมืองที่เขาสาบานว่าจะปกป้อง",
    image: "/batman.webp",
    video: "/video/videoplayback2.mp4",
    year: "2022",
    duration: "2 ชม. 56 นาที",
    rating: "15+",
    genre: "แอ็คชัน / อาชญากรรม",
  }
};

export default function WatchDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const movie = MOVIES_DETAILS[id as keyof typeof MOVIES_DETAILS];

  useEffect(() => {
    // พรีวิววิดีโอหลัง 5 วินาที
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      
      {/* Background Layer (Preview Video / Image) */}
      <div className="absolute inset-0 z-0">
        {!showVideo ? (
          <img src={movie.image} alt={movie.title} className="h-full w-full object-cover animate-in fade-in duration-1000" />
        ) : (
          <div className="relative h-full w-full animate-in fade-in duration-1000">
            <video src={movie.video} autoPlay muted={isMuted} loop className="h-full w-full object-cover" />
            <div className="absolute bottom-10 right-10 flex gap-4 z-50">
              <button onClick={() => setIsMuted(!isMuted)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
              <button onClick={() => { setShowVideo(false); setTimeout(() => setShowVideo(true), 100); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                <RotateCcw className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-8">
        <button onClick={() => router.push("/")} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md group-hover:bg-yellow-400 group-hover:text-black transition-all">
            <ArrowLeft className="h-6 w-6" />
          </div>
          <span className="font-bold uppercase tracking-widest text-sm text-white">กลับ</span>
        </button>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24 max-w-4xl space-y-8">
        <div className="max-w-[300px] md:max-w-[450px] animate-in fade-in slide-in-from-left-8 duration-1000">
          <img src={movie.titleLogo} alt={movie.title} className="h-auto w-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-300 md:text-base">
          <span className="text-green-500">98% Match</span>
          <span>{movie.year}</span>
          <span className="border border-white/30 px-1.5 py-0.5 text-xs rounded uppercase">{movie.rating}</span>
          <span>{movie.duration}</span>
          <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px]">HD</span>
        </div>
        <p className="text-yellow-400 font-bold tracking-wide italic">{movie.genre} • {movie.subtitle}</p>
        <p className="text-gray-200 text-sm md:text-lg line-clamp-4 md:line-clamp-none max-w-2xl leading-relaxed drop-shadow-md">{movie.description}</p>
        <div className="flex items-center gap-4 pt-4">
          {/* เปลี่ยนไปหน้าเล่นหนังจริงที่ Path /watch/[id]/play */}
          <Button 
            size="lg" 
            onClick={() => router.push(`/watch/${id}/play`)}
            className="h-14 bg-white text-black hover:bg-yellow-400 hover:text-black px-12 font-black text-xl rounded-xl transition-all hover:scale-105"
          >
            <Play className="mr-3 h-7 w-7 fill-black" /> เล่นเลย
          </Button>
        </div>
      </div>

    </div>
  );
}
