import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, cancelOrder } from "../services/adminOrders";
import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, Mail, Phone } from "lucide-react";

const STATUS_CONFIG = {
  Pending: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: Clock, label: "Pending" },
  Confirmed: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: CheckCircle, label: "Confirmed" },
  Packed: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: Package, label: "Packed" },
  Shipped: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: Truck, label: "Shipped" },
  Delivered: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: CheckCircle, label: "Delivered" },
  Cancelled: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: XCircle, label: "Cancelled" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      alert("Error updating order status");
    }
  };

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId);
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        alert("Error cancelling order");
      }
    }
  };

  const statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Orders</h2>
          <p className="text-slate-600 mt-1">Manage and track customer orders</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
          <p className="text-sm text-slate-600">Total Orders</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50"
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-2 text-xs font-semibold">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Package className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedOrder === order.order_id;

            return (
              <div
                key={order.order_id}
                className={`${statusConfig.bg} border-2 ${statusConfig.border} rounded-lg overflow-hidden transition`}
              >
                <div
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.order_id)
                  }
                  className="p-4 sm:p-6 cursor-pointer hover:opacity-90 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                    {/* Order ID and Status */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}>
                          <StatusIcon className={statusConfig.text} size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 font-semibold">ORDER ID</p>
                          <p className="text-2xl font-bold text-slate-900">#{order.order_id}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-600 font-semibold">CUSTOMER</p>
                      <p className="text-lg font-semibold text-slate-900">{order.user_name}</p>
                      <div className="space-y-1 mt-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={14} />
                          <span className="truncate">{order.user_email}</span>
                        </div>
                        {order.user_phone && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={14} />
                            <span>{order.user_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount and Date */}
                    <div className="text-right">
                      <p className="text-xs text-slate-600 font-semibold">AMOUNT</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ₹{order.total_amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-slate-600 mt-3">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t-2 border-current border-opacity-20 bg-white/50 p-4 sm:p-6 space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-4">Order Status</h4>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.order_id, e.target.value)
                        }
                        className={`w-full md:w-64 px-4 py-3 rounded-lg font-medium border-2 ${statusConfig.border} ${statusConfig.text} ${statusConfig.bg} cursor-pointer transition hover:opacity-80`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">ORDER DATE</p>
                        <p className="text-slate-900 font-medium">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(order.created_at).toLocaleTimeString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">LAST UPDATED</p>
                        <p className="text-slate-900 font-medium">
                          {new Date(order.updated_at).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(order.updated_at).toLocaleTimeString("en-IN")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-600 mb-2">ORDER TOTAL</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹{order.total_amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {order.status !== "Cancelled" && (
                      <div className="pt-4 border-t">
                        <button
                          onClick={() => handleCancel(order.order_id)}
                          className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
