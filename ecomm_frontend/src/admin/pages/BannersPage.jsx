import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import { getBanners, deleteBanner, createBanner } from "../services/adminBanners";

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    CTA: "",
    image_url: "",
    target_url: "",
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
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

    try {
      await createBanner(formData);
      const data = await getBanners();
      setBanners(data);
      setFormData({
        title: "",
        sub_title: "",
        CTA: "",
        image_url: "",
        target_url: "",
      });
      setShowForm(false);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Failed to create"));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBanner(deleteConfirm);
      const data = await getBanners();
      setBanners(data);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting banner");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Banners</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({
              title: "",
              sub_title: "",
              CTA: "",
              image_url: "",
              target_url: "",
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold transition"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-bold text-lg">Add New Banner</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="sub_title"
                value={formData.sub_title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">CTA Text</label>
              <input
                type="text"
                name="CTA"
                value={formData.CTA}
                onChange={handleChange}
                placeholder="e.g. SHOP NOW"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Target URL
              </label>
              <input
                type="text"
                name="target_url"
                value={formData.target_url}
                onChange={handleChange}
                placeholder="e.g. /store?category=1"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-navy-800"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900 font-semibold transition"
              >
                Create
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.banner_id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-slate-900">{banner.title}</h3>
              <p className="text-sm text-slate-600">{banner.sub_title}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600">
                  {banner.CTA}
                </span>
                <button
                  onClick={() => setDeleteConfirm(banner.banner_id)}
                  className="p-2 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="text-red-600" size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Delete Banner"
        message="Are you sure you want to delete this banner?"
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
