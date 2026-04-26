"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  ArrowLeft, 
  CreditCard, 
  Search, 
  Loader2, 
  User, 
  Film, 
  Coins,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          profiles:user_id (full_name, email),
          movies:movie_id (title, image_url),
          episodes:episode_id (title, movie_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      alert("Error fetching transactions: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.movies?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.episodes?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-500" /> ประวัติการทำรายการ
            </h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="ค้นหาตามชื่อผู้ใช้ หรือชื่อหนัง..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest">ผู้ใช้งาน</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest">รายการที่ซื้อ</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-center">ราคา</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-center">วันที่ทำรายการ</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                      <p className="text-xs font-black uppercase text-gray-500 tracking-widest">กำลังโหลดข้อมูลรายการ...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <p className="text-gray-500 font-bold italic uppercase">ไม่พบข้อมูลรายการซื้อ</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                          {t.profiles?.full_name?.[0] || <User className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-black">{t.profiles?.full_name || "Unknown User"}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{t.profiles?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {t.movies?.image_url && (
                           <img src={t.movies.image_url} className="h-10 w-8 object-cover rounded shadow-md" />
                        )}
                        <div>
                          <p className="text-sm font-bold italic uppercase text-white/90">
                            {t.movies?.title || "Unknown Movie"}
                          </p>
                          {t.episodes && (
                            <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-0 text-[9px] font-black italic uppercase">
                              Episode: {t.episodes.title}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-lg font-black text-yellow-400 italic">-{t.amount_paid}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold">{new Date(t.created_at).toLocaleDateString()}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{new Date(t.created_at).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <Link href={`/movie/${t.movie_id || t.episodes?.movie_id}`}>
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-white">
                           <ExternalLink className="h-4 w-4" />
                         </Button>
                       </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Footer */}
        <div className="mt-8 flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
           <div className="flex items-center gap-8">
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">จำนวนรายการทั้งหมด</p>
                 <p className="text-2xl font-black italic">{filteredTransactions.length} <span className="text-xs text-gray-600">รายการ</span></p>
              </div>
              <div>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">ยอดเหรียญหมุนเวียน</p>
                 <p className="text-2xl font-black italic text-yellow-400">
                    {filteredTransactions.reduce((acc, curr) => acc + curr.amount_paid, 0)} <span className="text-xs text-yellow-400/50">COINS</span>
                 </p>
              </div>
           </div>
           <Button onClick={fetchTransactions} variant="outline" className="border-white/10 hover:bg-white/5 font-black uppercase italic text-xs">
              Refresh Data
           </Button>
        </div>

      </div>
    </div>
  );
}
