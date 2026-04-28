"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="Logo" width={150} height={150} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">
            SIGN <span className="text-yellow-400">IN</span>
          </h1>
          <p className="text-gray-400">เข้าสู่ระบบเพื่อรับชมหนังและซีรีส์ที่คุณชื่นชอบ</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl space-y-6 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
            className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)] transition-all active:scale-95"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "เข้าสู่ระบบ"}
          </Button>

          <p className="text-center text-sm text-gray-500 font-medium">
            ยังไม่มีบัญชี?{" "}
            <Link href="/signup" className="text-yellow-400 hover:underline font-black">สมัครสมาชิก</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
