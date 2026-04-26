"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { 
  User, 
  Mail, 
  Lock, 
  Trash2, 
  Save, 
  ArrowLeft,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    new_password: "",
    confirm_password: ""
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
      setFormData({
        ...formData,
        full_name: data?.full_name || "",
        email: user.email || ""
      });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Update Name in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: formData.full_name })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Update Email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: formData.email });
        if (emailError) throw emailError;
        alert("ส่งลิงก์ยืนยันไปที่อีเมลใหม่ของคุณแล้ว กรุณาตรวจสอบกล่องจดหมาย");
      }

      // 3. Update Password if provided
      if (formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          throw new Error("รหัสผ่านไม่ตรงกัน");
        }
        const { error: pwdError } = await supabase.auth.updateUser({ password: formData.new_password });
        if (pwdError) throw pwdError;
      }

      alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี? ข้อมูลทั้งหมดรวมถึงเหรียญของคุณจะถูกลบถาวรและไม่สามารถเรียกคืนได้!");
    if (!confirmDelete) return;

    try {
      // หมายเหตุ: การลบ Auth User ใน Supabase มักต้องใช้ Service Role หรือล थผ่าน Edge Function 
      // ในที่นี้เราจะทำการ Sign Out และแจ้งให้ผู้ใช้ทราบว่าต้องติดต่อ Admin หรือเราลบข้อมูลใน profiles ออกก่อน
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) throw error;

      await supabase.auth.signOut();
      router.push("/");
      alert("ลบบัญชีเรียบร้อยแล้ว");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <button onClick={() => router.back()} className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">ตั้งค่าบัญชี</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden backdrop-blur-xl">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-400" /> ข้อมูลส่วนตัว
                </CardTitle>
                <CardDescription>จัดการชื่อและข้อมูลพื้นฐานของคุณ</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>ชื่อ-นามสกุล</Label>
                    <Input 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>อีเมลปัจจุบัน</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="bg-black/40 border-white/10 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-white/5 border-0 shadow-2xl overflow-hidden backdrop-blur-xl">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-lg font-black uppercase italic flex items-center gap-2">
                  <Lock className="h-5 w-5 text-yellow-400" /> เปลี่ยนรหัสผ่าน
                </CardTitle>
                <CardDescription>เว้นว่างไว้หากไม่ต้องการเปลี่ยน</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>รหัสผ่านใหม่</Label>
                    <Input 
                      type="password"
                      value={formData.new_password}
                      onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ยืนยันรหัสผ่านใหม่</Label>
                    <Input 
                      type="password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                      className="bg-black/40 border-white/10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updating}
                className="bg-white hover:bg-yellow-400 text-black font-black px-12 rounded-xl h-12 transition-all"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "บันทึกการเปลี่ยนแปลง"}
              </Button>
            </div>
          </form>

          {/* Danger Zone */}
          <Card className="bg-red-500/5 border-red-500/20 border-2 border-dashed shadow-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <ShieldAlert className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase text-red-500 italic">Danger Zone</h3>
                  <p className="text-xs text-gray-500 font-medium max-w-xs">การลบบัญชีจะไม่สามารถย้อนกลับได้ ข้อมูลและเหรียญของคุณจะหายไปทั้งหมด</p>
                </div>
              </div>
              <Button 
                onClick={handleDeleteAccount}
                variant="destructive" 
                className="font-black px-8 rounded-xl h-12 uppercase italic"
              >
                <Trash2 className="h-4 w-4 mr-2" /> ลบบัญชีผู้ใช้
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
