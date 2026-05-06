import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function LegalNoticePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.2)]">
            <ShieldCheck className="text-black h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              ประกาศทาง <span className="text-yellow-400">กฎหมาย</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Legal Notice & Copyright</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-zinc-900/50 border border-white/10 p-10 md:p-16 rounded-[2rem] backdrop-blur-xl shadow-2xl">
            <div className="space-y-8">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-center text-white/90 italic">
                "© เนื้อหาวิดีโอ ภาพ เสียง และองค์ประกอบทั้งหมดบนเว็บไซต์นี้ เป็นลิขสิทธิ์ของช่อง <span className="text-yellow-400">KM Niyai</span>"
              </p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mx-auto"></div>
              <p className="text-base md:text-lg font-medium leading-relaxed text-center text-gray-400">
                ห้ามคัดลอก ดัดแปลง เผยแพร่ อัปโหลด หรือทำซ้ำ ไม่ว่าทั้งหมดหรือบางส่วน <br className="hidden md:block"/>
                โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเจ้าของลิขสิทธิ์
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase italic tracking-widest transition-all hover:gap-5 hover:text-yellow-400 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
    </div>
  );
}
