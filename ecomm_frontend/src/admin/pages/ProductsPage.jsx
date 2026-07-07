import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import {
  getProducts,
  deleteProduct,
  updateProductStatus,
  updateProductStock,
  createProduct,
  updateProduct,
} from "../services/adminProducts";
import { getCategories } from "../services/adminCategories";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image_url: formData.image_url,
      category_id: parseInt(formData.category_id),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        const data = await getProducts();
        setProducts(data);
        setEditingId(null);
      } else {
        await createProduct(payload);
        const data = await getProducts();
        setProducts(data);
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
        category_id: "",
      });
      setShowForm(false);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Failed to save product"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteConfirm);
      const data = await getProducts();
      setProducts(data);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting product");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await updateProductStatus(id, !currentStatus);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || "",
      category_id: product.category_id.toString(),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Products</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (!showForm) {
              setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                image_url: "",
                category_id: "",
              });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-bold text-lg">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                rows="3"
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                Category
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
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {product.category_id}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleToggleStatus(product.id, product.is_active)
                    }
                    className="transition"
                  >
                    {product.is_active ? (
                      <ToggleRight className="text-teal-600" size={24} />
                    ) : (
                      <ToggleLeft className="text-slate-400" size={24} />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 hover:bg-blue-50 rounded transition inline-block"
                  >
                    <Edit2 className="text-blue-600" size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
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
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
