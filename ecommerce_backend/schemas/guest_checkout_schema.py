from pydantic import BaseModel, EmailStr
from typing import Optional, List


class CartItem(BaseModel):
    product_id: int
    quantity: int
    price: float


class GuestCheckoutRequest(BaseModel):
    email: EmailStr
    full_name: str
    phone: str
    street_address: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    cart_items: List[CartItem]
    total_amount: float


class CheckoutResponse(BaseModel):
    order_id: int
    message: str
    guest_email: str
