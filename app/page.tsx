import CarouselHero from "@/components/carousel-hero";
import Navbar from "@/components/navbar";
import MovieCard from "@/components/movie-card";

const TRENDING_MOVIES = [
  { id: 1, title: "Oppenheimer", image: "/Oppenheimer.jpg", rating: "9.2", year: "2023" },
  { id: 2, title: "The Batman", image: "/batman.webp", rating: "8.5", year: "2022" },
  { id: 3, title: "Arcane", image: "/arcane-bg.jpg", rating: "9.0", year: "2021" },
];


export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-black pb-20">
      <Navbar />
      <CarouselHero />
      
      {/* Trending Movies Section */}
      <section className="relative z-10 -mt-20 px-8 md:px-16 lg:px-24">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            หนังที่กำลัง <span className="text-yellow-400">นิยม</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {TRENDING_MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              rating={movie.rating}
              year={movie.year}
            />
          ))}
        </div>
      </section>
    </main>
  );
}


