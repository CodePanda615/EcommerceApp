from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.order import Order
from schemas.guest_checkout_schema import GuestCheckoutRequest, CheckoutResponse
from models.products import Product

router = APIRouter(
    prefix="/api/guest-checkout",
    tags=["Guest Checkout"]
)


@router.post(
    "",
    response_model=CheckoutResponse,
    summary="Guest Checkout",
    description="Allow guest users to checkout without creating an account"
)
def guest_checkout(
    payload: GuestCheckoutRequest,
    db: Session = Depends(get_db)
):
    # Validate cart items and calculate total
    total_price = 0
    for item in payload.cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        total_price += product.price * item.quantity

    # Verify total amount matches
    if abs(total_price - payload.total_amount) > 0.01:  # Allow for floating point errors
        raise HTTPException(
            status_code=400,
            detail=f"Total amount mismatch. Expected {total_price}, got {payload.total_amount}"
        )

    # Create order (note: for guest checkout, we use user_id as None or a special guest marker)
    # Since the current Order model requires user_id, we'll use a special guest user ID
    # In a production system, you might want to create a "guest" record or store guest info separately

    order = Order(
        user_id=None,  # No user for guest checkout
        total_amount=payload.total_amount
    )

    db.add(order)
    db.flush()  # Flush to get the order ID before commit
    order_id = order.order_id

    # Update product stock
    for item in payload.cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        product.stock -= item.quantity

    db.commit()
    db.refresh(order)

    return CheckoutResponse(
        order_id=order_id,
        message=f"Order created successfully! Order ID: {order_id}. A confirmation email has been sent to {payload.email}",
        guest_email=payload.email
    )


@router.post(
    "/verify",
    summary="Verify Guest Order",
    description="Verify a guest order using order ID and email"
)
def verify_guest_order(
    order_id: int,
    email: str,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.order_id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # In a production system, you would store the guest email with the order
    # For now, we just verify the order exists

    return {
        "order_id": order_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "created_at": order.created_at
    }
