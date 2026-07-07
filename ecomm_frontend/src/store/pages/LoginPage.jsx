import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginUser, migrateGuestCart } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await loginUser(formData);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("token_type", response.token_type);

      await migrateGuestCart(response.access_token);

      navigate("/store");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-blue-800 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                <span className="font-bold text-white text-xl">S</span>
              </div>
              <span className="font-bold text-2xl">ShopNova</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Sign in to access your personalized shopping experience, track
              orders, and manage your wishlist.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-navy-700">
            <div className="flex gap-4">
              <div className="text-purple-300">✓</div>
              <div>
                <h3 className="font-semibold">Fast Checkout</h3>
                <p className="text-sm text-slate-300">
                  Save your addresses and payment methods
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-purple-300">✓</div>
              <div>
                <h3 className="font-semibold">Order History</h3>
                <p className="text-sm text-slate-300">
                  Track all your orders in one place
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-purple-300">✓</div>
              <div>
                <h3 className="font-semibold">Exclusive Deals</h3>
                <p className="text-sm text-slate-300">
                  Get personalized offers just for you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <span className="font-bold text-navy-900">S</span>
              </div>
              <span className="font-bold text-xl">ShopNova</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Login</h1>
              <p className="text-slate-600 mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-900">
                    Password
                  </label>
                  <Link
                    to="/store/forgot-password"
                    className="text-sm text-blue-800 hover:text-blue-900 font-semibold"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="border-t border-slate-300 pt-6">
              <p className="text-center text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/store/signup"
                  className="text-blue-800 font-semibold hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-300">
              <p className="text-center text-slate-600 text-sm mb-3">
                Want to continue shopping without creating an account?
              </p>
              <Link
                to="/store"
                className="w-full block text-center px-6 py-3 border-2 border-blue-800 text-blue-800 hover:bg-blue-50 rounded-lg font-semibold transition"
              >
                👤 Continue as Guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
