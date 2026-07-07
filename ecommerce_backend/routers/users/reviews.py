from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from utils.connection import get_db
from models.reviews import Review
from models.products import Product
from models.users import User
from schemas.review_schema import ReviewCreate, ReviewUpdate, ReviewResponse, ReviewWithUser, ProductRatingStats
from guards.user.auth import UserGuard

router = APIRouter(
    prefix="/api/users/reviews",
    tags=["User Reviews"]
)


@router.post(
    "/products/{product_id}",
    response_model=ReviewResponse,
    dependencies=[Depends(UserGuard.authorize)]
)
def create_review(
    product_id: int,
    payload: ReviewCreate,
    credentials: dict = Depends(UserGuard.authorize),
    db: Session = Depends(get_db)
):
    user_id = credentials["user_id"]

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        (Review.product_id == product_id) & (Review.user_id == user_id)
    ).first()

    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this product"
        )

    review = Review(
        product_id=product_id,
        user_id=user_id,
        rating=payload.rating,
        title=payload.title,
        comment=payload.comment
    )

    db.add(review)
    db.commit()
    db.refresh(review)

    return review


@router.get("/products/{product_id}")
def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(
        Review.created_at.desc()
    ).all()

    # Manually construct response with user info
    reviews_with_user = []
    for review in reviews:
        user = db.query(User).filter(User.id == review.user_id).first()
        review_dict = {
            "id": review.id,
            "product_id": review.product_id,
            "user_id": review.user_id,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "created_at": review.created_at,
            "updated_at": review.updated_at,
            "user": {"id": user.id, "name": user.name} if user else None
        }
        reviews_with_user.append(review_dict)

    return reviews_with_user


@router.get("/products/{product_id}/stats")
def get_product_rating_stats(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews = db.query(Review).filter(Review.product_id == product_id).all()

    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "rating_distribution": {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        }

    # Calculate stats
    total_rating = sum(r.rating for r in reviews)
    average_rating = total_rating / len(reviews)

    rating_dist = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for review in reviews:
        rating_dist[review.rating] += 1

    return {
        "average_rating": round(average_rating, 1),
        "total_reviews": len(reviews),
        "rating_distribution": rating_dist
    }


@router.put(
    "/{review_id}",
    response_model=ReviewResponse,
    dependencies=[Depends(UserGuard.authorize)]
)
def update_review(
    review_id: int,
    payload: ReviewUpdate,
    credentials: dict = Depends(UserGuard.authorize),
    db: Session = Depends(get_db)
):
    user_id = credentials["user_id"]

    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(review, key, value)

    db.commit()
    db.refresh(review)

    return review


@router.delete("/{review_id}", dependencies=[Depends(UserGuard.authorize)])
def delete_review(
    review_id: int,
    credentials: dict = Depends(UserGuard.authorize),
    db: Session = Depends(get_db)
):
    user_id = credentials["user_id"]

    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")

    db.delete(review)
    db.commit()

    return {"message": "Review deleted successfully"}
