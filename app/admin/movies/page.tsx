"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Film, 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function MoviesManagement() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setMovies(data);
    setLoading(false);
  };

  const deleteMovie = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเนื้อหานี้?")) return;
    
    const { error } = await supabase.from('movies').delete().eq('id', id);
    if (error) {
      alert("เกิดข้อผิดพลาดในการลบ");
    } else {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">จัดการเนื้อหา</h1>
            <p className="text-gray-500 text-sm font-medium">รวมรายการหนังและซีรีส์ทั้งหมดในระบบ</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/admin/movies/add">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-6 rounded-xl">
                <PlusCircle className="h-4 w-4 mr-2" /> เพิ่มเนื้อหาใหม่
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Search */}
        <Card className="bg-zinc-900/40 border-white/5 mb-8 border-0 shadow-2xl backdrop-blur-md">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="ค้นหาชื่อหนังหรือซีรีส์..." 
                className="pl-10 bg-white/5 border-white/10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-bold rounded-xl">ทั้งหมด</Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-bold rounded-xl text-gray-500">หนัง</Button>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 text-xs font-bold rounded-xl text-gray-500">ซีรีส์</Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Table */}
        <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>เนื้อหา</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สถิติ</TableHead>
                <TableHead>วันที่เพิ่ม</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-10 w-32 bg-white/5 rounded-lg" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-white/5 rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-white/5 rounded-full" /></TableCell>
                    <TableCell><div className="h-6 w-24 bg-white/5 rounded-lg" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-white/5 rounded-full" /></TableCell>
                    <TableCell><div className="h-8 w-8 bg-white/5 rounded-lg ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <TableRow key={movie.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-20 bg-zinc-800 rounded-lg overflow-hidden border border-white/10 relative shrink-0">
                           {movie.image_url ? (
                             <img src={movie.image_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center"><Film className="h-5 w-5 text-gray-600" /></div>
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-yellow-400 transition-colors">{movie.title}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">{movie.year || 'N/A'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={movie.type === 'series' ? "text-blue-400 border-blue-400/20 bg-blue-400/5 font-bold uppercase text-[10px]" : "text-yellow-400 border-yellow-400/20 bg-yellow-400/5 font-bold uppercase text-[10px]"}>
                        {movie.type === 'series' ? 'Series' : 'Movie'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-gray-400 font-bold uppercase">{movie.genre || 'General'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                         <span className="flex items-center gap-1 text-blue-400"><Eye className="h-3 w-3" /> {movie.views || 0}</span>
                         <span className="flex items-center gap-1 text-red-500"><Heart className="h-3 w-3" /> {movie.likes || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {new Date(movie.created_at).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      {movie.is_premium ? (
                        <Badge className="bg-yellow-400 text-black font-black text-[9px] uppercase">Premium</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 border-gray-500/20 text-[9px] uppercase">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                         <Link href={`/movie/${movie.id}`}>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-white"><Eye className="h-4 w-4" /></Button>
                         </Link>
                         <div className="flex items-center gap-2">
                          <Link href={`/admin/movies/edit/${movie.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-500 hover:bg-blue-500/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteMovie(movie.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-600/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-500">
                      <Film className="h-12 w-12 opacity-20" />
                      <p className="font-bold">ไม่พบข้อมูลเนื้อหา</p>
                      <Link href="/admin/movies/add">
                        <Button variant="link" className="text-yellow-400">เริ่มเพิ่มหนังใหม่เลย</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-black uppercase">
             <p>Showing {filteredMovies.length} of {movies.length} content</p>
             <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10"><ChevronLeft className="h-4 w-4" /></Button>
               <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10 text-yellow-400">1</Button>
               <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-white/10"><ChevronRight className="h-4 w-4" /></Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
