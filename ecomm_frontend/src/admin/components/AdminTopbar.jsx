import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function AdminTopbar({ pageTitle }) {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin_user")
    ? JSON.parse(localStorage.getItem("admin_user"))
    : null;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-6 z-30">
      <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <User size={18} className="text-slate-600" />
          <span className="font-medium text-slate-900">
            {admin?.name || "Admin"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-slate-100 rounded-lg transition"
          title="Logout"
        >
          <LogOut size={20} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
