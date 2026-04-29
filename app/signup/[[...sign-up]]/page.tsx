import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const { userId } = await auth();

  // หากล็อกอินอยู่แล้ว ให้เด้งไปหน้าแรกทันที
  if (userId) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen w-full bg-black flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] -z-10" />

      <div className="animate-in fade-in zoom-in duration-500">
        <SignUp fallbackRedirectUrl="/" forceRedirectUrl="/" signInUrl="/login" />
      </div>
    </div>
  );
}
