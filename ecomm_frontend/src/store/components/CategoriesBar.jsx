import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CATEGORY_STYLES = {
  "Electronics": {
    gradient: "from-blue-600 to-blue-800",
    accent: "from-blue-500 to-cyan-400",
    span: 2,
    emoji: "📱"
  },
  "Fashion": {
    gradient: "from-purple-600 to-pink-600",
    accent: "from-purple-400 to-pink-400",
    span: 2,
    emoji: "👗"
  },
  "Home": {
    gradient: "from-orange-500 to-red-600",
    accent: "from-orange-400 to-yellow-400",
    span: 1,
    emoji: "🏠"
  },
  "Beauty": {
    gradient: "from-pink-500 to-rose-600",
    accent: "from-pink-300 to-purple-300",
    span: 1,
    emoji: "✨"
  },
  "Sports": {
    gradient: "from-green-600 to-emerald-700",
    accent: "from-green-400 to-teal-400",
    span: 1,
    emoji: "⚡"
  },
  "Appliances": {
    gradient: "from-slate-700 to-slate-900",
    accent: "from-slate-500 to-blue-500",
    span: 1,
    emoji: "🔌"
  },
  "Groceries": {
    gradient: "from-green-500 to-lime-600",
    accent: "from-green-300 to-lime-300",
    span: 1,
    emoji: "🛒"
  },
  "Furniture": {
    gradient: "from-amber-600 to-orange-700",
    accent: "from-amber-400 to-orange-300",
    span: 1,
    emoji: "🛋️"
  }
};

export default function CategoriesBar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const getCategoryStyle = (categoryName) => {
    return CATEGORY_STYLES[categoryName] || {
      gradient: "from-blue-600 to-blue-800",
      accent: "from-blue-400 to-cyan-400",
      span: 1,
      emoji: "🛍️"
    };
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Explore Collections
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
          <p className="text-slate-600 mt-4 text-lg">Discover our curated collections handpicked just for you</p>
        </div>

        {/* Categories Grid - Creative Masonry Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6 auto-rows-max">
          {categories.map((category, index) => {
            const style = getCategoryStyle(category.name);

            return (
              <Link
                key={category.id}
                to={`/store?category=${category.id}`}
                className={`
                  group relative overflow-hidden rounded-2xl cursor-pointer
                  transition-all duration-500 transform hover:scale-105
                  h-36 md:h-40 shadow-lg hover:shadow-2xl
                `}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} transition-transform duration-500 group-hover:scale-110`}></div>

                {/* Animated Accent */}
                <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br ${style.accent} opacity-20 rounded-full transition-all duration-500 group-hover:scale-110`}></div>
                <div className={`absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr ${style.accent} opacity-10 rounded-full transition-all duration-500 group-hover:scale-125`}></div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4 md:p-5 text-white">
                  {/* Emoji */}
                  <div className="text-4xl md:text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {style.emoji}
                  </div>

                  {/* Text Content */}
                  <div>
                    {/* Category Name - Large Bold Text */}
                    <h3 className="text-2xl md:text-3xl font-black mb-1 leading-tight group-hover:translate-y-1 transition-transform duration-300">
                      {category.name}
                    </h3>

                    {/* Description */}
                    {category.description && (
                      <p className="text-white text-xs md:text-sm opacity-90 mb-2 line-clamp-1">
                        {category.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="inline-flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-sm">
                      <span className="text-xs font-semibold">Explore</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}