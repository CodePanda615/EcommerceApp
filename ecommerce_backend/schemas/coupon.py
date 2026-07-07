from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CouponCreate(BaseModel):
    code: str
    discount_percentage: float
    min_order_amount: float = 0
    max_discount_amount: Optional[float] = None
    expiry_date: datetime


class CouponUpdate(BaseModel):
    discount_percentage: Optional[float] = None
    min_order_amount: Optional[float] = None
    max_discount_amount: Optional[float] = None
    expiry_date: Optional[datetime] = None
    is_active: Optional[bool] = None


class CouponResponse(BaseModel):
    coupon_id: int
    code: str
    discount_percentage: float
    min_order_amount: float
    max_discount_amount: Optional[float]
    expiry_date: datetime
    is_active: bool

    class Config:
        from_attributes = True