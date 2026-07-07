from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.banners import Banner
from schemas.banners import Create_Banner , BannerResponse

from utils.helper import token
from passlib.context import CryptContext

router = APIRouter(
    prefix="/api/user/banner",
    tags=["User Banner"]
)

@router.get("",
    response_model=list[BannerResponse]
)
def get_banner(
    db: Session = Depends(get_db)
):
    banners = db.query(Banner).all()
    return banners
    