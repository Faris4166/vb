"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Heart, 
  Play, 
  Trash2, 
  ArrowLeft,
  Film,
  Loader2,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import Link from "next/link";

export default function MyListPage() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('watchlist')
        .select(`
          movie_id,
          movies (*)
        `)
        .eq('user_id', user.id);
      
      if (data) {
        // แบนข้อมูลให้เหลือแค่ก้อน movie
        setMovies(data.map(item => item.movies));
      }
    }
    setLoading(false);
  };

  const removeFromWatchlist = async (movieId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId);

    if (!error) {
      setMovies(movies.filter(m => m.id !== movieId));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center gap-4">
              <Bookmark className="h-10 w-10 text-yellow-400" />
              รายการของฉัน
            </h1>
            <p className="text-gray-500 font-medium mt-2">หนังและซีรีส์ที่คุณบันทึกไว้ดูภายหลัง</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
             <span className="text-yellow-400 font-black">{movies.length}</span>
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Items Saved</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">กำลังโหลดรายการ...</p>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard 
                  id={movie.id}
                  title={movie.title}
                  image={movie.image_url || movie.image} 
                />
                <button 
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="absolute top-2 right-2 h-8 w-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110 z-20"
                  title="ลบออกจากรายการ"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center gap-6">
            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center">
              <Film className="h-10 w-10 text-gray-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">ยังไม่มีรายการที่บันทึกไว้</h3>
              <p className="text-gray-500 text-sm max-w-xs">ไปสำรวจหนังใหม่ๆ แล้วกดบันทึกเรื่องที่คุณชอบไว้ดูที่นี่สิ!</p>
            </div>
            <Link href="/">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 rounded-full h-12">
                ไปสำรวจหนัง
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
