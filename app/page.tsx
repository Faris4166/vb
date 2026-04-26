"use client";

import React, { useState, useEffect } from "react";
import CarouselHero from "@/components/carousel-hero";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import { createClient } from "@/lib/supabase";
import { Film } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setMovies(data);
      }
      setLoading(false);
    };

    fetchMovies();
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
          
          {/* Trending Movies Section */}
          <section className="relative z-10 -mt-20 px-8 md:px-16 lg:px-24">
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
