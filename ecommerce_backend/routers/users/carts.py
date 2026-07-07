from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException

security = HTTPBearer()

from utils.connection import get_db
from models.cart import Cart
from schemas.cart_schema import CartSchema
from models.products import Product

from utils.helper import token
from guards.user.auth import UserGuard

router = APIRouter(
    prefix="/api/users/cart",
    tags=["User Cart"],
    dependencies=[Depends(UserGuard.authorize)]
)

@router.post("")
def add_to_cart(
    request: CartSchema,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    existing_item = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == request.product_id
    ).first()

    if existing_item:
        existing_item.quantity += request.quantity
        db.commit()
        return {"message": "Cart updated"}

    cart = Cart(
        user_id=user_id,
        product_id=request.product_id,
        quantity=request.quantity
    )

    db.add(cart)
    db.commit()

    return {"message": "Added To Cart"}

@router.get(
    "",
    tags=["Cart"],
    summary="Get User Cart",
    description="Fetch all cart items."
)
def get_cart(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    cart_items = db.query(Cart).filter_by(user_id=user_id).all()

    product_ids = [item.product_id for item in cart_items]

    products = db.query(Product).filter(Product.id.in_(product_ids)).all()

    product_map = {p.id: p for p in products}

    result = []

    for item in cart_items:
        result.append({
            "cart_id": item.cart_id,
            "product_id": item.product_id,
            "qty": item.quantity,
            "product": product_map.get(item.product_id)
        })

    return result

@router.delete("/{cart_id}")
def remove_from_cart(
    cart_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    cart_item = db.query(Cart).filter(
        Cart.cart_id == cart_id,
        Cart.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

    return {"message": "Removed from cart"}

@router.patch("/{cart_id}")
def update_cart_quantity(
    cart_id: int,
    quantity: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    cart_item = db.query(Cart).filter(
        Cart.cart_id == cart_id,
        Cart.user_id == user_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = quantity

    db.commit()

    return {"message": "Cart updated"}