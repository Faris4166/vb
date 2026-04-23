import React from "react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Info, Play, TrendingUp } from "lucide-react";

const MOCK_DATA = [
  {
    id: "1",
    title: "Oppenheimer",
    titleLogo: "/logo1.png",
    subtitle: "ออปเพนไฮเมอร์",
    description: "เรื่องราวของ เจ. โรเบิร์ต ออปเพนไฮเมอร์ นักฟิสิกส์ทฤษฎีผู้มีบทบาทสำคัญในการพัฒนาอาวุธนิวเคลียร์ชิ้นแรกของโลกในโครงการแมนฮัตตัน ซึ่งนำไปสู่การสิ้นสุดของสงครามโลกครั้งที่ 2 แต่เขากลับต้องเผชิญกับความขัดแย้งในใจและผลกระทบที่ตามมาอย่างมหาศาล",
    image: "/Oppenheimer.jpg",
    rank: "อันดับ 1 ในไทยวันนี้"
  },
  {
    id: "2",
    title: "The Batman",
    titleLogo: "/logo2.webp",
    subtitle: "เดอะ แบทแมน",
    description: "บรูซ เวย์น ในปีที่สองของการเป็นแบทแมน ต้องเผชิญหน้ากับฆาตกรต่อเนื่องสุดวิปริต 'ริดเดลอร์' ที่ทิ้งปริศนาไว้ทั่วเมืองก็อธแฮม พร้อมกับการเปิดโปงความฉ้อฉลที่หยั่งรากลึกในเมืองที่เขาสาบานว่าจะปกป้อง",
    image: "/batman.webp",
    rank: "อันดับ 2 ในไทยวันนี้"
  },
];

export default function CarouselHero() {
  return (
    <section className="w-full bg-black">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {MOCK_DATA.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                
                {/* 1. Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />

                {/* 2. Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                {/* 3. Content Container */}
                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-4xl space-y-6">
                  
                  <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm md:text-base uppercase tracking-widest">
                    <TrendingUp className="h-5 w-5" />
                    {item.rank}
                  </div>

                  <div className="space-y-4">
                    {/* 4. Movie Logo */}
                    {item.titleLogo ? (
                      <div className="max-w-[280px] md:max-w-[400px] animate-in fade-in slide-in-from-left-8 duration-1000">
                        <img 
                          src={item.titleLogo} 
                          alt={item.title} 
                          className="h-auto w-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    ) : (
                      <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl uppercase tracking-tighter">
                        {item.title}
                      </h1>
                    )}
                    
                    <h2 className="text-xl md:text-2xl font-bold text-yellow-400/90 italic ml-1">
                      {item.subtitle}
                    </h2>
                  </div>

                  <p className="text-gray-300 text-sm md:text-lg line-clamp-3 md:line-clamp-none max-w-2xl font-medium leading-relaxed drop-shadow-md">
                    {item.description}
                  </p>

                  {/* 5. Action Buttons - เพิ่ม Link เพื่อให้กดเข้าดูได้ */}
                  <div className="flex items-center gap-4 pt-4">
                    <Link href={`/watch/${item.id}`}>
                      <Button size="lg" className="h-12 bg-white text-black hover:bg-yellow-400 hover:text-black px-8 font-black text-lg rounded-xl transition-all hover:scale-105">
                        <Play className="mr-2 h-5 w-5 fill-black" /> เล่น
                      </Button>
                    </Link>
                    <Link href={`/watch/${item.id}`}>
                      <Button size="lg" variant="outline" className="h-12 bg-white/10 text-white border-white/20 hover:bg-white/20 px-8 font-bold text-lg rounded-xl backdrop-blur-md transition-all hover:scale-105">
                        <Info className="mr-2 h-5 w-5" /> ข้อมูลเพิ่มเติม
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <div className="absolute right-12 bottom-12 flex gap-4 z-20">
          <CarouselPrevious className="static h-12 w-12 translate-y-0 bg-black/40 border-white/10 hover:bg-yellow-400 hover:text-black text-white backdrop-blur-xl transition-all" />
          <CarouselNext className="static h-12 w-12 translate-y-0 bg-black/40 border-white/10 hover:bg-yellow-400 hover:text-black text-white backdrop-blur-xl transition-all" />
        </div>
      </Carousel>
    </section>
  );
}