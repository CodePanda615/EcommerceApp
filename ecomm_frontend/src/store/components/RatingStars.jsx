import { Star } from "lucide-react";

export default function RatingStars({
  rating = 0,
  size = 16,
  interactive = false,
  onRatingChange = null,
  hoverRating = 0,
  onHover = null,
}) {
  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={!interactive}
          onMouseEnter={() => interactive && onHover?.(star)}
          onMouseLeave={() => interactive && onHover?.(0)}
          onClick={() => interactive && onRatingChange?.(star)}
          className={`transition ${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={size}
            className={
              star <= displayRating
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}
