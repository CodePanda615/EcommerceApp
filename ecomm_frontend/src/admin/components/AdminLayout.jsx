import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const pageNames = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/orders": "Orders",
  "/admin/banners": "Banners",
  "/admin/coupons": "Coupons",
};

export default function AdminLayout() {
  const location = useLocation();
  const pageTitle = pageNames[location.pathname] || "Admin";

  return (
    <div className="bg-slate-50 min-h-screen">
      <AdminSidebar />
      <AdminTopbar pageTitle={pageTitle} />

      <main className="ml-64 mt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
