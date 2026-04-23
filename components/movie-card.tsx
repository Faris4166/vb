import Link from "next/link";
import { Play } from "lucide-react";

interface MovieCardProps {
  id: string | number;
  title: string;
  image: string;
  rating?: string;
  year?: string;
}

export default function MovieCard({ id, title, image, rating, year }: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} className="group relative block w-full">
      {/* 1. Image Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/5 bg-gray-900 shadow-lg transition-all duration-300 group-hover:z-30 group-hover:scale-105 group-hover:border-yellow-400/50 group-hover:shadow-yellow-400/20">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* 2. Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-black shadow-xl">
            <Play className="h-6 w-6 fill-black" />
          </div>
        </div>

        {/* 3. Top Info Badge (Optional) */}
        {rating && (
          <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-yellow-400 backdrop-blur-md border border-white/10">
            {rating}
          </div>
        )}
      </div>

      {/* 4. Movie Info */}
      <div className="mt-3 space-y-1 px-1">
        <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-yellow-400">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {year && <span>{year}</span>}
          {year && <span className="h-1 w-1 rounded-full bg-gray-600" />}
          <span className="uppercase">Premium</span>
        </div>
      </div>
    </Link>
  );
}
