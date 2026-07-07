from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.banners import Banner
from schemas.banners import Create_Banner , BannerResponse

from guards.admin.auth import AdminGuard

router = APIRouter(
    prefix="/api/admin/banner",
    tags=["Product Banner"],
    dependencies=[Depends(AdminGuard.authorize)]
)


@router.post("", response_model=BannerResponse)
def create_banner(
    payload: Create_Banner,
    db: Session = Depends(get_db)
):
    banner = Banner(
        title=payload.title,
        sub_title=payload.sub_title,
        CTA=payload.CTA,
        image_url=payload.image_url,
        target_url=payload.target_url
    )

    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner

@router.get("", response_model=list[BannerResponse])
def get_banner(
    db: Session = Depends(get_db)
):
    banners = db.query(Banner).all()
    return banners

@router.delete("/{banner_id}")
def delete_banner(
    banner_id: int,
    db: Session = Depends(get_db)
):
    banner = db.query(Banner).filter(Banner.banner_id == banner_id).first()

    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")

    db.delete(banner)
    db.commit()

    return {"message": "Banner deleted successfully"}
    