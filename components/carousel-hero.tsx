import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Info, Play } from "lucide-react";

interface CarouselHeroProps {
  movies: any[];
}

export default function CarouselHero({ movies }: CarouselHeroProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="w-full bg-black">
      <Carousel
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {movies.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative h-[70vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] w-full overflow-hidden">
                
                {/* Background Image */}
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 md:hover:scale-105"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Content Container */}
                <div className="relative h-full flex flex-col justify-end pb-20 md:justify-center pt-24 md:pt-32 px-6 md:px-16 lg:px-24 max-w-4xl space-y-4 md:space-y-6">
                  
                  <div className="space-y-3 md:space-y-4">
                    {/* Movie Logo */}
                    {item.title_logo_url && (
                      <div className="max-w-[200px] xs:max-w-[250px] md:max-w-[400px] animate-in fade-in slide-in-from-left-8 duration-1000">
                        <Image 
                          src={item.title_logo_url} 
                          alt={item.title} 
                          width={400}
                          height={200}
                          className="h-auto w-full object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                    )}
                    
                    <h2 className="text-lg md:text-2xl font-bold text-yellow-400/90 italic ml-1">
                      {item.subtitle}
                    </h2>
                  </div>

                  <p className="text-gray-300 text-xs md:text-lg line-clamp-3 md:line-clamp-none max-w-2xl font-medium leading-relaxed drop-shadow-md">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-4">
                    <Link href={`/movie/${item.id}`}>
                      <Button className="h-10 md:h-12 bg-white text-black hover:bg-yellow-400 hover:text-black px-6 md:px-8 font-black text-base md:text-lg rounded-lg md:rounded-xl transition-all active:scale-95">
                        <Play className="mr-2 h-4 w-4 md:h-5 md:w-5 fill-black" /> เล่น
                      </Button>
                    </Link>
                    <Link href={`/movie/${item.id}`}>
                      <Button variant="outline" className="h-10 md:h-12 bg-white/10 text-white border-white/20 hover:bg-white/20 px-6 md:px-8 font-bold text-base md:text-lg rounded-lg md:rounded-xl backdrop-blur-md transition-all active:scale-95">
                        <Info className="mr-2 h-4 w-4 md:h-5 md:w-5" /> ข้อมูล
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <div className="absolute right-6 bottom-6 md:right-12 md:bottom-12 flex gap-3 z-20">
          <CarouselPrevious className="static h-10 w-10 md:h-12 md:w-12 translate-y-0 bg-black/40 border-white/10 text-white backdrop-blur-xl" />
          <CarouselNext className="static h-10 w-10 md:h-12 md:w-12 translate-y-0 bg-black/40 border-white/10 text-white backdrop-blur-xl" />
        </div>
      </Carousel>
    </section>
  );
}