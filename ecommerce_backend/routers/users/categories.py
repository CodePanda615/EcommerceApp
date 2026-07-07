from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.category import Category
from schemas.category_schema import CategoryResponse

from utils.helper import token
from guards.user.auth import UserGuard

router = APIRouter(
    prefix="/api/users/categories",
    tags=["User Categories"],
)

@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db)
):
    return db.query(Category).all()
