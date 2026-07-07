from sqlalchemy import Column,Integer,String,Float
from utils.connection import Base

class Payment(Base):

    __tablename__ = "payments"

    payment_id = Column(
        Integer,
        primary_key=True
    )

    order_id = Column(Integer)

    amount = Column(Float)

    payment_status = Column(
        String,
        default="Success"
    )