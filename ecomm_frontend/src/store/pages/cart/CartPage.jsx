import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
import StoreHeader from "../../components/StoreHeader";
import Footer from "../../components/Footer";
import GuestCheckoutForm from "../../components/GuestCheckoutForm";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [checkoutMode, setCheckoutMode] = useState("cart"); // "cart", "checkout", "success"
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      if (token) {
        // Fetch logged-in user's cart
        const res = await fetch("http://localhost:8000/api/users/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCart(data);
      } else {
        // Load guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCart(guestCart);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (!token && checkoutMode === "checkout") {
        setCheckoutMode("cart");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkoutMode]);

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  useEffect(() => {
    const migrateGuestCart = async () => {
      if (!isLoggedIn || !token) return;

      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      if (guestCart.length === 0) return;

      try {
        for (const item of guestCart) {
          await fetch("http://localhost:8000/api/users/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              product_id: item.product_id,
              quantity: item.qty,
            }),
          });
        }
        localStorage.removeItem("guestCart");
        fetchCart();
      } catch (err) {
        console.error("Error migrating guest cart:", err);
      }
    };

    migrateGuestCart();
  }, [isLoggedIn, token]);

  const removeFromCart = async (cartId, isGuest = false) => {
    try {
      setUpdatingCart(true);

      if (isGuest || !token) {
        // Remove from guest cart
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updated = guestCart.filter((item) => item.product_id !== cartId);
        localStorage.setItem("guestCart", JSON.stringify(updated));
        setCart(updated);
      } else {
        // Remove from API cart
        const res = await fetch(
          `http://localhost:8000/api/users/cart/${cartId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          setCart((prev) =>
            prev.filter((item) => item.cart_id !== cartId)
          );
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error removing item from cart");
    } finally {
      setUpdatingCart(false);
    }
  };

  const updateQuantity = async (cartId, newQty, isGuest = false) => {
    if (newQty < 1) {
      removeFromCart(cartId, isGuest);
      return;
    }

    try {
      setUpdatingCart(true);

      if (isGuest || !token) {
        // Update guest cart
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updated = guestCart.map((item) =>
          item.product_id === cartId ? { ...item, qty: newQty } : item
        );
        localStorage.setItem("guestCart", JSON.stringify(updated));
        setCart(updated);
      } else {
        // Update API cart
        const res = await fetch(
          `http://localhost:8000/api/users/cart/${cartId}?quantity=${newQty}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          setCart((prev) =>
            prev.map((item) =>
              item.cart_id === cartId
                ? { ...item, qty: newQty }
                : item
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error updating quantity");
    } finally {
      setUpdatingCart(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  );

  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryCharge + tax;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setCheckoutMode("checkout");
    } else {
      // Navigate to checkout page for logged-in users
      navigate("/store/checkout");
    }
  };

  const handleGuestCheckoutSuccess = (orderId) => {
    setOrderSuccess(orderId);
    setCheckoutMode("success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading cart...</div>
      </div>
    );
  }

  // Success screen after guest checkout
  if (checkoutMode === "success" && orderSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Order Confirmed!</h1>
            <p className="text-slate-600 mb-4">
              Thank you for your order. A confirmation email has been sent to your email address.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">Order ID</p>
              <p className="text-2xl font-bold text-navy-800">{orderSuccess}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/store")}
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition"
              >
                Continue Shopping
              </button>
              <Link
                to="/store"
                className="block text-navy-800 hover:underline text-sm font-semibold"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Guest checkout form
  if (checkoutMode === "checkout") {
    const cartItemsForCheckout = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.qty,
      price: item.product?.price || 0,
    }));

    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <StoreHeader />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <button
            onClick={() => setCheckoutMode("cart")}
            className="flex items-center gap-2 text-blue-800 hover:text-blue-900 mb-6 font-semibold"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Guest Checkout Form */}
            <div className="lg:col-span-2">
              <GuestCheckoutForm
                cartItems={cartItemsForCheckout}
                totalAmount={total}
                onSuccess={handleGuestCheckoutSuccess}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.cart_id} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {item.product?.name} x {item.qty}
                      </span>
                      <span className="font-semibold text-slate-900">
                        ₹{(item.product?.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-3">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className={deliveryCharge === 0 ? "text-green-600" : "text-slate-600"}>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      {deliveryCharge === 0 ? (
                        <span className="font-semibold">FREE</span>
                      ) : (
                        <span>₹{deliveryCharge}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-purple-600">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Regular cart view
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <StoreHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
  {!isLoggedIn && (
        <div className="bg-purple-200 border-b border-purple-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="text-sm text-zinc-800">👤 Browsing as Guest</span>
            <span className="text-slate-300">•</span>
            <Link to="/store/login" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Login for more benefits
            </Link>
          </div>
        </div>
      )}

        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/store" className="hover:text-blue-800">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-semibold">Shopping Cart</span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Add some items to your cart to get started.
            </p>
            <Link
              to="/store"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Shopping Cart ({cart.length} items)
                </h2>
              </div>

              {cart.map((item) => {
                const isGuest = !item.cart_id;
                const itemId = item.cart_id || item.product_id;
                return (
                  <div
                    key={itemId}
                    className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition flex gap-4"
                  >
                    <img
                      src={
                        item.product?.image_url ||
                        "https://placehold.co/100x100"
                      }
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/store/product/${item.product_id}`}
                        className="font-semibold text-slate-900 hover:text-teal-600 transition truncate block"
                      >
                        {item.product?.name}
                      </Link>

                      <p className="text-purple-600 font-bold text-lg mt-2">
                        ₹{item.product?.price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              itemId,
                              item.qty - 1,
                              isGuest
                            )
                          }
                          disabled={updatingCart}
                          className="p-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="px-3 font-semibold min-w-[2rem] text-center">
                          {item.qty}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              itemId,
                              item.qty + 1,
                              isGuest
                            )
                          }
                          disabled={updatingCart}
                          className="p-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-600 text-sm mb-3">
                        Subtotal
                      </p>
                      <p className="font-bold text-slate-900 mb-6">
                        ₹
                        {(
                          item.product?.price * item.qty
                        ).toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => removeFromCart(itemId, isGuest)}
                        disabled={updatingCart}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div
                    className={`flex justify-between ${
                      deliveryCharge === 0
                        ? "text-green-600"
                        : "text-slate-600"
                    }`}
                  >
                    <span>Delivery</span>
                    {deliveryCharge === 0 ? (
                      <span className="font-semibold">FREE</span>
                    ) : (
                      <span>₹{deliveryCharge}</span>
                    )}
                  </div>

                  <div className="flex justify-between text-slate-600 text-sm">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-purple-600">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                {subtotal < 499 && (
                  <p className="text-xs text-slate-600 bg-blue-50 p-3 rounded">
                    Add ₹{(499 - subtotal).toLocaleString("en-IN")} more for free delivery
                  </p>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 text-sm"
                  />
                  <button className="w-full px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 text-sm font-semibold transition">
                    Apply
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    {isLoggedIn ? "Proceed to Checkout" : "🛍️ Checkout as Guest"}
                  </button>
                  {!isLoggedIn && (
                    <Link
                      to="/store/login"
                      className="block text-center px-4 py-3 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
                    >
                      ✨ Login for Faster Checkout
                    </Link>
                  )}
                </div>

                <Link
                  to="/store"
                  className="block text-center text-navy-800 hover:underline text-sm font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
