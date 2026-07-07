import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselSection({ banners = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  if (!banners.length) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === current
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-105"
              }`}
            >
              <img
                src={banner.image_url}
                alt={banner.title}
                className="h-full w-full object-cover"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white">
                <div className="max-w-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
                    {banner.title}
                  </h1>

                  <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 drop-shadow-md">
                    {banner.sub_title}
                  </p>

                  <a
                    href={banner.target_url || "/store"}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-110 duration-300 shadow-lg"
                  >
                    {banner.CTA || "Shop Now"}
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur-sm opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/10 px-4 py-3 backdrop-blur-md">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === index
                    ? "bg-purple-400 w-8"
                    : "bg-white/40 w-2.5 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}