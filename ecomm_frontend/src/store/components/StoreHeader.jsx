import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function StoreHeader({ categories = [] }) {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistCount(wishlist.length);

    // Listen for logout event from other components
    const handleLogout = () => {
      setIsLogged(false);
      setUser(null);
      setCartCount(0);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (isLogged) {
      // Fetch logged-in user's cart
      fetch("http://localhost:8000/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCartCount(data.length || 0))
        .catch((err) => console.error(err));
    } else {
      // Get guest cart from localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartCount(guestCart.length);
    }
  }, [isLogged]);

  useEffect(() => {
    const handleStorageChange = () => {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartCount(guestCart.length);

      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-blue-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-20 flex items-center gap-6">
          <Link to="/store" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="font-bold text-white">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">ShopNova</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 hidden sm:flex">
            <div className="w-full flex items-center bg-white text-blue-900 rounded-full px-4">
              <Search size={18} className="text-blue-600" />
              <input
                className="bg-transparent outline-none ml-3 w-full py-2"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="ml-2 px-4 py-1 bg-purple-600 text-white rounded-full font-semibold text-sm hover:bg-purple-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/store/cart" className="relative p-2">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/store/wishlist" className="relative p-2">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {!isLogged && (
              <Link
                to="/store/login"
                className="px-4 py-2 border border-purple-300 rounded-full hover:bg-blue-700 transition text-sm"
              >
                Login
              </Link>
            )}

            {isLogged && <UserProfileDropdown />}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              className="flex-1 bg-white text-blue-900 rounded-full px-4 py-2 text-sm outline-none"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold text-sm"
            >
              Go
            </button>
          </form>

          {!isLogged && (
            <Link
              to="/store/signup"
              className="block text-center px-4 py-2 bg-purple-600 text-white rounded-full font-semibold"
            >
              Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
