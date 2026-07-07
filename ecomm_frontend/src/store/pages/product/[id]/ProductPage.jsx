import { useParams, Link , useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";
import StoreHeader from "../../../components/StoreHeader";
import Footer from "../../../components/Footer";
import ReviewForm from "../../../components/ReviewForm";
import ReviewList from "../../../components/ReviewList";
import RatingStars from "../../../components/RatingStars";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");
  const user = isLoggedIn ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const userId = user?.id;

  useEffect(() => {
    fetch(`http://localhost:8000/api/users/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        // Check if product is in wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlisted(wishlist.some((item) => item.id === data.id));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    try {
      setAdding(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Add to guest cart in localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const existingItem = guestCart.find((item) => item.product_id === product.id);

        if (existingItem) {
          existingItem.qty += qty;
        } else {
          guestCart.push({
            product_id: product.id,
            qty: qty,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
            },
          });
        }

        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        alert("✅ Added to cart (Guest)");
        return;
      }

      const res = await fetch("http://localhost:8000/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: qty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to add to cart");
      }

      alert("✅ Added to cart");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  const rating = product ? 4 + (product.id % 10) * 0.1 : 0;
  const reviews = product ? Math.floor(100 + (product.id % 900)) : 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading Product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Product not found</p>
          <Link to="/store" className="text-navy-800 font-semibold hover:underline">
            Back to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <StoreHeader />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!isLoggedIn && (
          <div className="bg-white border border-purple-200 rounded-lg p-3 mb-6 flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-600">👤 Browsing as Guest</span>
            <span className="text-slate-300">•</span>
            <Link to="/store/login" className="text-purple-600 hover:text-purple-700 font-medium">
              Login for more benefits
            </Link>
          </div>
        )}
      
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/store" className="hover:text-blue-800">
            Home
          </Link>
          <ChevronRight size={16} />
          <span>Products</span>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm">
            <img
              src={
                product.image_url ||
                "https://placehold.co/600x400?text=Product"
              }
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-start space-y-6">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {product.category_id === 1
                  ? "Electronics"
                  : product.category_id === 2
                  ? "Fashion"
                  : "Product"}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < rating
                          ? "fill-amber-300 text-amber-300"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {rating.toFixed(1)} · {reviews} reviews
                </span>
              </div>

              <div className="space-y-2 pb-6 border-b border-slate-200">
                <div className="text-3xl font-bold text-purple-600">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>
                <p className="text-sm text-slate-600">
                  Inclusive of all taxes
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  In Stock ({product.stock} remaining)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  Out of Stock
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                Free delivery on orders above ₹499 · Ships in 2-3 business days
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 mb-3">Quantity</p>
                <div className="flex items-center gap-4 w-fit">
                  <button
                    className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition font-semibold"
                    onClick={() =>
                      setQty((prev) => Math.max(1, prev - 1))
                    }
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">
                    {qty}
                  </span>
                  <button
                    className="w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition font-semibold"
                    onClick={() =>
                      setQty((prev) =>
                        Math.min(prev + 1, product.stock)
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={addToCart}
                  disabled={adding || product.stock === 0}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                >
                  <ShoppingCart size={20} />
                  {adding ? "Adding..." : "Add To Cart"}
                </button>

                <button
                  onClick={() => {
                    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                    if (wishlisted) {
                      const updated = wishlist.filter((item) => item.id !== product.id);
                      localStorage.setItem("wishlist", JSON.stringify(updated));
                      setWishlisted(false);
                      alert("❌ Removed from wishlist");
                    } else {
                      wishlist.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image_url: product.image_url,
                        category_id: product.category_id,
                      });
                      localStorage.setItem("wishlist", JSON.stringify(wishlist));
                      setWishlisted(true);
                      alert("❤️ Added to wishlist");
                    }
                  }}
                  className="px-6 py-3 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg transition flex items-center gap-2"
                >
                  <Heart
                    size={20}
                    className={
                      wishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600"
                    }
                  />
                </button>
              </div>

              <button
                onClick={async () => {
                  const isLoggedIn = !!localStorage.getItem("token");
                  if (!isLoggedIn) {
                    alert("Please login to buy now");
                    navigate("/store/login");
                    return;
                  }
                  try {
                    // Add to cart
                    const token = localStorage.getItem("token");
                    const res = await fetch("http://localhost:8000/api/users/cart", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        product_id: product.id,
                        quantity: qty,
                      }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                      navigate("/store/checkout");
                    } else {
                      alert(data.detail || "Failed to add to cart");
                    }
                  } catch (err) {
                    alert("Error: " + err.message);
                  }
                }}
                disabled={product.stock === 0}
                className="w-full px-6 py-3 bg-blue-800 hover:bg-blue-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
              >
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200">
              <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <Truck className="text-blue-600" size={24} />
                <p className="text-xs text-center text-slate-600">
                  Free Delivery
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <RotateCcw className="text-blue-600" size={24} />
                <p className="text-xs text-center text-slate-600">
                  Easy Returns
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-slate-200">
                <ShieldCheck className="text-blue-600" size={24} />
                <p className="text-xs text-center text-slate-600">
                  Secure Payment
                </p>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Product Description
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-8 mb-12">
          <ReviewList
            key={refreshReviews}
            productId={product.id}
            userId={userId}
          />

          <ReviewForm
            productId={product.id}
            onReviewAdded={() => setRefreshReviews(refreshReviews + 1)}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
