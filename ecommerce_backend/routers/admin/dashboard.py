from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from utils.connection import get_db

from models.users import User
from models.products import Product
from models.category import Category
from models.order import Order

from guards.admin.auth import AdminGuard
from schemas.dashboard import DashboardResponse

router = APIRouter(
    prefix="/api/admin/dashboard",
    tags=["Admin Dashboard"],
    dependencies=[Depends(AdminGuard.authorize)]
)

@router.get(
    "",
    response_model=DashboardResponse
)
def get_dashboard(
    db: Session = Depends(get_db)
):

    total_users = db.query(User).count()

    total_products = db.query(Product).count()

    total_categories = db.query(Category).count()

    total_orders = db.query(Order).count()

    pending_orders = (
        db.query(Order)
        .filter(Order.status == "Pending")
        .count()
    )

    delivered_orders = (
        db.query(Order)
        .filter(Order.status == "Delivered")
        .count()
    )

    cancelled_orders = (
        db.query(Order)
        .filter(Order.status == "Cancelled")
        .count()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Order.total_amount),
                0
            )
        )
        .filter(Order.status == "Delivered")
        .scalar()
    )

    return {
        "total_users": total_users,
        "total_products": total_products,
        "total_categories": total_categories,

        "total_orders": total_orders,

        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "cancelled_orders": cancelled_orders,

        "total_revenue": float(total_revenue)
    }