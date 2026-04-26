"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/navbar";
import { 
  History, 
  Loader2, 
  Film, 
  Coins, 
  Play,
  ArrowLeft,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function UserPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMyPurchases();
  }, []);

  const fetchMyPurchases = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          movies:movie_id (title, image_url, description),
          episodes:episode_id (title, movie_id)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="pt-32 px-4 md:px-10 lg:px-20 pb-20">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                <History className="h-10 w-10 text-yellow-400" /> ประวัติการซื้อ
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                รายการหนังและซีรีส์ทั้งหมดที่คุณเคยปลดล็อกด้วยเหรียญ
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl">
               <p className="text-[10px] text-gray-500 font-black uppercase mb-1">ยอดการใช้จ่ายรวม</p>
               <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-400" />
                  <span className="text-3xl font-black text-yellow-400 italic">
                    {purchases.reduce((acc, curr) => acc + curr.amount_paid, 0)}
                  </span>
                  <span className="text-sm font-black text-white/40 italic">COINS</span>
               </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
              <p className="text-gray-500 font-black uppercase text-xs tracking-widest">กำลังดึงข้อมูลการซื้อ...</p>
            </div>
          ) : purchases.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {purchases.map((p) => {
                const movie = p.movies;
                const movieId = p.movie_id || p.episodes?.movie_id;
                
                return (
                  <div key={p.id} className="group relative bg-white/5 border border-white/5 hover:border-yellow-400/20 rounded-3xl p-4 md:p-6 transition-all hover:bg-white/[0.07] overflow-hidden">
                     <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Poster */}
                        <div className="relative h-40 w-28 md:h-48 md:w-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                           <img src={movie?.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="h-8 w-8 text-white fill-white" />
                           </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div>
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                 <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] font-black uppercase">ปลดล็อกแล้ว</Badge>
                                 <span className="text-xs text-gray-500 font-bold uppercase tracking-widest italic">{new Date(p.created_at).toLocaleDateString()}</span>
                              </div>
                              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
                                 {movie?.title}
                                 {p.episodes && <span className="text-yellow-400 ml-2 text-xl md:text-2xl">- {p.episodes.title}</span>}
                              </h2>
                           </div>
                           
                           <p className="text-sm text-gray-400 line-clamp-2 font-medium max-w-2xl">
                              {movie?.description}
                           </p>

                           <div className="flex items-center justify-center md:justify-start gap-4">
                              <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/5">
                                 <Coins className="h-3 w-3 text-yellow-400" />
                                 <span className="text-xs font-black text-yellow-400 italic">{p.amount_paid} Coins</span>
                              </div>
                           </div>
                        </div>

                        {/* Action */}
                        <div className="w-full md:w-auto">
                           <Link href={`/watch/${movieId}${p.episode_id ? `?ep=${p.episode_id}` : ''}`}>
                              <Button className="w-full md:w-auto h-14 px-10 bg-white text-black hover:bg-yellow-400 font-black rounded-2xl transition-all">
                                 เข้าชมตอนนี้ <ChevronRight className="ml-2 h-5 w-5" />
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
               <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center text-gray-600">
                  <Film className="h-12 w-12" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-3xl font-black italic uppercase">ยังไม่มีประวัติการซื้อ</h2>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                     ดูเหมือนว่าคุณยังไม่เคยใช้เหรียญปลดล็อกเนื้อหาใดๆ <br/> ลองเลือกหนังที่ชอบแล้วเริ่มต้นรับชมได้เลย!
                  </p>
               </div>
               <Link href="/">
                  <Button variant="outline" className="rounded-full px-8 font-black uppercase h-12">ไปที่หน้าแรก</Button>
               </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
