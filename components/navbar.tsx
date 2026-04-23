import Link from "next/link";
import { Search, User, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 md:h-20 w-full items-center justify-between bg-gradient-to-b from-black/95 via-black/40 to-transparent px-4 md:px-16 lg:px-24 transition-all duration-500">
      
      <div className="flex items-center gap-6 md:gap-12">
        {/* Mobile Menu Icon */}
        <button className="text-white md:hidden">
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 md:gap-3">
          <img 
            src="/logo.png" 
            alt="FARISSTREAM" 
            className="h-7 md:h-9 w-auto transition-transform group-hover:scale-110" 
          />
          <span className="text-lg md:text-xl font-black tracking-tighter text-white hidden xs:block">
            FARIS<span className="text-yellow-400">STREAM</span>
          </span>
        </Link>

        {/* Navigation Links - Desktop Only */}
        <ul className="hidden flex-row items-center gap-8 md:flex">
          {["หน้าแรก", "หนังใหม่", "ซีรีส์", "ยอดนิยม", "รายการของฉัน"].map((item) => (
            <li key={item} className="text-sm font-semibold text-gray-300 transition-all hover:text-yellow-400 hover:scale-105">
              <Link href="/">{item}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        <button className="text-gray-300 hover:text-white transition-all hover:scale-110">
          <Search className="h-5 w-5 stroke-[2.5px]" />
        </button>
        
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden text-right lg:block">
            <p className="text-xs font-bold text-white">Faris M.</p>
            <p className="text-[10px] text-yellow-400 font-medium uppercase tracking-wider">Premium</p>
          </div>
          <button className="group relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-lg md:rounded-xl border border-white/10 transition-all hover:border-yellow-400">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-400 group-hover:scale-110 transition-transform" />
            <User className="absolute inset-0 m-auto h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </div>
      </div>

    </nav>
  );
}