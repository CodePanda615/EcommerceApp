from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db

from models.products import Product
from models.category import Category

from schemas.product_schema import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)
from guards.admin.auth import AdminGuard

router = APIRouter(
    prefix="/api/admin/products",
    tags=["Admin Products"],
    dependencies=[Depends(AdminGuard.authorize)]
)

@router.post(
    "",
    response_model=ProductResponse
)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db)
):

    category = (
        db.query(Category)
        .filter(
            Category.id == payload.category_id
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    product = Product(
        name=payload.name,
        description=payload.description,
        price=payload.price,
        stock=payload.stock,
        image_url=payload.image_url,
        category_id=payload.category_id
    )

    db.add(product)

    db.commit()
    db.refresh(product)

    return product

@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):

    return db.query(Product).all()

@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Validate category_id if provided
    update_data = payload.model_dump(
        exclude_unset=True
    )

    if "category_id" in update_data and update_data["category_id"]:
        category = (
            db.query(Category)
            .filter(Category.id == update_data["category_id"])
            .first()
        )
        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)

    db.commit()

    return {
        "message": "Product deleted successfully"
    }
    
@router.patch(
    "/{product_id}/stock"
)
def update_stock(
    product_id: int,
    stock: int,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.stock = stock

    db.commit()

    return {
        "message": "Stock updated"
    }
    

@router.patch(
    "/{product_id}/status"
)
def change_status(
    product_id: int,
    is_active: bool,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = is_active

    db.commit()

    return {
        "message": "Status updated"
    }