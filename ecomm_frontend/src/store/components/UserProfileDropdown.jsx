import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Lock, ChevronDown, Mail, Calendar } from "lucide-react";

export default function UserProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guestCart");
    setIsOpen(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("logout"));
    navigate("/store");
  };

  const user = userData || JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded-lg transition"
        title="User Profile"
      >
        <User size={20} />
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          {/* User Info Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-t-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-lg text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user?.name || "User"}</p>
                <p className="text-sm text-purple-300">{user?.email || "user@example.com"}</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          {userData && (
            <div className="px-6 py-4 border-b border-slate-200 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-600" />
                <div>
                  <p className="text-slate-600 text-xs">Email</p>
                  <p className="text-slate-900 font-medium">{userData.email}</p>
                </div>
              </div>

              {userData.created_at && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-slate-600" />
                  <div>
                    <p className="text-slate-600 text-xs">Member Since</p>
                    <p className="text-slate-900 font-medium">
                      {new Date(userData.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="p-4 space-y-2">
            <button
              onClick={() => {
                navigate("/store/orders");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              My Orders
            </button>

            <Link
              to="/store/forgot-password"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <Lock size={16} />
              Change Password
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
