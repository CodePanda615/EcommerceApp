from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.products import Product
from schemas.product_schema import ProductResponse

from utils.helper import token
from guards.user.auth import UserGuard

router = APIRouter(
    prefix="/api/users/products",
    tags=["User Products"]
)


@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db),
    search: str = Query(None),
    category_id: int = Query(None),
    min_price: float = Query(None),
    max_price: float = Query(None),
    sort: str = Query(None)
):
    query = db.query(Product).filter(Product.is_active == True)

    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())

    return query.all()

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id, Product.is_active == True)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product
