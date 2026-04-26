"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-6">
          <div className="h-20 w-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">ยืนยันอีเมล</h2>
          <p className="text-gray-400">เราได้ส่งลิงก์ยืนยันไปที่ <span className="text-white font-bold">{email}</span> แล้ว โปรดตรวจสอบในกล่องข้อความของคุณ</p>
          <Button onClick={() => router.push("/login")} className="w-full h-12 bg-white text-black font-black rounded-xl hover:bg-yellow-400 transition-all">
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> กลับไปหน้าเข้าสู่ระบบ
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            CREATE <span className="text-yellow-400">ACCOUNT</span>
          </h1>
          <p className="text-gray-400">สมัครสมาชิกเพื่อเริ่มต้นประสบการณ์การดูหนังที่เหนือระดับ</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl space-y-5 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-yellow-400 focus:outline-none transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-yellow-400 focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-yellow-400 focus:outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-white hover:bg-yellow-400 text-black font-black text-lg rounded-xl transition-all active:scale-95 shadow-xl"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "สมัครสมาชิกตอนนี้"}
          </Button>

          <p className="text-center text-sm text-gray-500 font-medium">
            มีบัญชีอยู่แล้ว?{" "}
            <Link href="/login" className="text-yellow-400 hover:underline font-black">เข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
