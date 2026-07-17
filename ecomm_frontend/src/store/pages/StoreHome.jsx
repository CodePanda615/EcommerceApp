import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import StoreHeader from "../components/StoreHeader";
import CategoriesBar from "../components/CategoriesBar";
import CarouselSection from "../components/CarouselSection";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { ChevronRight, TrendingUp, Search as SearchIcon } from "lucide-react";

export default function StoreHome() {
  const [searchParams] = useSearchParams();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser).user || JSON.parse(storedUser));
    }
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bannersRes, categoriesRes, productsRes] = await Promise.all([
          fetch("http://localhost:8000/api/user/banner"),
          fetch("http://localhost:8000/api/users/categories"),
          fetch("http://localhost:8000/api/users/products"),
        ]);

        const bannersData = await bannersRes.json();
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        setBanners(bannersData || []);
        setCategories(categoriesData || []);
        setAllProducts(productsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = allProducts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category_id === parseInt(categoryFilter));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, categoryFilter, allProducts]);

  const getProductsByCategory = (categoryId) => {
    return allProducts.filter((p) => p.category_id === categoryId).slice(0, 6);
  };

  const isSearching = searchQuery.trim() || categoryFilter;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StoreHeader categories={categories} />
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StoreHeader categories={categories} />

    

      {!isSearching && (
        <CategoriesBar />
      )}

      {user && !isSearching && (
        <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <p className="text-purple-300 text-sm font-semibold">Welcome back</p>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              👋 Hello, {user.name || "Shopper"}!
            </h2>
          </div>
        </div>
      )}

      {/* Search Results Section */}
      {isSearching && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
              <SearchIcon className="text-purple-600" size={28} />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Search Results</h2>
                {searchQuery && (
                  <p className="text-slate-600 text-sm">
                    Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} for "<strong>{searchQuery}</strong>"
                  </p>
                )}
                {categoryFilter && (
                  <p className="text-slate-600 text-sm">
                    Showing results in category: <strong>{categories.find(c => c.id === parseInt(categoryFilter))?.name}</strong>
                  </p>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-600 text-lg mb-4">No products found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search terms or browse by category</p>
                <a href="/store" className="inline-block mt-6 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 font-semibold transition">
                  Clear Search
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!isSearching && banners.length > 0 && (
        <div>
          <CarouselSection banners={banners} />
        </div>
      )}

      {/* Trending Deals Section */}
      {!isSearching && (
        <div className="bg-white py-12 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="text-purple-600" size={28} />
              <h3 className="text-2xl font-bold text-slate-900">Today's Deals</h3>
            </div>
            {allProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Wise Sections */}
      {!isSearching && categories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={category.id} className="bg-white py-12 border-b">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-slate-600 text-sm mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                <a
                  href={`/store?category=${category.id}`}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition"
                >
                  View All
                  <ChevronRight size={20} />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Featured Section */}
      {!isSearching && allProducts.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 py-12 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-900">
                Shop by Collections
              </h3>
              <p className="text-slate-600 mt-2">
                Curated collections just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Best Sellers",
                  desc: "Most loved products",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "New Arrivals",
                  desc: "Fresh products",
                  color: "from-green-500 to-green-600",
                },
                {
                  title: "Special Offers",
                  desc: "Limited time deals",
                  color: "from-red-500 to-red-600",
                },
              ].map((collection, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${collection.color} rounded-lg p-8 text-white cursor-pointer hover:shadow-lg transition transform hover:scale-105`}
                >
                  <h4 className="text-xl font-bold mb-2">{collection.title}</h4>
                  <p className="text-white/80 text-sm">{collection.desc}</p>
                  <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition">
                    Explore →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
