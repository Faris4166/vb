"use client";

import React, { useState, useEffect } from "react";
import CarouselHero from "@/components/carousel-hero";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import { createClient } from "@/lib/supabase";
import { Film, Play, Clock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMovies(data);
    };

    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('watch_history')
        .select('*, movies(*), episodes(*)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (data) {
        // กรองเอาเฉพาะเรื่องล่าสุดเพียงเรื่องเดียว (ป้องกันการโชว์ตอนซ้ำๆ ของเรื่องเดียวกัน)
        const uniqueHistory: any[] = [];
        const seenMovies = new Set();
        
        for (const item of data) {
          if (!seenMovies.has(item.movie_id)) {
            seenMovies.add(item.movie_id);
            // กรองเอาที่ดูเกือบจบแล้วออก (เช่น > 95%)
            if ((item.last_position / item.duration) < 0.95) {
              uniqueHistory.push(item);
            }
          }
        }
        setHistory(uniqueHistory);
      }
    };

    Promise.all([fetchMovies(), fetchHistory()]).then(() => setLoading(false));
  }, [supabase]);

  // แยกหนังสำหรับ Hero (3 เรื่องแรก)
  const heroMovies = movies.slice(0, 3);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-black pb-20">
      <Navbar />
      
      {loading ? (
        <div className="h-[70vh] md:h-[85vh] w-full bg-zinc-900 animate-pulse flex items-center justify-center">
           <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : movies.length > 0 ? (
        <>
          <CarouselHero movies={heroMovies} />
          
          {/* Continue Watching Section */}
          {history.length > 0 && (
            <section className="relative z-10 -mt-12 px-8 md:px-16 lg:px-24 mb-20">
              <div className="mb-6 flex items-center gap-2">
                <div className="h-8 w-1.5 bg-yellow-400 rounded-full" />
                <h2 className="text-xl font-bold text-white md:text-2xl uppercase italic tracking-tighter">
                  รับชม <span className="text-yellow-400">ต่อจากเดิม</span>
                </h2>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {history.map((item) => {
                  const movie = item.movies;
                  const episode = item.episodes;
                  const progress = (item.last_position / item.duration) * 100;
                  
                  return (
                    <Link 
                      key={item.id} 
                      href={`/watch/${movie.id}${episode ? `?ep=${episode.id}` : ''}`}
                      className="group relative flex-none w-64 md:w-80 aspect-video rounded-xl overflow-hidden bg-zinc-900 shadow-2xl"
                    >
                      <img 
                        src={movie.image_url} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="h-12 w-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20">
                            <Play className="h-6 w-6 text-black fill-black ml-1" />
                         </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-black text-sm md:text-base italic uppercase truncate drop-shadow-md">
                          {movie.title}
                        </p>
                        {episode && (
                          <p className="text-yellow-400 text-[10px] md:text-xs font-bold uppercase tracking-tighter">
                            {episode.title}
                          </p>
                        )}
                        
                        {/* Progress Bar */}
                        <div className="mt-3 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000" 
                             style={{ width: `${progress}%` }} 
                           />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Trending Movies Section */}
          <section className={`relative z-10 px-8 md:px-16 lg:px-24 ${history.length === 0 ? '-mt-20' : ''} mb-20`}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                หนังที่กำลัง <span className="text-yellow-400">นิยม</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.image_url}
                  rating={movie.rating || "8.5"}
                  year={movie.year || "2024"}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
           <Film className="h-16 w-16 opacity-20" />
           <p className="text-xl font-bold">ยังไม่มีเนื้อหาในระบบ</p>
           <p className="text-sm">เข้าหน้า Admin เพื่อเพิ่มหนังเรื่องแรกของคุณ</p>
        </div>
      )}
    </main>
  );
}
