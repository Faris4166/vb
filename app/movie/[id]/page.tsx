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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  },
  "3": {
    title: "Arcane",
    titleLogo: "/arcane-logo.webp",
    subtitle: "อาร์เคน",
    description: "ท่ามกลางความขัดแย้งระหว่างเมืองคู่ขนานอย่าง พิลโทเวอร์ และ ซอน สองพี่น้องต้องต่อสู้กันเองในสงครามที่มีเทคโนโลยีเวทมนตร์และความเชื่อที่แตกต่างเป็นเดิมพัน",
    image: "/arcane-bg.jpg",
    video: "/video/videoplayback.mp4", // Mock video
    year: "2021",
    duration: "1 ซีซั่น",
    rating: "16+",
    genre: "แอนิเมชัน / ไซไฟ",
    episodes: [
      { 
        id: "e1", 
        title: "ตอนที่ 1: Welcome to the Playground", 
        duration: "45 นาที", 
        thumbnail: "/ep1.jpg",
        description: "ไวโอเล็ตและพาวเดอร์ สองพี่น้องกำพร้าพยายามขโมยของจากอพาร์ตเมนต์ในพิลโทเวอร์ แต่เหตุการณ์กลับบานปลายกลายเป็นโศกนาฏกรรม"
      },
      { 
        id: "e2", 
        title: "ตอนที่ 2: Some Mysteries Are Better Left Unsolved", 
        duration: "42 นาที", 
        thumbnail: "/ep2.jpg",
        description: "เจซ นักประดิษฐ์หนุ่มพยายามพิสูจน์ว่าเวทมนตร์สามารถควบคุมได้ด้วยวิทยาศาสตร์ แม้จะถูกสภาสั่งห้ามก็ตาม"
      },
      { 
        id: "e3", 
        title: "ตอนที่ 3: The Base Violence Necessary for Change", 
        duration: "44 นาที", 
        thumbnail: "/ep3.jpg",
        description: "ความขัดแย้งระหว่างซอนและพิลโทเวอร์มาถึงจุดแตกหัก เมื่อแวนเดอร์ต้องตัดสินใจครั้งสำคัญเพื่อปกป้องครอบครัวของเขา"
      },
      { 
        id: "e4", 
        title: "ตอนที่ 4: Happy Progress Day!", 
        duration: "40 นาที", 
        thumbnail: "/ep4.jpg",
        description: "หลายปีผ่านไป พิลโทเวอร์ก้าวหน้าขึ้นด้วยเทคโนโลยีเฮกซ์เทค แต่ภัยเงียบใหม่กำลังคืบคลานมาจากเงามืดของซอน"
      },
    ]
  }
};

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  const movie = MOVIES_DETAILS[id as keyof typeof MOVIES_DETAILS];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id]);

  if (!movie) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {!showVideo ? (
          <img src={movie.image} alt={movie.title} className="h-full w-full object-cover animate-in fade-in duration-1000" />
        ) : (
          <div className="relative h-full w-full animate-in fade-in duration-1000">
            {/* เพิ่ม playsInline เพื่อให้เล่นบน iOS ได้ */}
            <video 
              src={movie.video} 
              autoPlay 
              muted={isMuted} 
              loop 
              playsInline 
              className="h-full w-full object-cover" 
            />
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-3 md:gap-4 z-50">
              <button onClick={() => setIsMuted(!isMuted)} className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                {isMuted ? <VolumeX className="h-5 w-5 md:h-6 md:w-6" /> : <Volume2 className="h-5 w-5 md:h-6 md:w-6" />}
              </button>
              <button onClick={() => { setShowVideo(false); setTimeout(() => setShowVideo(true), 100); }} className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
                <RotateCcw className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 md:p-8">
        <button onClick={() => router.push("/")} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-md group-hover:bg-yellow-400 group-hover:text-black transition-all">
            <ArrowLeft className="h-6 w-6" />
          </div>
          <span className="font-bold uppercase tracking-widest text-xs md:text-sm text-white">กลับ</span>
        </button>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-12 md:justify-center px-6 md:px-16 lg:px-24 max-w-4xl space-y-6 md:space-y-8">
        <div className="max-w-[240px] xs:max-w-[300px] md:max-w-[450px] animate-in fade-in slide-in-from-left-8 duration-1000">
          <img src={movie.titleLogo} alt={movie.title} className="h-auto w-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-bold text-gray-300 md:text-base">
          <span className="text-green-500">98% Match</span>
          <span>{movie.year}</span>
          <Badge variant="outline" className="text-white border-white/30 uppercase rounded-sm h-6">
            {movie.rating}
          </Badge>
          <span>{movie.duration}</span>
          <Badge variant="secondary" className="bg-white/10 text-white h-5 px-1.5 text-[10px] hover:bg-white/10">HD</Badge>
        </div>

        <p className="text-yellow-400 font-bold tracking-wide italic text-sm md:text-base">
          {movie.genre} • {movie.subtitle}
        </p>

        <p className="text-gray-200 text-xs md:text-lg line-clamp-3 md:line-clamp-none max-w-2xl leading-relaxed drop-shadow-md">
          {movie.description}
        </p>

        <div className="flex items-center gap-4 pt-2 md:pt-4">
          <Button 
            size="lg" 
            onClick={() => router.push(`/watch/${id}${(movie as any).episodes ? '?ep=e1' : ''}`)}
            className="h-12 md:h-14 bg-white text-black hover:bg-yellow-400 hover:text-black px-8 md:px-12 font-black text-lg md:text-xl rounded-xl transition-all active:scale-95"
          >
            <Play className="mr-3 h-5 w-5 md:h-7 md:w-7 fill-black" /> เล่นเลย
          </Button>
        </div>

        {/* Series Section - Shadcn Redesign */}
        {(movie as any).episodes && (
          <div className="pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            <Tabs defaultValue="episodes" className="w-full">
              {/* Header Section: Season & Tabs */}
              <div className="space-y-6 mb-6">
                <div className="flex items-center justify-between">
                  <Select defaultValue="s1">
                    <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white font-bold h-10 hover:bg-white/10 transition-all rounded-md">
                      <SelectValue placeholder="เลือกซีซั่น" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="s1" className="focus:bg-yellow-400 focus:text-black font-bold">ซีซั่น 1</SelectItem>
                      <SelectItem value="s2" className="focus:bg-yellow-400 focus:text-black font-bold">ซีซั่น 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TabsList variant="line" className="bg-transparent border-b border-white/10 rounded-none h-auto p-0 flex justify-start gap-8 w-full">
                  <TabsTrigger 
                    value="episodes" 
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 border-none bg-transparent rounded-none pb-4 px-0 text-base md:text-lg font-black text-gray-500 hover:text-gray-300 transition-all after:hidden"
                  >
                    ตอน
                  </TabsTrigger>
                  <TabsTrigger 
                    value="related" 
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 border-none bg-transparent rounded-none pb-4 px-0 text-base md:text-lg font-black text-gray-500 hover:text-gray-300 transition-all after:hidden"
                  >
                    ที่เกี่ยวข้อง
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details" 
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 border-none bg-transparent rounded-none pb-4 px-0 text-base md:text-lg font-black text-gray-500 hover:text-gray-300 transition-all after:hidden"
                  >
                    รายละเอียด
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Episodes Content */}
              <TabsContent value="episodes" className="mt-0 outline-none animate-in fade-in duration-500">
                <div className="mb-6">
                  <p className="text-gray-400 font-bold text-lg">{(movie as any).episodes.length} ตอน</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                  {(movie as any).episodes.map((ep: any, index: number) => (
                    <div 
                      key={ep.id}
                      onClick={() => router.push(`/watch/${id}?ep=${ep.id}`)}
                      className="group/ep flex flex-col gap-4 cursor-pointer"
                    >
                      {/* Thumbnail Card-like UI */}
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-900 border border-white/5 transition-all group-hover/ep:border-white/20">
                        <img 
                          src={ep.thumbnail || movie.image} 
                          alt={ep.title} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover/ep:scale-110" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/ep:opacity-100 transition-opacity">
                          <div className="h-14 w-14 rounded-full border-2 border-white flex items-center justify-center bg-black/20 backdrop-blur-sm">
                            <Play className="h-7 w-7 fill-white ml-1" />
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30">
                            <div className="h-full bg-yellow-400 w-1/3 shadow-[0_0_10px_#facc15]" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-black text-base md:text-lg group-hover/ep:text-yellow-400 transition-colors line-clamp-1">
                            {index + 1}. {ep.title.split(": ")[1] || ep.title}
                          </h4>
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 line-clamp-3 leading-relaxed h-12">
                          {ep.description || "เนื้อหาตอนนี้น่าตื่นเต้นและเข้มข้นขึ้นเรื่อยๆ ติดตามชมได้ในการสตรีมมิ่งของเรา..."}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <Badge variant="outline" className="text-[10px] border-white/20 px-1 py-0 text-gray-400 font-bold h-5">16+</Badge>
                          <span className="text-[10px] md:text-xs font-bold text-gray-500">{ep.duration}</span>
                          <span className="text-[10px] md:text-xs font-bold text-gray-500">23 เม.ย. 2569</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="related" className="mt-0 min-h-[300px] flex items-center justify-center text-gray-500 italic">
                ยังไม่มีเนื้อหาที่เกี่ยวข้องในขณะนี้
              </TabsContent>

              <TabsContent value="details" className="mt-0 min-h-[300px] text-gray-300 leading-relaxed max-w-3xl">
                <h4 className="text-white font-bold mb-4 text-xl">รายละเอียดซีรีส์</h4>
                <p className="mb-4">{movie.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mt-8">
                  <div>
                    <p className="text-gray-500 font-bold">แนวทาง</p>
                    <p>{movie.genre}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold">ปีที่เปิดตัว</p>
                    <p>{movie.year}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
