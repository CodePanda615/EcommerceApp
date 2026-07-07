import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCoupons,
  deleteCoupon,
  createCoupon,
  updateCoupon,
  updateCouponStatus,
} from "../services/adminCoupons";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discount_percentage: "",
    min_order_amount: "",
    max_discount_amount: "",
    expiry_date: "",
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons();
        setCoupons(data);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      code: formData.code.toUpperCase(),
      discount_percentage: parseFloat(formData.discount_percentage),
      min_order_amount: parseFloat(formData.min_order_amount),
      max_discount_amount: formData.max_discount_amount
        ? parseFloat(formData.max_discount_amount)
        : null,
      expiry_date: formData.expiry_date,
    };

    try {
      if (editingId) {
        await updateCoupon(editingId, payload);
        setEditingId(null);
      } else {
        await createCoupon(payload);
      }
      const data = await getCoupons();
      setCoupons(data);
      setFormData({
        code: "",
        discount_percentage: "",
        min_order_amount: "",
        max_discount_amount: "",
        expiry_date: "",
      });
      setShowForm(false);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Failed to save"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCoupon(deleteConfirm);
      const data = await getCoupons();
      setCoupons(data);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting coupon");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateCouponStatus(id, !currentStatus);
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discount_percentage: coupon.discount_percentage.toString(),
      min_order_amount: coupon.min_order_amount.toString(),
      max_discount_amount: coupon.max_discount_amount?.toString() || "",
      expiry_date: coupon.expiry_date.split("T")[0],
    });
    setEditingId(coupon.coupon_id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Coupons</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              code: "",
              discount_percentage: "",
              min_order_amount: "",
              max_discount_amount: "",
              expiry_date: "",
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold transition"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-bold text-lg">
            {editingId ? "Edit Coupon" : "Add New Coupon"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Discount %
              </label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Min Order Amount
              </label>
              <input
                type="number"
                name="min_order_amount"
                value={formData.min_order_amount}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Max Discount Amount
              </label>
              <input
                type="number"
                name="max_discount_amount"
                value={formData.max_discount_amount}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900 font-semibold transition"
              >
                {editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Code
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Min Order
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Max Discount
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Status
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.coupon_id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {coupon.discount_percentage}%
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ₹{coupon.min_order_amount}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {coupon.max_discount_amount
                    ? `₹${coupon.max_discount_amount}`
                    : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(coupon.expiry_date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(coupon.coupon_id, coupon.is_active)
                    }
                    className="transition"
                  >
                    {coupon.is_active ? (
                      <ToggleRight className="text-teal-600" size={24} />
                    ) : (
                      <ToggleLeft className="text-slate-400" size={24} />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="p-2 hover:bg-blue-50 rounded transition inline-block"
                  >
                    <Edit2 className="text-blue-600" size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(coupon.coupon_id)}
                    className="p-2 hover:bg-red-50 rounded transition inline-block"
                  >
                    <Trash2 className="text-red-600" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon?"
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
