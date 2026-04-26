"use client";

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

const GENRES = [
  "ทั้งหมด", "แอ็คชัน", "ผจญภัย", "แอนิเมชัน", "คอมเมดี้", "อาชญากรรม", 
  "สารคดี", "ดราม่า", "ครอบครัว", "แฟนตาซี", "ประวัติศาสตร์", 
  "สยองขวัญ", "เพลง", "ลึกลับ", "โรแมนติก", "ไซไฟ", "ระทึกขวัญ"
];

function CategoriesContent() {
  const [selectedGenre, setSelectedGenre] = useState("ทั้งหมด");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const typeFilter = searchParams.get('type'); // 'movie' or 'series'
  
  const supabase = createClient();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      let query = supabase.from('movies').select('*');
      
      if (selectedGenre !== "ทั้งหมด") {
        query = query.ilike('genre', `%${selectedGenre}%`);
      }
      
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error) {
        setMovies(data || []);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [selectedGenre, typeFilter, supabase]);

  return (
    <div className="relative z-10 pt-32 px-6 md:px-16 lg:px-24 pb-20">
      
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm font-bold uppercase tracking-widest">
          <span>สำรวจ</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-yellow-400">
            {typeFilter === 'movie' ? 'หนังทั้งหมด' : typeFilter === 'series' ? 'ซีรีส์ทั้งหมด' : 'แยกหมวดหมู่'}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-2">
          {typeFilter === 'movie' ? 'MOVIES' : typeFilter === 'series' ? 'SERIES' : 'BROWSE'} <span className="text-yellow-400">{selectedGenre === 'ทั้งหมด' ? 'COLLECTION' : 'GENRES'}</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl">
          ค้นหาภาพยนตร์และซีรีส์ที่คุณชื่นชอบตามหมวดหมู่ที่เราคัดสรรมาให้ เพื่อประสบการณ์การรับชมที่ดีที่สุดของคุณ
        </p>
      </div>

      {/* Genre Selection Grid */}
      <div className="flex flex-wrap gap-3 mb-16">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
              selectedGenre === genre
                ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-black italic uppercase">
            {selectedGenre} <span className="text-yellow-400 ml-2">({movies.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.image_url || "/placeholder.jpg"}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-3xl border border-dashed border-white/10 italic text-gray-500">
            <p className="text-xl">ขออภัย ยังไม่มีเนื้อหาในหมวดหมู่นี้ในขณะนี้</p>
            <p className="text-sm mt-2">โปรดเลือกหมวดหมู่อื่นเพื่อสำรวจ</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-black text-white overflow-x-hidden">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">กำลังโหลดรายการ...</p>
        </div>
      }>
        <CategoriesContent />
      </Suspense>

      {/* Decorative Gradients */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[100px] -z-10" />
    </main>
  );
}
