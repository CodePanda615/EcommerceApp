from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_users: int
    total_products: int
    total_categories: int

    total_orders: int

    pending_orders: int
    delivered_orders: int
    cancelled_orders: int

    total_revenue: float