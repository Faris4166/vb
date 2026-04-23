import Link from "next/link";
import { Search, User, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex h-20 md:h-24 w-full items-center justify-between bg-gradient-to-b from-black/95 via-black/40 to-transparent px-4 md:px-16 lg:px-24 transition-all duration-500">
      
      <div className="flex items-center gap-8 md:gap-14">
        {/* Mobile Menu Icon */}
        <button className="text-white md:hidden">
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-md bg-zinc-800 p-2 flex flex-col items-center justify-center border border-white/10 group-hover:border-yellow-400 transition-all">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-yellow-400 rotate-90" />
            <span className="text-[7px] font-black text-white mt-0.5 tracking-tighter">FLIX</span>
          </div>
        </Link>

        {/* Navigation Links - Desktop Only */}
        <ul className="hidden flex-row items-center gap-8 md:flex">
          {["หน้าแรก", "หนังใหม่", "ซีรีส์", "ยอดนิยม", "รายการของฉัน"].map((item) => (
            <li key={item} className="text-sm font-black text-white/90 transition-all hover:text-white hover:scale-105">
              <Link href="/">{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6 md:gap-10">
        <button className="text-white hover:text-yellow-400 transition-all hover:scale-110">
          <Search className="h-6 w-6 stroke-[3px]" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden text-right lg:block leading-tight">
            <p className="text-sm font-black text-white">Faris M.</p>
            <p className="text-[10px] text-yellow-400 font-black uppercase tracking-tighter">PREMIUM</p>
          </div>
          <button className="group relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-6 w-6 md:h-7 md:w-7 text-white drop-shadow-md" />
            </div>
          </button>
        </div>
      </div>

    </nav>
  );
}