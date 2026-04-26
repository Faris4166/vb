"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Settings, 
  DollarSign, 
  Coins, 
  Save, 
  ArrowLeft,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*');
    
    if (data) {
      setSettings(data);
    } else {
      // Fallback if table doesn't exist yet or is empty
      setSettings([
        { key: 'coin_rate', value: '10', description: 'จำนวนเหรียญต่อ 1 บาท (1 THB = 10 Coins)' },
        { key: 'min_topup', value: '50', description: 'ยอดการเติมเงินขั้นต่ำ' }
      ]);
    }
    setLoading(false);
  };

  const handleUpdateSetting = (key: string, newValue: string) => {
    setSettings(settings.map(s => s.key === key ? { ...s, value: newValue } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('settings')
          .upsert({ 
            key: setting.key, 
            value: setting.value, 
            description: setting.description,
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
      }
      alert("บันทึกการตั้งค่าสำเร็จ!");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/admin" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">ตั้งค่าระบบ</h1>
            <p className="text-gray-500 text-sm font-medium">จัดการอัตราแลกเปลี่ยนและค่ากำหนดต่างๆ ของเว็บไซต์</p>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 rounded-xl shadow-lg shadow-yellow-400/10"
          >
            {saving ? "กำลังบันทึก..." : <><Save className="h-4 w-4 mr-2" /> บันทึกทั้งหมด</>}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Exchange Rate Card */}
          <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden backdrop-blur-md">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                  <Coins className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black uppercase italic">Coin Exchange Rate</CardTitle>
                  <CardDescription className="text-xs">ปรับอัตราส่วนระหว่าง "บาท" และ "เหรียญ"</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                 <TableHeader>
                   <TableRow className="hover:bg-transparent border-white/5">
                     <TableHead className="w-[200px]">ค่าที่ตั้งไว้ (Key)</TableHead>
                     <TableHead>รายละเอียด</TableHead>
                     <TableHead className="w-[150px] text-right">ค่ากำหนด (Value)</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {settings.map((setting) => (
                     <TableRow key={setting.key} className="border-white/5 hover:bg-white/5 transition-all">
                       <TableCell className="font-black text-yellow-400 uppercase text-xs">{setting.key}</TableCell>
                       <TableCell className="text-gray-400 text-xs font-medium">{setting.description}</TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end">
                           <Input 
                             type="text"
                             value={setting.value}
                             onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                             className="w-24 bg-black/40 border-white/10 text-center font-black h-8 text-sm"
                           />
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
            </CardContent>
          </Card>

          {/* Quick Preview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 border-0 shadow-xl shadow-yellow-400/5">
              <CardContent className="p-8 flex flex-col items-center justify-center text-black">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">อัตราปัจจุบัน</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-black italic">1 THB</p>
                    <p className="text-[9px] font-bold uppercase">เงินสด</p>
                  </div>
                  <RefreshCw className="h-6 w-6 opacity-40 animate-reverse-spin" />
                  <div className="text-center">
                    <p className="text-3xl font-black italic">{settings.find(s => s.key === 'coin_rate')?.value || '10'} COINS</p>
                    <p className="text-[9px] font-bold uppercase">เหรียญในระบบ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl flex items-center p-8 gap-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 text-blue-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white mb-1">ข้อควรระวัง</p>
                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  การเปลี่ยนอัตราแลกเปลี่ยนจะมีผลกับสมาชิกที่เติมเงินใหม่ทันที <br/> 
                  เหรียญเดิมของผู้ใช้จะไม่มีการเปลี่ยนแปลง
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
