"use client";

import React, { useState, useEffect } from "react";
import MovieCard from "@/components/movie-card";
import { createClient } from "@/lib/supabase";
import { Play, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SkeletonCard from "@/components/skeleton-loaders";

interface HomeContentProps {
  initialMovies: any[];
}

export default function HomeContent({ initialMovies }: HomeContentProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingHistory(false);
        return;
      }

      // Fetch History
      const { data: historyData } = await supabase
        .from('watch_history')
        .select('*, movies(*), episodes(*)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (historyData) {
        const uniqueHistory: any[] = [];
        const seenMovies = new Set();
        
        for (const item of historyData) {
          if (!seenMovies.has(item.movie_id)) {
            seenMovies.add(item.movie_id);
            if ((item.last_position / item.duration) < 0.95) {
              uniqueHistory.push(item);
            }
          }
        }
        setHistory(uniqueHistory);
      }

      // Fetch Purchases
      const { data: purchaseData } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id);
      setPurchases(purchaseData || []);

      setLoadingHistory(false);
    };

    fetchData();
  }, [supabase]);

  return (
    <>
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
                  <Image 
                    src={movie.image_url} 
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 400px"
                    className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
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
        <div className="mb-6 flex items-center gap-2">
           <div className="h-8 w-1.5 bg-yellow-400 rounded-full" />
           <h2 className="text-2xl font-bold text-white md:text-3xl uppercase italic tracking-tighter">
             หนังที่กำลัง <span className="text-yellow-400">นิยม</span>
           </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {initialMovies.map((movie) => {
            const isPurchased = purchases.some(p => p.movie_id === movie.id);
            return (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.image_url}
                year={movie.year || "2024"}
                price_coins={movie.price_coins}
                free_at={movie.free_at}
                is_purchased={isPurchased}
                is_premium={movie.is_premium}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
