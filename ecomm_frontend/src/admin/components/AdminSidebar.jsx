import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  ImageIcon,
  Ticket,
} from "lucide-react";

const links = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/categories", label: "Categories", icon: FolderOpen },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { path: "/admin/banners", label: "Banners", icon: ImageIcon },
  { path: "/admin/coupons", label: "Coupons", icon: Ticket },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-navy-900 text-white pt-6 z-40">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="font-bold text-navy-900">S</span>
          </div>
          <div>
            <div className="font-bold text-sm">ShopNova</div>
            <div className="text-xs text-slate-400">Admin</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-6 py-3 transition border-l-4
                ${
                  isActive
                    ? "bg-navy-700 border-l-amber-500 text-white"
                    : "border-l-transparent text-slate-300 hover:bg-navy-800"
                }
              `}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
