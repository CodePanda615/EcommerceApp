import { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import RatingStars from "./RatingStars";

export default function ReviewForm({ productId, onReviewAdded, isLoggedIn }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      setError("Please login to add a review");
      return;
    }

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/users/reviews/products/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            title: title || null,
            comment: comment || null,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to add review");
      }

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");

      // Refresh reviews
      if (onReviewAdded) {
        onReviewAdded();
      }

      alert("✓ Review added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-slate-600">
          Please <a href="/store/login" className="text-blue-600 font-semibold hover:underline">login</a> to add a review
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <h3 className="font-bold text-lg text-slate-900">Write a Review</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Rating</label>
          <RatingStars
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            hoverRating={hoverRating}
            onHover={setHoverRating}
            size={24}
          />
          {rating > 0 && (
            <p className="text-sm text-slate-600 mt-2">{rating} out of 5 stars</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Title (Optional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Great product!"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-800"
            rows="4"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
        >
          <Send size={18} />
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
