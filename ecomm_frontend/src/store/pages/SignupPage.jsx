import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { registerUser } from "../services/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(response.message || "Account created successfully!");
      setTimeout(() => {
        navigate("/store/login");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || "Registration failed. Please try again.";
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
            <h2 className="text-3xl font-bold">Join ShopNova Today</h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              Create an account to discover millions of products, track your
              orders, and enjoy exclusive benefits.
            </p>
          </div>

          <div className="space-y-6 pt-8 border-t border-navy-700">
            <div className="flex gap-4">
              <div className="text-purple-300 text-xl">🛍️</div>
              <div>
                <h3 className="font-semibold">Browse & Shop</h3>
                <p className="text-sm text-slate-300">
                  Explore thousands of products
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-amber-400 text-xl">🎁</div>
              <div>
                <h3 className="font-semibold">Exclusive Offers</h3>
                <p className="text-sm text-slate-300">
                  Get special deals for members
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-amber-400 text-xl">⚡</div>
              <div>
                <h3 className="font-semibold">Fast Delivery</h3>
                <p className="text-sm text-slate-300">
                  Quick and reliable shipping
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
              <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
              <p className="text-slate-600 mt-2">
                Join us and start shopping today
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle
                  className="text-red-600 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-blue-800 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>
              </div>

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
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Password
                </label>
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
                <p className="text-xs text-slate-600 mt-1">
                  At least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="border-t border-slate-300 pt-6">
              <p className="text-center text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/store/login"
                  className="text-blue-800 font-semibold hover:underline"
                >
                  Login here
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
