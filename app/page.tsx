import CarouselHero from "@/components/carousel-hero";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <CarouselHero />
      {/* สามารถเพิ่ม Content อื่นๆ ต่อท้ายได้ที่นี่ */}
    </main>
  );
}

