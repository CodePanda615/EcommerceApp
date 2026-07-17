import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const rating = 4 + (product.id % 10) * 0.1;
  const reviews = Math.floor(100 + (product.id % 900));

  const addToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAdding(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Add to guest cart in localStorage
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
        alert("✅ Added to cart (Guest)");
        return;
      }

      const res = await fetch("http://13.234.30.65:8000/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
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

  return (
    <Link to={`/store/product/${product.id}`}>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden bg-slate-100 h-48">
          <img
            src={
              product.image_url ||
              "https://placehold.co/600x400?text=Product"
            }
            alt={product.name}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-slate-100 transition"
          >
            <Heart
              size={20}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-slate-600"}
            />
          </button>

          <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {product.category_id === 1
              ? "Apparel"
              : product.category_id === 2
              ? "Beauty"
              : product.category_id === 3 ? 
              "Electronics" :
              "Footwear"}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-base text-slate-900 line-clamp-2 hover:text-teal-600">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
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
            <span className="text-xs text-slate-600 ml-2">
              {rating.toFixed(1)} ({reviews} reviews)
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-auto">
            <div className="text-xl font-bold text-purple-600 mb-3">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            {product.stock > 0 && (
              <p className="text-xs text-green-600 font-semibold mb-3">
                {product.stock} in stock
              </p>
            )}

            <button
              onClick={addToCart}
              disabled={adding || product.stock === 0}
              className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <ShoppingCart size={16} />
              {adding ? "Adding..." : "Add To Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
