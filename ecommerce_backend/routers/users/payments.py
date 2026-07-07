from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.payments import Payment
from schemas.payments_schema import PaymentSchema

from utils.helper import token
from guards.user.auth import UserGuard

router = APIRouter(
    prefix="/api/users/payments",
    tags=["Payments"],
    dependencies=[Depends(UserGuard.authorize)]
)

@router.post(
    "",
    tags=["User Payments"],
    summary="Create Payment",
    description="Process payment for an order."
)

def create_payment(
    request: PaymentSchema,
    db: Session = Depends(get_db)
):

    payment = Payment(
        order_id=request.order_id,
        amount=request.amount
    )

    db.add(payment)
    db.commit()

    return {
        "message": "Payment Successful"
    }
    
    
