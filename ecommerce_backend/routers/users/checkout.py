from fastapi import (
    APIRouter,
    Depends
)

from utils.helper import token
from models.users import User

from sqlalchemy.orm import Session


from models.order import Order
from schemas.order_schema import OrderSchema
from utils.connection import get_db
from fastapi import APIRouter, Depends, HTTPException


from schemas.user_schema import RegisterSchema, LoginSchema

from utils.helper import token
from passlib.context import CryptContext


# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# Hash Password
def hash_password(password: str):
    # Bcrypt has a 72-byte limit; truncate if necessary
    password = password[:72]
    return pwd_context.hash(password)


# Verify Password
def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

router = APIRouter(
    prefix="/api/checkout",
    tags=["Checkout"]
)


@router.post(
    "",
    summary="Checkout",
    description="User must be logged in before proceeding to payment"
)
def checkout(
    email: str,
    password: str,
    product_id: str,
    qty: int,
    amt:int,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )
        
    
    order = Order(
        user_id=1,
        total_amount=qty*amt
    )

    db.add(order)
    db.commit()

    return {
        "message": "Order Created"
    }