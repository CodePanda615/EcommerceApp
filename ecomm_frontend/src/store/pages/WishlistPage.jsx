import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Heart, ShoppingBag, ChevronRight, ArrowLeft } from "lucide-react";
import StoreHeader from "../components/StoreHeader";
import Footer from "../components/Footer";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
    setLoading(false);
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter((item) => item.id !== productId);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Add to guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existingItem = guestCart.find((item) => item.product_id === product.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        guestCart.push({
          product_id: product.id,
          qty: 1,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
          },
        });
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert("✅ Added to cart");
      return;
    }

    // Add to logged-in user's cart
    fetch("http://localhost:8000/api/users/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.detail) {
          throw new Error(data.detail);
        }
        alert("✅ Added to cart");
      })
      .catch((err) => alert(err.message));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <StoreHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/store" className="hover:text-blue-800">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Heart size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Add products to your wishlist to save them for later.
            </p>
            <Link
              to="/store"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                My Wishlist ({wishlist.length} items)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition"
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image_url || "https://placehold.co/300x300"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                      title="Remove from wishlist"
                    >
                      <Heart size={20} className="fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link
                      to={`/store/product/${product.id}`}
                      className="font-semibold text-slate-900 hover:text-teal-600 transition line-clamp-2"
                    >
                      {product.name}
                    </Link>

                    <p className="text-slate-600 text-sm mt-2">
                      {product.category_id === 1
                        ? "Electronics"
                        : product.category_id === 2
                        ? "Fashion"
                        : "Product"}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-purple-600 font-bold text-lg mb-3">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>

                      <div className="space-y-2">
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </button>

                        <Link
                          to={`/store/product/${product.id}`}
                          className="block text-center px-4 py-2 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
