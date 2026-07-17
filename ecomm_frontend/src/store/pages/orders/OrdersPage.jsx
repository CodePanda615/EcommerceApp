import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import StoreHeader from "../../components/StoreHeader";
import Footer from "../../components/Footer";

const STATUS_ICONS = {
  Pending: <Clock className="text-yellow-600" size={20} />,
  Confirmed: <Package className="text-blue-600" size={20} />,
  Packed: <Package className="text-purple-600" size={20} />,
  Shipped: <Truck className="text-orange-600" size={20} />,
  Delivered: <CheckCircle className="text-green-600" size={20} />,
  Cancelled: <Clock className="text-red-600" size={20} />,
};

const STATUS_COLORS = {
  Pending: "bg-yellow-50 border-yellow-200",
  Confirmed: "bg-blue-50 border-blue-200",
  Packed: "bg-purple-50 border-purple-200",
  Shipped: "bg-orange-50 border-orange-200",
  Delivered: "bg-green-50 border-green-200",
  Cancelled: "bg-red-50 border-red-200",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "http://13.234.30.65:8000/api/users/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <StoreHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/store" className="hover:text-blue-800">
            Home
          </Link>
          <ChevronRight size={16} />
          <span className="text-slate-900 font-semibold">My Orders</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
          <p className="text-slate-600 mt-2">
            Track and manage your orders
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package size={48} className="mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Orders Yet
            </h2>
            <p className="text-slate-600 mb-6">
              You haven't placed any orders. Start shopping now!
            </p>
            <Link
              to="/store"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className={`border rounded-lg p-6 transition hover:shadow-md ${
                  STATUS_COLORS[order.status] ||
                  "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      {STATUS_ICONS[order.status]}
                      <div>
                        <p className="text-sm text-slate-600">Order ID</p>
                        <p className="font-semibold text-slate-900">
                          #{order.order_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Status</p>
                        <p className="font-semibold text-slate-900">
                          {order.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Amount</p>
                        <p className="font-semibold text-slate-900">
                          ₹{order.total_amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Ordered On</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-600">Last Updated</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(
                            order.updated_at
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition font-semibold whitespace-nowrap">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
