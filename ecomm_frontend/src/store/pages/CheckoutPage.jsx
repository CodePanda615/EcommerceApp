import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Truck,
  CreditCard,
  Smartphone,
  Banknote,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";
import StoreHeader from "../components/StoreHeader";
import Footer from "../components/Footer";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) {
          navigate("/store/login");
          return;
        }

        const res = await fetch("http://localhost:8000/api/users/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCart(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  );

  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryCharge + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (
      !formData.full_name ||
      !formData.phone ||
      !formData.street_address ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);

      // For Razorpay, we need to create an order first
      if (paymentMethod === "razorpay") {
        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay. Please try again.");
        }

        // Create order on backend to get Razorpay order ID
        const orderRes = await fetch(
          "http://localhost:8000/api/users/orders/razorpay/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: total,
              currency: "INR",
              shipping_address: formData.street_address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
            }),
          }
        );

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.detail || "Failed to create Razorpay order");
        }

        // Open Razorpay payment dialog
        const options = {
          key: orderData.razorpay_key_id,
          amount: total * 100, // Razorpay takes amount in paise
          currency: "INR",
          name: "ShopNova",
          description: "Order Payment",
          order_id: orderData.order_id,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyRes = await fetch(
                "http://localhost:8000/api/users/orders/razorpay/verify",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                }
              );

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(
                  verifyData.detail || "Payment verification failed"
                );
              }

              setOrderId(verifyData.order_id);
              setSuccess(true);
              localStorage.removeItem("guestCart");

              setTimeout(() => {
                navigate("/store");
              }, 3000);
            } catch (err) {
              setError("Payment verification failed: " + err.message);
              setProcessing(false);
            }
          },
          prefill: {
            name: formData.full_name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#1e40af",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // For other payment methods (COD, Card, UPI)
        const res = await fetch("http://localhost:8000/api/users/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            total_amount: total,
            shipping_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            payment_method: paymentMethod,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Failed to create order");
        }

        setOrderId(data.order_id);
        setSuccess(true);

        // Clear cart after successful order
        localStorage.removeItem("guestCart");

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/store");
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading checkout...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
            <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-slate-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            <div className="bg-gradient-to-r from-navy-50 to-amber-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-slate-600 mb-2">Order ID</p>
              <p className="text-3xl font-bold text-navy-800">{orderId}</p>
              <p className="text-xs text-slate-500 mt-2">
                You will receive an order confirmation email shortly
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/store")}
                className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition"
              >
                Continue Shopping
              </button>
              <Link
                to="/store/orders"
                className="block px-6 py-3 border border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <p className="text-xl text-slate-600 mb-4">Your cart is empty</p>
            <Link
              to="/store"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Back to Store
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <StoreHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/store" className="hover:text-navy-800">
            Home
          </Link>
          <ChevronRight size={16} />
          <Link to="/store/cart" className="hover:text-navy-800">
            Cart
          </Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-semibold">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Shipping Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-800" />
                Shipping Address
              </h2>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-3 text-slate-400"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-3 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="10001"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800 transition"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard size={24} className="text-blue-800" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-800 transition" style={{borderColor: paymentMethod === "cod" ? "#1e40af" : undefined}}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-navy-800"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={20} className="text-teal-600" />
                      <p className="font-semibold text-slate-900">
                        Cash on Delivery
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                {/* Credit/Debit Card */}
                <label className="flex items-center p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-800 transition" style={{borderColor: paymentMethod === "card" ? "#1e40af" : undefined}}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-navy-800"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-teal-600" />
                      <p className="font-semibold text-slate-900">
                        Credit/Debit Card
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                </label>

                {/* UPI */}
                <label className="flex items-center p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-800 transition" style={{borderColor: paymentMethod === "upi" ? "#1e40af" : undefined}}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-navy-800"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <Smartphone size={20} className="text-teal-600" />
                      <p className="font-semibold text-slate-900">UPI</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Google Pay, PhonePe, Paytm
                    </p>
                  </div>
                </label>

                {/* Razorpay */}
                <label className="flex items-center p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-blue-800 transition" style={{borderColor: paymentMethod === "razorpay" ? "#1e40af" : undefined}}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-navy-800"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={20} className="text-teal-600" />
                      <p className="font-semibold text-slate-900">Razorpay</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      Secure payment gateway
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Truck className="text-blue-600 flex-shrink-0" size={20} />
              <div className="text-sm text-blue-900">
                <p className="font-semibold">Free delivery on orders above ₹499</p>
                <p>Expected delivery in 2-3 business days</p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              {processing ? "Processing..." : "Place Order"}
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cart_id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-slate-600">x {item.qty}</p>
                    </div>
                    <p className="font-semibold text-slate-900 whitespace-nowrap ml-2">
                      ₹{(item.product?.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? "text-green-600 font-semibold" : ""}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (18%)</span>
                  <span className="text-slate-900">₹{tax.toLocaleString("en-IN")}</span>
                </div>

                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/store/cart"
                className="block text-center text-navy-800 hover:text-navy-900 font-semibold text-sm py-2 border border-navy-800 rounded-lg hover:bg-navy-50 transition"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
