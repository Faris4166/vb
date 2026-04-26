"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Package, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Coins,
  DollarSign,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";

export default function PackagesManagement() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('price_thb', { ascending: true });
    
    if (data) setPackages(data);
    setLoading(false);
  };

  const handleAddPackage = () => {
    const newPkg = {
      id: null,
      name: `Package ${packages.length + 1}`,
      price_thb: 0,
      coins_amount: 0,
      bonus_coins: 0,
      isNew: true
    };
    setPackages([...packages, newPkg]);
  };

  const handleRemovePackage = async (id: any, index: number) => {
    if (!id) {
      setPackages(packages.filter((_, i) => i !== index));
      return;
    }

    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจนี้?")) return;

    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) {
      alert("ลบไม่สำเร็จ: " + error.message);
    } else {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handleUpdateField = (index: number, field: string, value: any) => {
    const newPackages = [...packages];
    // ถ้าเป็นตัวเลข ให้เช็คว่า NaN หรือไม่ ถ้าใช่ให้เป็น 0
    let finalValue = value;
    if (field === 'price_thb' || field === 'coins_amount' || field === 'bonus_coins') {
      finalValue = isNaN(value) ? 0 : value;
    }
    newPackages[index][field] = finalValue;
    setPackages(newPackages);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const pkg of packages) {
        const dataToSave: any = {
          name: pkg.name,
          price_thb: pkg.price_thb,
          coins_amount: pkg.coins_amount,
          bonus_coins: pkg.bonus_coins
        };
        
        if (pkg.id) dataToSave.id = pkg.id;

        const { error } = await supabase
          .from('packages')
          .upsert(dataToSave);
        if (error) throw error;
      }
      alert("บันทึกข้อมูลสำเร็จ!");
      fetchPackages();
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">จัดการแพ็กเกจเหรียญ</h1>
            <p className="text-gray-500 text-sm font-medium">ตั้งค่าราคาและจำนวนเหรียญที่ได้รับเมื่อเติมเงิน</p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
               onClick={handleAddPackage}
               variant="outline"
               className="border-white/10 hover:bg-white/5 text-white font-bold px-4 rounded-xl"
             >
               <Plus className="h-4 w-4 mr-2" /> เพิ่มแพ็กเกจ
             </Button>
             <Button 
               onClick={handleSave}
               disabled={saving}
               className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 rounded-xl shadow-lg shadow-yellow-400/10"
             >
               {saving ? "กำลังบันทึก..." : <><Save className="h-4 w-4 mr-2" /> บันทึกการแก้ไข</>}
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Packages Table */}
          <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden backdrop-blur-md">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                  <Package className="h-5 w-5 text-yellow-400" />
                  Coin Packages
                </CardTitle>
                <CardDescription className="text-xs">รายการแพ็กเกจที่คุณกำหนดไว้ในระบบ</CardDescription>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-black">ACTIVE</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>ชื่อแพ็กเกจ</TableHead>
                    <TableHead>ราคา (บาท)</TableHead>
                    <TableHead>เหรียญหลัก</TableHead>
                    <TableHead>เหรียญโบนัส</TableHead>
                    <TableHead className="text-right">รวมทั้งหมด</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell colSpan={7}><div className="h-12 bg-white/5 rounded-lg w-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : packages.map((pkg, index) => (
                    <TableRow key={pkg.id || index} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="text-gray-500 font-mono text-[10px]">
                        {pkg.id ? `#00${pkg.id}` : <Badge className="bg-blue-500/20 text-blue-400 text-[8px] px-1">NEW</Badge>}
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={pkg.name} 
                          onChange={(e) => handleUpdateField(index, 'name', e.target.value)}
                          className="bg-transparent border-transparent hover:border-white/10 focus:bg-black/40 h-8 text-sm font-bold text-white transition-all"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-500" />
                          <Input 
                            type="number"
                            value={pkg.price_thb} 
                            onChange={(e) => handleUpdateField(index, 'price_thb', parseFloat(e.target.value))}
                            className="bg-black/40 border-white/10 pl-7 h-8 w-24 text-xs font-black text-white"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Coins className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-yellow-400" />
                          <Input 
                            type="number"
                            value={pkg.coins_amount} 
                            onChange={(e) => handleUpdateField(index, 'coins_amount', parseInt(e.target.value))}
                            className="bg-black/40 border-white/10 pl-7 h-8 w-24 text-xs font-black text-white"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number"
                          value={pkg.bonus_coins} 
                          onChange={(e) => handleUpdateField(index, 'bonus_coins', parseInt(e.target.value))}
                          className="bg-black/40 border-white/10 h-8 w-20 text-xs font-black text-blue-400"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-lg font-black text-yellow-400">{(pkg.coins_amount + pkg.bonus_coins).toLocaleString()}</span>
                           <span className="text-[9px] font-black uppercase text-gray-500">Coins</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleRemovePackage(pkg.id, index)}
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-white/5 p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-white">Best Value Logic</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    คุณควรตั้งโบนัสเหรียญในแพ็กเกจที่ราคาสูงขึ้น เพื่อดึงดูดให้ลูกค้าเลือกซื้อแพ็กเกจที่คุ้มค่าที่สุด
                  </p>
                </div>
             </Card>

             <Card className="bg-zinc-900/40 border-white/5 border-0 p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-400">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-white">Real-time Update</p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    เมื่อคุณกดบันทึก ข้อมูลในหน้าเติมเงินของลูกค้าจะเปลี่ยนเป็นราคาใหม่ทันทีโดยไม่ต้องรีสตาร์ทระบบ
                  </p>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
