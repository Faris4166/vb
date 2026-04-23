import Link from "next/link";
import { Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent px-8 md:px-16 lg:px-24 transition-all duration-500">
      
      <div className="flex items-center gap-12">
        {/* Logo with Image - ปรับขนาดภาพโลโก้ให้พอดี (h-9) และเพิ่ม gap */}
        <Link href="/" className="group flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="FARISSTREAM" 
            className="h-9 w-auto transition-transform group-hover:scale-110" 
          />
          <span className="text-xl font-black tracking-tighter text-white hidden sm:block">
            FARIS<span className="text-yellow-400">STREAM</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden flex-row items-center gap-8 md:flex">
          {["หน้าแรก", "หนังใหม่", "ซีรีส์", "ยอดนิยม", "รายการของฉัน"].map((item) => (
            <li key={item} className="text-sm font-semibold text-gray-300 transition-all hover:text-yellow-400 hover:scale-105">
              <Link href="/">{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <button className="text-gray-300 hover:text-white transition-all hover:scale-110">
          <Search className="h-5 w-5 stroke-[2.5px]" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-xs font-bold text-white">Faris M.</p>
            <p className="text-[10px] text-yellow-400 font-medium">PREMIUM</p>
          </div>
          <button className="group relative h-10 w-10 overflow-hidden rounded-xl border-2 border-white/10 transition-all hover:border-yellow-400">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-400 group-hover:scale-110 transition-transform" />
            <User className="absolute inset-0 m-auto h-6 w-6 text-white" />
          </button>
        </div>
      </div>

    </nav>
  );
}