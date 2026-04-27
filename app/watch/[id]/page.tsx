"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  List, 
  X, 
  Play, 
  Lock, 
  Coins, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import dynamic from 'next/dynamic';
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// โหลด VideoPlayer เฉพาะฝั่ง Client เท่านั้น
const VideoPlayer = dynamic(() => import('@/components/video-player'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-black animate-pulse flex items-center justify-center text-white font-bold">กำลังโหลดตัวเล่น...</div>
});

function PlayerContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const epId = searchParams.get('ep');
  const [initialStartTime, setInitialStartTime] = useState(0);
  const lastSavedRef = useRef<number>(0);
  const supabase = createClient();

  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id, epId]);

  useEffect(() => {
    if (isUnlocked && movie && !viewCounted && !loading) {
      handleIncrementView();
    }
  }, [isUnlocked, movie, viewCounted, loading]);

  const handleIncrementView = async () => {
    const sessionKey = `viewed_${id}`;
    if (sessionStorage.getItem(sessionKey)) return;

    try {
      // Increment views using Supabase RPC or direct update
      await supabase.rpc('increment_movie_views', { movie_id: id });
      sessionStorage.setItem(sessionKey, 'true');
      setViewCounted(true);
    } catch (error) {
      // Fallback to direct update if RPC is not available
      await supabase.from('movies').update({ 
        views: (movie.views || 0) + 1 
      }).eq('id', id);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Get Movie
    const { data: movieData } = await supabase.from('movies').select('*').eq('id', id).single();
    setMovie(movieData);

    // 2. Get Profile for Coins
    if (user) {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
    }

    // 3. Handle Content (Movie vs Episode)
    let currentEp = null;
    if (movieData?.type === 'series') {
      const { data: eps } = await supabase.from('episodes').select('*').eq('movie_id', id).order('created_at', { ascending: true });
      setEpisodes(eps || []);
      
      currentEp = eps?.find(e => e.id === epId) || eps?.[0];
      setEpisode(currentEp);

      // Check Unlock Status
      if (currentEp && user) {
        if (currentEp.price_coins === 0) {
          setIsUnlocked(true);
        } else {
          const { data: purchase } = await supabase.from('purchases').select('*').eq('user_id', user.id).eq('episode_id', currentEp.id).single();
          setIsUnlocked(!!purchase);
        }
      }
    } else {
      // Movie
      if (movieData && user) {
        if (movieData.price_coins === 0) {
          setIsUnlocked(true);
        } else {
          const { data: purchase } = await supabase.from('purchases').select('*').eq('user_id', user.id).eq('movie_id', id).single();
          setIsUnlocked(!!purchase);
        }
      }
    }

    // Load Watch History
    if (user) {
      const { data: history } = await supabase
        .from('watch_history')
        .select('last_position')
        .eq('user_id', user.id)
        .eq('movie_id', id)
        .eq(movieData?.type === 'series' ? 'episode_id' : 'movie_id', movieData?.type === 'series' ? currentEp?.id : id)
        .maybeSingle();
      
      if (history) {
        setInitialStartTime(history.last_position);
        lastSavedRef.current = history.last_position;
      }
    }

    setLoading(false);
  };

  const handleUnlock = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    const price = movie.type === 'series' ? episode?.price_coins : movie.price_coins;
    
    if ((profile?.coins || 0) < price) {
      return alert("เหรียญของคุณไม่พอ! กรุณาเติมเหรียญก่อน");
    }

    setUnlocking(true);
    try {
      // 1. Deduct Coins
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ coins: profile.coins - price })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      // 2. Create Purchase Record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          movie_id: movie.type === 'movie' ? id : null,
          episode_id: movie.type === 'series' ? episode.id : null,
          amount_paid: price
        });
      
      if (purchaseError) throw purchaseError;

      setIsUnlocked(true);
      setProfile({ ...profile, coins: profile.coins - price });
      alert("ปลดล็อกสำเร็จ! ขอให้สนุกกับการรับชมครับ");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setUnlocking(false);
    }
  };

  const handleProgress = async (currentTime: number, duration: number) => {
    // Save every 10 seconds or when significant progress is made
    if (Math.abs(currentTime - lastSavedRef.current) > 10) {
      lastSavedRef.current = currentTime;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          movie_id: id,
          episode_id: movie?.type === 'series' ? episode?.id : null,
          last_position: currentTime,
          duration: duration
        })
      });
    }
  };

  if (loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
      <p className="text-xs font-black uppercase tracking-widest text-gray-500 italic">กำลังเตรียมความพร้อม...</p>
    </div>
  );

  const videoUrl = movie.type === 'series' ? episode?.video_url : movie.video_url;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden group/player">
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-[100] p-6 flex items-center justify-between opacity-0 group-hover/player:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
              {movie.title} {movie.type === 'series' && `- ${episode?.title}`}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Now Playing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {movie.type === 'series' && (
            <button 
              onClick={() => setShowEpisodes(!showEpisodes)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 font-black italic uppercase text-xs hover:bg-white hover:text-black transition-all"
            >
              <List className="h-4 w-4" /> ตอนทั้งหมด
            </button>
          )}
          <button onClick={() => router.push("/")} className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500 transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Player Area */}
      <div className="relative h-full w-full">
        {isUnlocked ? (
          <VideoPlayer 
            src={videoUrl} 
            title={movie.type === 'series' ? `${movie.title} - ${episode?.title}` : movie.title}
            poster={movie.image_url}
            startTime={initialStartTime}
            onProgress={handleProgress}
          />
        ) : (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl">
             <div className="max-w-lg w-full px-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="relative mx-auto h-24 w-24">
                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20" />
                  <div className="relative h-full w-full bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl shadow-yellow-400/20">
                    <Lock className="h-10 w-10 text-black stroke-[2.5px]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">ชำระด้วยเหรียญ</h2>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    เนื้อหานี้เป็นส่วนหนึ่งของระบบพรีเมียม <br/> คุณต้องใช้เหรียญเพื่อปลดล็อกการเข้าถึงถาวร
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] space-y-6">
                   <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <span className="text-gray-500 font-black uppercase italic text-xs">เหรียญที่คุณมี</span>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-xl font-black italic">{profile?.coins || 0}</span>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-black uppercase italic text-xs">ราคาปลดล็อก</span>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-3xl font-black text-yellow-400 italic">
                          {movie.type === 'series' ? episode?.price_coins : movie.price_coins}
                        </span>
                      </div>
                   </div>
                   
                   <Button 
                     onClick={handleUnlock}
                     disabled={unlocking}
                     className="w-full h-16 bg-yellow-400 text-black hover:bg-white font-black text-xl rounded-2xl transition-all shadow-2xl shadow-yellow-400/20 active:scale-95"
                   >
                     {unlocking ? <Loader2 className="h-6 w-6 animate-spin" /> : "ยืนยันการปลดล็อก"}
                   </Button>
                </div>

                <button onClick={() => router.back()} className="text-gray-500 hover:text-white font-bold uppercase text-xs tracking-widest italic transition-colors">
                  ยกเลิกและย้อนกลับ
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Side Episode List (Drawer) */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-black/95 backdrop-blur-3xl z-[300] border-l border-white/10 transition-transform duration-700 ease-in-out ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col p-8">
            <div className="flex items-center justify-between mb-10">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter">ตอนทั้งหมด</h3>
               <button onClick={() => setShowEpisodes(false)} className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-all">
                  <X className="h-5 w-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
               {episodes.map((ep, idx) => {
                  const isActive = ep.id === episode?.id;
                  return (
                    <div 
                      key={ep.id}
                      onClick={() => {
                        router.push(`/watch/${id}?ep=${ep.id}`);
                        setShowEpisodes(false);
                      }}
                      className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${isActive ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/40">
                            {isActive && (
                              <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                                 <Badge className="bg-black text-yellow-400 border-0">PLAYING</Badge>
                              </div>
                            )}
                          </div>
                          <div>
                             <p className={`text-[10px] font-black uppercase italic ${isActive ? 'text-black/60' : 'text-gray-500'}`}>Episode {idx + 1}</p>
                             <h4 className="font-black italic uppercase text-sm line-clamp-1">{ep.title}</h4>
                             {ep.price_coins > 0 && !isActive && (
                               <div className="flex items-center gap-1 mt-1">
                                 <Coins className="h-3 w-3 text-yellow-400" />
                                 <span className="text-[10px] font-black text-yellow-400">{ep.price_coins} Coins</span>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>
         </div>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-400" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 italic">กำลังโหลดวิดีโอ...</p>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}
