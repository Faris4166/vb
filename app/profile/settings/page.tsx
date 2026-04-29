"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";

export default function ProfileSettings() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        <div className="w-full max-w-[800px] mb-6">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">ตั้งค่าบัญชี</h1>
        </div>

        <div className="w-full flex justify-center animate-in fade-in zoom-in duration-500">
          <UserProfile 
            appearance={{
              elements: {
                rootBox: "w-full max-w-[800px] shadow-2xl",
                card: "bg-zinc-900/40 border border-white/5 backdrop-blur-xl shadow-2xl rounded-2xl",
                navbar: "hidden",
                headerTitle: "text-white font-black italic",
                headerSubtitle: "text-gray-400",
                profileSectionTitleText: "text-white font-black",
                profileSectionContent: "text-gray-300",
                profileSectionPrimaryButton: "text-yellow-400 hover:text-yellow-500 hover:bg-white/5",
                formButtonPrimary: "bg-yellow-400 text-black hover:bg-yellow-500",
                formFieldLabel: "text-gray-300",
                formFieldInput: "bg-black/40 border-white/10 text-white",
                badge: "bg-white/10 text-white",
                dividerLine: "bg-white/5",
                dangerSection: "border-red-500/20 border-dashed rounded-xl bg-red-500/5",
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
