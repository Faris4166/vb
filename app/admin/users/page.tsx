"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Users, 
  Search, 
  Coins, 
  Edit2, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Plus,
  Minus,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newCoins, setNewCoins] = useState<number>(0);
  
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setUsers(data);
    setLoading(false);
  };

  const handleUpdateCoins = async () => {
    if (!editingUser) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ coins: newCoins })
      .eq('id', editingUser.id);

    if (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } else {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, coins: newCoins } : u));
      setEditingUser(null);
      alert("อัปเดตเหรียญสำเร็จ!");
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">จัดการสมาชิก & เหรียญ</h1>
            <p className="text-gray-500 text-sm font-medium">ดูรายชื่อผู้ใช้งานและปรับปรุงยอดเหรียญในระบบ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main User Table */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl backdrop-blur-md">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="ค้นหาสมาชิกด้วยอีเมล..." 
                    className="pl-10 bg-white/5 border-white/10 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>สมาชิก</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead>เหรียญ (Coins)</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell><div className="h-10 w-40 bg-white/5 rounded-lg" /></TableCell>
                        <TableCell><div className="h-6 w-16 bg-white/5 rounded-full" /></TableCell>
                        <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                        <TableCell><div className="h-8 w-8 bg-white/5 rounded-lg ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="group transition-colors hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                              <UserIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{user.email}</p>
                              <p className="text-[10px] text-gray-500 font-bold">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.role === 'admin' ? (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] uppercase font-black">Admin</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 border-gray-500/20 text-[9px] uppercase font-black">User</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Coins className="h-3 w-3 text-yellow-400" />
                             <span className="font-black text-white">{user.coins || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                           <Button 
                             onClick={() => {
                               setEditingUser(user);
                               setNewCoins(user.coins || 0);
                             }}
                             variant="ghost" 
                             size="sm" 
                             className="h-8 px-3 text-xs font-black uppercase text-yellow-400 hover:bg-yellow-400/10"
                           >
                             <Edit2 className="h-3 w-3 mr-2" /> ปรับเหรียญ
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Users className="h-12 w-12 opacity-20" />
                          <p className="font-bold">ไม่พบรายชื่อสมาชิก</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Right Panel: Coin Editor */}
          <div className="space-y-6">
            {editingUser ? (
              <Card className="bg-zinc-900/40 border-yellow-400/20 border-2 shadow-2xl shadow-yellow-400/5 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg font-black uppercase italic text-yellow-400">แก้ไขเหรียญ</CardTitle>
                  <CardDescription className="text-gray-400 text-xs truncate">
                    สำหรับอีเมล: {editingUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-gray-500 uppercase mb-2">เหรียญปัจจุบัน</p>
                    <p className="text-4xl font-black text-white flex items-center gap-2">
                       <Coins className="h-8 w-8 text-yellow-400" /> {newCoins}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                     <Button 
                       onClick={() => setNewCoins(prev => Math.max(0, prev - 100))}
                       variant="outline" className="flex-1 border-white/10 hover:bg-red-500/10 hover:text-red-500">
                       <Minus className="h-4 w-4 mr-2" /> 100
                     </Button>
                     <Button 
                       onClick={() => setNewCoins(prev => prev + 100)}
                       variant="outline" className="flex-1 border-white/10 hover:bg-green-500/10 hover:text-green-500">
                       <Plus className="h-4 w-4 mr-2" /> 100
                     </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>ระบุจำนวนเหรียญใหม่</Label>
                    <Input 
                      type="number" 
                      value={newCoins} 
                      onChange={(e) => setNewCoins(parseInt(e.target.value) || 0)}
                      className="bg-black/40 border-white/10 text-center text-xl font-black"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleUpdateCoins}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-black w-full"
                    >
                      <Save className="h-4 w-4 mr-2" /> ยืนยันการเปลี่ยนแปลง
                    </Button>
                    <Button 
                      onClick={() => setEditingUser(null)}
                      variant="ghost" className="text-gray-500 hover:text-white w-full"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-zinc-900/20 border-white/5 border-dashed border-2 opacity-50">
                <CardContent className="p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Edit2 className="h-6 w-6 text-gray-700" />
                  </div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    เลือกสมาชิกในตาราง<br/>เพื่อปรับแต่งเหรียญ
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/5">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400" /> ข้อมูลระเบียบการ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-[10px] text-gray-400 space-y-2 font-medium">
                  <li className="flex gap-2">• การแก้ไขเหรียญโดย Admin จะไม่มีการบันทึกในประวัติการเติมเงินปกติ</li>
                  <li className="flex gap-2">• กรุณาตรวจสอบอีเมลผู้ใช้ให้ถูกต้องก่อนยืนยัน</li>
                  <li className="flex gap-2">• ระบบจะทำการอัปเดตทันทีเมื่อกดบันทึก</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
