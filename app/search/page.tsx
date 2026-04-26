"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import { Loader2, Search as SearchIcon, Film } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,genre.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 px-4 md:px-10 lg:px-20 pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <SearchIcon className="h-6 w-6 text-yellow-400" />
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">
            ผลการค้นหา: <span className="text-yellow-400">"{query}"</span>
          </h1>
        </div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
          พบทั้งหมด {results.length} รายการ
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest">กำลังค้นหาข้อมูล...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {results.map((movie) => (
            <MovieCard 
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image_url}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
             <Film className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic uppercase">ไม่พบข้อมูลที่ตรงกับการค้นหา</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto font-medium">
              ลองใช้คำค้นหาอื่น หรือตรวจสอบตัวสะกดใหม่อีกครั้งครับ
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
          <p className="text-gray-500 font-black uppercase text-xs tracking-widest">กำลังโหลด...</p>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
