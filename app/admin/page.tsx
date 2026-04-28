"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  PlaySquare,
  ArrowLeft,
  ChevronRight,
  LogOut,
  Package,
  CreditCard,
  Trophy,
  BarChart3,
  Coins,
  Eye,
  Heart,
  Loader2,
  Database,
  Activity,
  LayoutGrid
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [topLikes, setTopLikes] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCoins: 0, totalMovies: 0 });
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Stats
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: movieCount } = await supabase.from('movies').select('*', { count: 'exact', head: true });
      const { data: purchaseData } = await supabase.from('purchases').select('amount_paid');
      const totalCoins = purchaseData?.reduce((acc, curr) => acc + curr.amount_paid, 0) || 0;

      setStats({
        totalUsers: userCount || 0,
        totalMovies: movieCount || 0,
        totalCoins
      });

      // Top Viewed
      const { data: viewData } = await supabase
        .from('movies')
        .select('*')
        .order('views', { ascending: false })
        .limit(10);
      setTopMovies(viewData || []);

      // Top Liked
      const { data: likeData } = await supabase
        .from('movies')
        .select('*')
        .order('likes', { ascending: false })
        .limit(10);
      setTopLikes(likeData || []);

      // Top Sellers
      const { data: salesData } = await supabase
        .from('purchases')
        .select(`
          movie_id,
          amount_paid,
          movies:movie_id (title, image_url)
        `);
      
      const aggregation: any = {};
      salesData?.forEach((p: any) => {
        if (!p.movie_id) return;
        if (!aggregation[p.movie_id]) {
          aggregation[p.movie_id] = { title: p.movies?.title, image: p.movies?.image_url, total: 0 };
        }
        aggregation[p.movie_id].total += p.amount_paid;
      });

      const sortedSellers = Object.values(aggregation).sort((a: any, b: any) => b.total - a.total).slice(0, 10);
      setTopSellers(sortedSellers);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const NavItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => (
    <Link href={href}>
      <div className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all cursor-pointer">
        <Icon className="h-4 w-4" />
        <span className="font-black text-[10px] uppercase italic tracking-tighter">{label}</span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Header Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 italic">Total Users</p>
              <h4 className="text-2xl font-black italic">{stats.totalUsers}</h4>
           </div>
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 italic">Content</p>
              <h4 className="text-2xl font-black italic">{stats.totalMovies}</h4>
           </div>
           <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 italic">Total Sales</p>
              <h4 className="text-2xl font-black italic text-yellow-400">{stats.totalCoins} <span className="text-xs">COINS</span></h4>
           </div>
           <div className="bg-yellow-400 p-6 rounded-3xl flex items-center justify-between text-black cursor-pointer hover:scale-105 transition-all" onClick={() => router.push("/")}>
              <span className="font-black italic uppercase text-sm">View Website</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
           </div>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-wrap items-center gap-3">
           <NavItem icon={Film} label="Content" href="/admin/movies" />
           <NavItem icon={Users} label="Users" href="/admin/users" />
           <NavItem icon={LayoutGrid} label="Categories" href="/admin/categories" />
           <NavItem icon={Package} label="Packages" href="/admin/packages" />
           <NavItem icon={CreditCard} label="History" href="/admin/transactions" />
           <button 
             onClick={handleSignOut}
             className="group flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
           >
             <LogOut className="h-4 w-4" />
             <span className="font-black text-[10px] uppercase italic tracking-tighter">Logout</span>
           </button>
        </div>

        {/* Main Ranking Table (Full Width) */}
        <Card className="bg-[#0f0f0f] border-white/5 border-0 shadow-2xl rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">จัดอันดับเนื้อหา</CardTitle>
              <CardDescription className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">รายการที่มียอดคนดูและยอดขายสูงสุดในระบบ</CardDescription>
            </div>
            <Link href="/admin/movies"><Button variant="secondary" className="h-10 rounded-xl font-black uppercase italic text-[10px]">จัดการหนังทั้งหมด</Button></Link>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Tabs defaultValue="views" className="w-full">
              <TabsList className="bg-white/5 w-full justify-start p-1 mb-6 h-14 rounded-2xl flex-wrap">
                <TabsTrigger value="views" className="flex-1 rounded-xl font-black uppercase italic text-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black min-w-[120px]">
                  <Eye className="h-5 w-5 mr-2" /> ยอดคนดู
                </TabsTrigger>
                <TabsTrigger value="likes" className="flex-1 rounded-xl font-black uppercase italic text-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black min-w-[120px]">
                  <Heart className="h-5 w-5 mr-2" /> ยอดถูกใจ
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex-1 rounded-xl font-black uppercase italic text-sm data-[state=active]:bg-yellow-400 data-[state=active]:text-black min-w-[120px]">
                  <Coins className="h-5 w-5 mr-2" /> ยอดขาย
                </TabsTrigger>
              </TabsList>

              <TabsContent value="views" className="space-y-3 mt-0">
                {loading ? <LoadingSkeleton /> : topMovies.map((movie, idx) => (
                  <div key={movie.id} className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/5 rounded-3xl border border-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-10 text-center font-black italic text-gray-700 group-hover:text-yellow-400/20 text-3xl">{idx + 1}</div>
                       <div className="h-16 w-12 rounded-xl overflow-hidden shadow-2xl">
                          <img src={movie.image_url} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-lg uppercase italic text-white/90">{movie.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{movie.genre} • {movie.year}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 text-blue-400 bg-blue-400/5 px-6 py-3 rounded-2xl border border-blue-400/10">
                       <Eye className="h-5 w-5" />
                       <span className="font-black italic text-xl">{movie.views?.toLocaleString() || 0}</span>
                       <span className="text-[10px] font-black uppercase opacity-60">Views</span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="likes" className="space-y-3 mt-0">
                {loading ? <LoadingSkeleton /> : topLikes.map((movie, idx) => (
                  <div key={movie.id} className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/5 rounded-3xl border border-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-10 text-center font-black italic text-gray-700 group-hover:text-yellow-400/20 text-3xl">{idx + 1}</div>
                       <div className="h-16 w-12 rounded-xl overflow-hidden shadow-2xl">
                          <img src={movie.image_url} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-lg uppercase italic text-white/90">{movie.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{movie.genre} • {movie.year}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 text-red-500 bg-red-500/5 px-6 py-3 rounded-2xl border border-red-500/10">
                       <Heart className="h-5 w-5" />
                       <span className="font-black italic text-xl">{movie.likes?.toLocaleString() || 0}</span>
                       <span className="text-[10px] font-black uppercase opacity-60">Likes</span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="sales" className="space-y-3 mt-0">
                {loading ? <LoadingSkeleton /> : topSellers.map((movie: any, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-white/[0.02] hover:bg-white/5 rounded-3xl border border-white/5 transition-all group">
                    <div className="flex items-center gap-6">
                       <div className="w-10 text-center font-black italic text-gray-700 group-hover:text-yellow-400/20 text-3xl">{idx + 1}</div>
                       <div className="h-16 w-12 rounded-xl overflow-hidden shadow-2xl">
                          <img src={movie.image} className="w-full h-full object-cover" />
                       </div>
                       <p className="font-black text-lg uppercase italic text-white/90">{movie.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-yellow-400 bg-yellow-400/5 px-6 py-3 rounded-2xl border border-yellow-400/10">
                       <Coins className="h-5 w-5" />
                       <span className="font-black italic text-xl">{movie.total?.toLocaleString()}</span>
                       <span className="text-[10px] font-black uppercase opacity-60">Coins</span>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
       {[1,2,3,4,5].map(i => (
         <div key={i} className="h-20 bg-white/5 animate-pulse rounded-3xl" />
       ))}
    </div>
  );
}
