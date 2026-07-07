import { useEffect, useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import RatingStars from "./RatingStars";

export default function ReviewList({ productId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/users/reviews/products/${productId}`),
        fetch(`http://localhost:8000/api/users/reviews/products/${productId}/stats`),
      ]);

      const reviewsData = await reviewsRes.json();
      const statsData = await statsRes.json();

      setReviews(reviewsData || []);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/users/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete review");

      // Refresh reviews
      fetchReviews();
      alert("✓ Review deleted");
    } catch (err) {
      alert("Error deleting review: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stats.average_rating}
              </div>
              <div className="mb-2">
                <RatingStars rating={Math.round(stats.average_rating)} size={20} />
              </div>
              <p className="text-sm text-slate-600">
                Based on {stats.total_reviews} review{stats.total_reviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.rating_distribution[star] || 0;
                const percentage =
                  stats.total_reviews > 0
                    ? Math.round((count / stats.total_reviews) * 100)
                    : 0;

                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-12">
                      {star} ⭐
                    </span>
                    <div className="flex-1 h-2 bg-slate-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <AlertCircle className="mx-auto text-slate-400 mb-3" size={32} />
          <p className="text-slate-600">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-900">Customer Reviews</h3>
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2">
                    <RatingStars rating={review.rating} size={18} />
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-slate-900">{review.title}</h4>
                  )}
                  <p className="text-sm text-slate-600">
                    By {review.user?.name || "Anonymous"} •{" "}
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>

                {userId === review.user_id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {review.comment && (
                <p className="text-slate-700 text-sm leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
