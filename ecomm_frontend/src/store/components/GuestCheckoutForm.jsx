import { useState } from "react";
import { AlertCircle, CheckCircle, Mail, User, Phone, MapPin } from "lucide-react";

export default function GuestCheckoutForm({ cartItems, totalAmount, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
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

    // Validate required fields
    if (
      !formData.email ||
      !formData.full_name ||
      !formData.phone ||
      !formData.street_address ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://13.234.30.65:8000/api/guest-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          phone: formData.phone,
          street_address: formData.street_address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          cart_items: cartItems,
          total_amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Checkout failed");
      }

      setSuccess(data.message);

      // Call onSuccess callback after a delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data.order_id);
        }
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Guest Checkout</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800"
                required
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800"
                required
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Street Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B"
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* City */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="New York"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              required
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="NY"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              required
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-sm font-semibold mb-1">Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              placeholder="10001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              required
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mt-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Items ({cartItems.length})</span>
              <span className="font-medium">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-300">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="font-bold text-purple-600">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          {loading ? "Processing..." : "Complete Purchase"}
        </button>

        <p className="text-xs text-slate-500 text-center">
          ✓ Secure checkout • Your email is only used for order confirmation
        </p>
      </form>
    </div>
  );
}
