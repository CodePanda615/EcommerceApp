import { useEffect, useState } from "react";
import {
  Users,
  Package,
  FolderOpen,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { getDashboard } from "../services/adminDashboard";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  if (!dashboard) {
    return <div className="text-center py-12 text-slate-600">Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={dashboard.total_users}
          color="navy"
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={dashboard.total_products}
          color="navy"
        />
        <StatCard
          icon={FolderOpen}
          label="Total Categories"
          value={dashboard.total_categories}
          color="navy"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${dashboard.total_revenue.toLocaleString("en-IN")}`}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={dashboard.total_orders}
          color="navy"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={dashboard.pending_orders}
          color="amber"
        />
        <StatCard
          icon={CheckCircle}
          label="Delivered Orders"
          value={dashboard.delivered_orders}
          color="green"
        />
        <StatCard
          icon={XCircle}
          label="Cancelled Orders"
          value={dashboard.cancelled_orders}
          color="red"
        />
      </div>
    </div>
  );
}
