"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Coins, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Wallet,
  Star,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";

export default function TopupPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // 1. Fetch User Profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profileData);
    }

    // 2. Fetch Packages
    const { data: packagesData } = await supabase
      .from('packages')
      .select('*')
      .order('price_thb', { ascending: true });
    
    if (packagesData) setPackages(packagesData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
            Coin Shop
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase">
            เติมเหรียญ <span className="text-yellow-400">FLIX COINS</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium text-sm md:text-base">
            ปลดล็อกเนื้อหาพรีเมียมและรับชมวิดีโอตอนล่าสุดก่อนใคร <br/> เลือกแพ็กเกจที่คุ้มค่าที่สุดสำหรับคุณด้านล่างนี้
          </p>
        </div>

        {/* User Balance Card */}
        <div className="mb-12">
          <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl backdrop-blur-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="h-32 w-32 text-yellow-400" />
            </div>
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                  <Coins className="h-8 w-8 text-black" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">ยอดคงเหลือของคุณ</p>
                  <h2 className="text-4xl font-black flex items-center gap-2 italic">
                    {profile?.coins || 0} <span className="text-yellow-400 text-xl not-italic">COINS</span>
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right hidden md:block">
                   <p className="text-xs font-bold text-green-500 uppercase">Verified Account</p>
                   <p className="text-[10px] text-gray-500 uppercase">{profile?.email}</p>
                 </div>
                 <div className="h-10 w-[1px] bg-white/10 hidden md:block mx-2" />
                 <ShieldCheck className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
            ))
          ) : packages.map((pkg, index) => {
            const isBestValue = pkg.bonus_coins > 0 && pkg.price_thb >= 300;
            return (
              <Card 
                key={pkg.id} 
                className={`bg-zinc-900/40 border-white/5 border-0 shadow-2xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden group ${isBestValue ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                {isBestValue && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-tighter z-10">
                    Best Value
                  </div>
                )}
                
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isBestValue ? 'bg-yellow-400' : 'bg-white/5'}`}>
                      <Zap className={`h-6 w-6 ${isBestValue ? 'text-black' : 'text-yellow-400'}`} />
                    </div>
                    <p className="text-sm font-black text-gray-500 italic uppercase">{pkg.name}</p>
                  </div>
                  <CardTitle className="text-3xl font-black flex flex-col">
                    <span className="flex items-center gap-2">
                      {(pkg.coins_amount + pkg.bonus_coins).toLocaleString()}
                      <span className="text-yellow-400 text-sm">COINS</span>
                    </span>
                    {pkg.bonus_coins > 0 && (
                      <span className="text-blue-400 text-xs mt-1">+ โบนัส {pkg.bonus_coins.toLocaleString()} Coins</span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> ปลดล็อกเนื้อหาพรีเมียมได้ทันที
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> ไม่มีวันหมดอายุ
                    </div>
                  </div>

                  <Button className={`w-full h-14 rounded-2xl font-black text-lg group-hover:gap-4 transition-all ${isBestValue ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                    {pkg.price_thb.toLocaleString()} THB <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Methods Info */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
             <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
               <CreditCard className="h-5 w-5 text-gray-400" />
             </div>
             <div>
               <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">หลากหลายช่องทาง</h4>
               <p className="text-xs text-gray-500 leading-relaxed">รองรับการโอนผ่านธนาคาร, QR Code และ TrueMoney Wallet</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
               <Zap className="h-5 w-5 text-gray-400" />
             </div>
             <div>
               <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">รวดเร็วทันใจ</h4>
               <p className="text-xs text-gray-500 leading-relaxed">เหรียญเข้าบัญชีทันทีหลังจากระบบยืนยันการชำระเงินสำเร็จ</p>
             </div>
          </div>
          <div className="flex items-start gap-4">
             <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
               <Star className="h-5 w-5 text-gray-400" />
             </div>
             <div>
               <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">ปลอดภัย 100%</h4>
               <p className="text-xs text-gray-500 leading-relaxed">ระบบความปลอดภัยมาตรฐานสูง ข้อมูลส่วนตัวของคุณจะถูกเก็บรักษาอย่างดี</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
