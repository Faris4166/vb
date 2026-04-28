"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Play, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Plus,
  Check,
  Bookmark,
  Loader2,
  Clock,
  Star,
  Calendar,
  ChevronRight,
  Coins,
  CheckCircle2,
  X,
  Heart
} from "lucide-react";
import { format, isAfter } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase";
import { SkeletonDetails } from "@/components/skeleton-loaders";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import MovieCard from "@/components/movie-card";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [detectedDuration, setDetectedDuration] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  const supabase = createClient();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchMovieData();
  }, [id]);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Get Movie
      const { data: movieData, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setMovie(movieData);
      setLikes(movieData.likes || 0);

      // 2. Get Episodes if series
      let epData = [];
      if (movieData.type === 'series') {
        const { data } = await supabase
          .from('episodes')
          .select('*')
          .eq('movie_id', id)
          .order('created_at', { ascending: true });
        epData = data || [];
        setEpisodes(epData);
      }

      // 3. Check Watchlist & Purchases
      if (user) {
        const { data: purchaseData } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', user.id);
        setPurchases(purchaseData || []);

        const { data: watchlistData } = await supabase
          .from('watchlist')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .single();
        setIsInWatchlist(!!watchlistData);

        const { data: likeData } = await supabase
          .from('movie_likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('movie_id', id)
          .single();
        setIsLiked(!!likeData);
      }

      // Auto-detect duration if missing
      const videoToCheck = movieData.video_url || epData?.[0]?.video_url;
      if (videoToCheck && !movieData.duration) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const duration = video.duration;
          const hours = Math.floor(duration / 3600);
          const minutes = Math.floor((duration % 3600) / 60);
          const seconds = Math.floor(duration % 60);
          
          let formatted = "";
          if (hours > 0) formatted = `${hours}h ${minutes}m`;
          else if (minutes > 0) formatted = `${minutes}:${seconds.toString().padStart(2, '0')}m`;
          else formatted = `${seconds}s`;
          
          setDetectedDuration(formatted);
          // อัปเดตลง DB ลับๆ ด้วยเพื่อให้ครั้งหน้าโหลดเร็วขึ้น
          supabase.from('movies').update({ duration: formatted }).eq('id', id).then();
        };
        video.src = videoToCheck;
      }

      // 4. Get Similar Movies
      const { data: similarData } = await supabase
        .from('movies')
        .select('*')
        .eq('genre', movieData.genre)
        .neq('id', id)
        .limit(6);
      setSimilarMovies(similarData || []);

    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    if (isInWatchlist) {
      await supabase.from('watchlist').delete().eq('user_id', user.id).eq('movie_id', id);
      setIsInWatchlist(false);
    } else {
      await supabase.from('watchlist').insert({ user_id: user.id, movie_id: id });
      setIsInWatchlist(true);
    }
  };

  const toggleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/login");

    if (isLiked) {
      await supabase.from('movie_likes').delete().eq('user_id', user.id).eq('movie_id', id);
      setLikes(prev => Math.max(0, prev - 1));
      setIsLiked(false);
      // Update movie table silently
      supabase.from('movies').update({ likes: Math.max(0, likes - 1) }).eq('id', id).then();
    } else {
      await supabase.from('movie_likes').insert({ user_id: user.id, movie_id: id });
      setLikes(prev => prev + 1);
      setIsLiked(true);
      // Update movie table silently
      supabase.from('movies').update({ likes: likes + 1 }).eq('id', id).then();
    }
  };

  useEffect(() => {
    if (movie?.video_url) {
      const timer = setTimeout(() => setShowVideo(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [movie]);

  if (loading) return <SkeletonDetails />;

  if (!movie) {
    return (
      <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-black italic uppercase">Movie Not Found</h1>
        <Button onClick={() => router.push("/")} variant="outline">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Floating Back Button */}
      <button 
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 h-12 w-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-2xl active:scale-90"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#050505] via-[#050505]/20 to-transparent" />
        
        {/* Video or Image Background */}
        {showVideo && movie.video_url ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            className="h-full w-full object-cover scale-105"
            src={movie.video_url}
          />
        ) : (
          <img
            src={movie.image_url}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-16 max-w-4xl space-y-6">
          {movie.title_logo_url ? (
            <img src={movie.title_logo_url} className="h-24 md:h-40 w-auto object-contain self-start animate-in fade-in slide-in-from-bottom-10 duration-1000" />
          ) : (
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-10 duration-1000">
              {movie.title}
            </h1>
          )}

          <div className="flex items-center gap-4 text-sm md:text-base font-bold text-gray-300">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {movie.year}</span>
            <Badge variant="outline" className="text-white border-white/20">HD</Badge>
            {(movie.duration || detectedDuration) && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> 
                {movie.duration || detectedDuration}
              </span>
            )}
            
            {/* Purchase & Free Status Badge */}
            {purchases.some(p => p.movie_id === id) ? (
              <Badge className="bg-green-500 text-white border-0 flex gap-1 items-center">
                <CheckCircle2 className="h-3 w-3" /> ซื้อแล้ว
              </Badge>
            ) : movie.price_coins > 0 ? (
              <Badge className="bg-yellow-400 text-black border-0 flex gap-1 items-center">
                <Coins className="h-3 w-3 fill-black" /> {movie.price_coins} Coins
              </Badge>
            ) : (
              <Badge className="bg-blue-500 text-white border-0">ดูฟรี</Badge>
            )}

            {movie.free_at && isAfter(new Date(movie.free_at), new Date()) && !purchases.some(p => p.movie_id === id) && (
              <Badge className="bg-blue-600/50 backdrop-blur-md text-white border-blue-400/30 flex gap-1 items-center">
                <Calendar className="h-3 w-3" /> ดูฟรี {format(new Date(movie.free_at), "d MMM", { locale: th })}
              </Badge>
            )}
          </div>

          <p className="text-sm md:text-lg text-gray-300 line-clamp-3 md:line-clamp-none max-w-2xl font-medium leading-relaxed">
            {movie.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => router.push(`/watch/${id}${movie.type === 'series' ? `?ep=${episodes[0]?.id}` : ''}`)}
              className="h-12 md:h-14 bg-white text-black hover:bg-yellow-400 hover:text-black px-8 md:px-12 font-black text-lg rounded-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Play className="h-6 w-6 fill-black" /> เล่นเลย
            </Button>

            <button 
              onClick={toggleWatchlist}
              className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl border-2 transition-all active:scale-90 ${isInWatchlist ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/40 border-white/20 text-white hover:border-white'}`}
            >
              {isInWatchlist ? <Check className="h-6 w-6 stroke-[3px]" /> : <Bookmark className="h-6 w-6" />}
            </button>

            <button 
              onClick={toggleLike}
              className={`flex items-center gap-2 h-12 px-4 md:h-14 md:px-6 rounded-xl border-2 transition-all active:scale-90 ${isLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-black/40 border-white/20 text-white hover:border-white hover:bg-white/10'}`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-white' : ''}`} />
              <span className="font-bold text-sm md:text-base">{likes > 0 ? likes.toLocaleString() : 'ถูกใจ'}</span>
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="h-12 w-12 md:h-14 md:w-14 flex items-center justify-center rounded-xl border-2 border-white/20 bg-black/40 text-white hover:bg-white/10 transition-all"
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 md:px-16 py-12 space-y-16">
        {movie.type === 'series' && episodes.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">ตอนทั้งหมด <span className="text-blue-500">({episodes.length})</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {episodes.map((ep, idx) => {
                const isPurchased = purchases.some(p => p.episode_id === ep.id || p.movie_id === id);
                const isFreeSoon = ep.free_at && isAfter(new Date(ep.free_at), new Date());
                
                return (
                  <div 
                    key={ep.id}
                    onClick={() => router.push(`/watch/${id}?ep=${ep.id}`)}
                    className="group cursor-pointer space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all relative"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                      <img src={ep.image_url || movie.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-10 w-10 text-white fill-white" />
                      </div>
                      
                      {isPurchased && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5" /> ซื้อแล้ว
                        </div>
                      )}

                      {!isPurchased && isFreeSoon && (
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 backdrop-blur-sm py-1 px-2 text-center">
                          <p className="text-[9px] font-black uppercase text-white flex items-center justify-center gap-1">
                            <Calendar className="h-2.5 w-2.5" /> ดูฟรี {format(new Date(ep.free_at), "d MMM", { locale: th })}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase italic flex items-center justify-between">
                        <span>EP {idx + 1}: {ep.title}</span>
                        {ep.duration && <span className="text-[10px] text-gray-500">{ep.duration}</span>}
                      </h4>
                      {ep.price_coins > 0 && !isPurchased && (
                        <div className="flex items-center gap-1 mt-1 text-yellow-400">
                          <Coins className="h-3 w-3 fill-yellow-400" />
                          <span className="text-[10px] font-black uppercase">{ep.price_coins} Coins</span>
                        </div>
                      )}
                      {isPurchased && (
                        <div className="flex items-center gap-1 mt-1 text-green-500">
                           <CheckCircle2 className="h-3 w-3" />
                           <span className="text-[10px] font-black uppercase">ปลดล็อกแล้ว</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="space-y-6">
           <h2 className="text-2xl font-black uppercase italic tracking-tighter">เนื้อหาที่คล้ายกัน</h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {similarMovies.map((m) => {
                const isPurchased = purchases.some(p => p.movie_id === m.id);
                return (
                  <MovieCard 
                    key={m.id}
                    id={m.id}
                    title={m.title}
                    image={m.image_url}
                    year={m.year}
                    price_coins={m.price_coins}
                    free_at={m.free_at}
                    is_purchased={isPurchased}
                    is_premium={m.is_premium}
                  />
                );
              })}
              {similarMovies.length === 0 && (
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest italic col-span-full">ไม่พบเนื้อหาที่ใกล้เคียง</p>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
