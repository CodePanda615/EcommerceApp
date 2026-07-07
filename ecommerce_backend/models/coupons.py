from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Boolean
)
from sqlalchemy.sql import func

from utils.connection import Base


class Coupon(Base):

    __tablename__ = "coupons"

    coupon_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    code = Column(
        String(50),
        unique=True,
        nullable=False
    )

    discount_percentage = Column(
        Float,
        nullable=False
    )

    min_order_amount = Column(
        Float,
        default=0
    )

    max_discount_amount = Column(
        Float,
        nullable=True
    )

    expiry_date = Column(
        DateTime,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )