from pydantic import BaseModel

from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    PACKED = "Packed"
    SHIPPED = "Shipped"
    DELIVERED = "Delivered"
    CANCELLED = "Cancelled"

class OrderSchema(BaseModel):
    total_amount: float

class UpdateOrderStatusSchema(BaseModel):
    status: OrderStatus