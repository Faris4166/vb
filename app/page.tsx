import CarouselHero from "@/components/carousel-hero";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";
import { createClient } from "@/lib/supabase";
import { Film } from "lucide-react";
import HomeContent from "./home-content";

export default async function Home() {
  const supabase = createClient();
  
  // ดึงข้อมูลหนังจาก Server เลย (ไวกว่าดึงจาก Client มาก)
  const { data: movies } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (!movies || movies.length === 0) {
    return (
      <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-black">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-4">
           <Film className="h-16 w-16 opacity-20" />
           <p className="text-xl font-bold">ยังไม่มีเนื้อหาในระบบ</p>
        </div>
      </main>
    );
  }

  // แยกหนังสำหรับ Hero (3 เรื่องแรก)
  const heroMovies = movies.slice(0, 3);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-black pb-20">
      <Navbar />
      <CarouselHero movies={heroMovies} />
      
      {/* ส่งข้อมูลหนังไปให้ Client Component จัดการต่อ (เช่น ประวัติการดู) */}
      <HomeContent initialMovies={movies} />
    </main>
  );
}
