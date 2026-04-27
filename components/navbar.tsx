"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Menu, LogOut, Wallet, LayoutDashboard, Coins, Settings, History } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        // Refresh profile when user changes
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDropdown && !(e.target as Element).closest('.profile-menu')) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-2xl py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'}`}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Logo & Links */}
        <div className="flex items-center gap-6 md:gap-12">
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-2 transition-all group-hover:scale-105">
              <img src="/logo.svg" alt="Logo" className="h-10 w-auto md:h-12" />
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white uppercase">
                KM<span className="text-yellow-400">niyai</span>
              </h1>
            </div>
          </Link>

          <ul className="hidden lg:flex items-center gap-6 xl:gap-10">
            {[
              { label: "หน้าแรก", href: "/" },
              { label: "หนัง", href: "/categories?type=movie" },
              { label: "ซีรีส์", href: "/categories?type=series" },
              { label: "หมวดหมู่", href: "/categories" },
              { label: "รายการของฉัน", href: "/mylist" }
            ].map((item) => (
              <li key={item.label} className="text-sm font-black text-white/90 transition-all hover:text-white hover:scale-105">
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 md:gap-6 flex-1 justify-end">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative group w-full max-w-[150px] md:max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
            <input 
              type="text" 
              placeholder="ค้นหาหนัง, ซีรีส์..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs md:text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all"
            />
          </form>

          {!loading && (
            user ? (
              <div className="flex items-center gap-3 md:gap-5">
                {/* Coins */}
                <Link href="/topup" className="hidden sm:flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-full hover:bg-yellow-400/20 transition-all">
                  <Coins className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-black text-yellow-400">{profile?.coins || 0}</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-menu">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center hover:border-yellow-400/50 transition-all"
                  >
                    <User className="h-6 w-6 text-white" />
                  </button>

                  {showDropdown && (
                    <div className="absolute top-full right-0 mt-3 w-64 bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                       <div className="px-4 py-3 border-b border-white/5 mb-2">
                          <p className="text-sm font-black text-white truncate">{profile?.full_name || user.email}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{profile?.role === 'admin' ? 'Administrator' : 'Premium Member'}</p>
                       </div>
                       
                       {profile?.role === 'admin' && (
                         <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-yellow-400 hover:bg-white/5 rounded-xl transition-all">
                           <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                         </Link>
                       )}
                       
                       <Link href="/profile/settings" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5 rounded-xl transition-all">
                         <Settings className="h-4 w-4" /> Account Settings
                       </Link>

                       <Link href="/profile/purchases" className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/5 rounded-xl transition-all">
                         <History className="h-4 w-4" /> My Purchases
                       </Link>
                       
                       <button 
                         onClick={handleSignOut}
                         className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all mt-1"
                       >
                         <LogOut className="h-4 w-4" /> Sign Out
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2 bg-yellow-400 text-black font-black text-sm rounded-full hover:bg-yellow-500 transition-all">
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}