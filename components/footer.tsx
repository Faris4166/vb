import React from "react";
import Link from "next/link";
import { 
  ShieldCheck,
  Globe
} from "lucide-react";

const LineIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738s-12 4.369-12 9.738c0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.589-1.601 2.531-3.321 2.531-5.002z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-yellow-400">KMniyai</h2>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase italic tracking-widest text-white">เมนูแนะนำ</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase italic">หน้าแรก</Link></li>
              <li><Link href="/categories" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase italic">หมวดหมู่ทั้งหมด</Link></li>
              <li><Link href="/premium" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase italic">แพ็คเกจเหรียญ</Link></li>
              <li><Link href="/watchlist" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm font-bold uppercase italic">รายการที่บันทึกไว้</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase italic tracking-widest text-white">ช่องทางติดต่อ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20">
                  <LineIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 italic mb-1">LINE Official</p>
                  <Link href="https://line.me" className="text-2xl font-black uppercase italic text-white hover:text-green-500 transition-colors tracking-tighter">@wonkstream</Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest italic">
            © 2024 KMniyai. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
