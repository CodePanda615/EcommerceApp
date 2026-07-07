from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db

from models.coupons import Coupon
from schemas.coupon import (
    CouponCreate,
    CouponUpdate,
    CouponResponse
)

from guards.admin.auth import AdminGuard

router = APIRouter(
    prefix="/api/admin/coupons",
    dependencies=[Depends(AdminGuard.authorize)]
)

@router.post(
    "",
    response_model=CouponResponse
)
def create_coupon(
    request: CouponCreate,
    db: Session = Depends(get_db)
):

    existing_coupon = (
        db.query(Coupon)
        .filter(
            Coupon.code == request.code.upper()
        )
        .first()
    )

    if existing_coupon:
        raise HTTPException(
            status_code=400,
            detail="Coupon already exists"
        )

    coupon = Coupon(
        code=request.code.upper(),
        discount_percentage=request.discount_percentage,
        min_order_amount=request.min_order_amount,
        max_discount_amount=request.max_discount_amount,
        expiry_date=request.expiry_date
    )

    db.add(coupon)
    db.commit()
    db.refresh(coupon)

    return coupon

@router.get(
    "",
    response_model=list[CouponResponse]
)
def get_coupons(
    db: Session = Depends(get_db)
):
    return db.query(Coupon).all()   

@router.get(
    "/{coupon_id}",
    response_model=CouponResponse
)
def get_coupon(
    coupon_id: int,
    db: Session = Depends(get_db)
):

    coupon = (
        db.query(Coupon)
        .filter(
            Coupon.coupon_id == coupon_id
        )
        .first()
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found"
        )

    return coupon

@router.put(
    "/{coupon_id}",
    response_model=CouponResponse
)
def update_coupon(
    coupon_id: int,
    request: CouponUpdate,
    db: Session = Depends(get_db)
):

    coupon = (
        db.query(Coupon)
        .filter(
            Coupon.coupon_id == coupon_id
        )
        .first()
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found"
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(coupon, key, value)

    db.commit()
    db.refresh(coupon)

    return coupon


@router.delete("/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db)
):

    coupon = (
        db.query(Coupon)
        .filter(
            Coupon.coupon_id == coupon_id
        )
        .first()
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found"
        )

    db.delete(coupon)
    db.commit()

    return {
        "message": "Coupon deleted successfully"
    }
    
@router.patch(
    "/{coupon_id}/status"
)
def update_coupon_status(
    coupon_id: int,
    is_active: bool,
    db: Session = Depends(get_db)
):

    coupon = (
        db.query(Coupon)
        .filter(
            Coupon.coupon_id == coupon_id
        )
        .first()
    )

    if not coupon:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found"
        )

    coupon.is_active = is_active

    db.commit()

    return {
        "message": "Coupon status updated"
    }