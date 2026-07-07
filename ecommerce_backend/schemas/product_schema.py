from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None

    price: float
    stock: int

    image_url: Optional[str] = None
    category_id: int


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

    price: Optional[float] = None
    stock: Optional[int] = None

    image_url: Optional[str] = None
    is_active: Optional[bool] = None

    category_id: Optional[int] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    price: float
    stock: int

    image_url: Optional[str]

    is_active: bool

    category_id: int

    class Config:
        from_attributes = True