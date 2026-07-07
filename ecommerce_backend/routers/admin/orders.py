from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db

from models.order import Order
from models.users import User

from schemas.order_schema import (
    UpdateOrderStatusSchema
)
from guards.admin.auth import AdminGuard

router = APIRouter(
    prefix="/api/admin/orders",
    tags=["Admin Orders"],
    dependencies=[Depends(AdminGuard.authorize)]
)

@router.get(
    ""
)
def get_orders(
    db: Session = Depends(get_db)
):
    orders = db.query(Order).all()
    result = []
    for order in orders:
        user = db.query(User).filter(User.id == order.user_id).first()
        result.append({
            "order_id": order.order_id,
            "user_id": order.user_id,
            "user_name": user.name if user else "Unknown",
            "user_email": user.email if user else "Unknown",
            "user_phone": user.phone if user else None,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "updated_at": order.updated_at
        })
    return result

@router.get(
    "/{order_id}"
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(
            Order.order_id == order_id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    user = db.query(User).filter(User.id == order.user_id).first()

    return {
        "order_id": order.order_id,
        "user_id": order.user_id,
        "user_name": user.name if user else "Unknown",
        "user_email": user.email if user else "Unknown",
        "user_phone": user.phone if user else None,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "updated_at": order.updated_at
    }

@router.patch(
    "/{order_id}/status"
)
def update_order_status(
    order_id: int,
    request: UpdateOrderStatusSchema,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(
            Order.order_id == order_id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled"
    ]

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    order.status = request.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Status updated successfully",
        "status": order.status
    }
    
    
@router.patch(
    "/{order_id}/cancel"
)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = (
        db.query(Order)
        .filter(
            Order.order_id == order_id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = "Cancelled"

    db.commit()

    return {
        "message": "Order cancelled"
    }
    
