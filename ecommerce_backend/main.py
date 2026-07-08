from fastapi import (
    FastAPI,
)

from utils.connection import (
    engine,
    Base
)

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:80",
      "*"  # Vite
]

from routers.admin.categories import router as category_router
from routers.admin.products import router as product_router
from routers.admin.auth import router as admin_auth
from routers.admin.orders import router as admin_orders
from routers.admin.dashboard import router as admin_dashboard
from routers.admin.banners import router as admin_banners
from routers.admin.coupons import router as admin_coupons

from routers.users.auth import router as user_auth
from routers.users.carts import router as user_cart
from routers.users.payments import router as user_payment
from routers.users.orders import router as user_order
from routers.users.products import router as user_products
from routers.users.categories import router as user_categories
from routers.users.banners import router as user_banners
from routers.users.reviews import router as user_reviews
from routers.users.guest_checkout import router as guest_checkout

from utils.seed import seed_db

Base.metadata.create_all(bind=engine)
seed_db()

tags_metadata = [
    {
        "name": "Admin Authentication",
        "description": "Admin login APIs"
    },
    {
        "name": "Admin Categories",
        "description": "Manage categories"
    },
    {
        "name": "Admin Products",
        "description": "Manage products"
    },
    {
        "name": "Admin Orders",
        "description": "Manage orders"
    },
    {
        "name": "Admin Dashboard",
        "description": "Dashboard statistics"
    },
    {
        "name": "Product Banner",
        "description": "Admin products banners"
    },
    {
        "name": "User Authentication",
        "description": "User registration and login"
    },
    {
        "name": "User Cart",
        "description": "Shopping cart APIs"
    },
    {
        "name": "User Orders",
        "description": "Customer order APIs"
    },
    {
        "name": "User Payments",
        "description": "Payment APIs"
    },
    {
        "name": "User Products",
        "description": "User products APIs"
    },
    {
        "name": "User Categories",
        "description": "User products categories"
    },
        {
        "name": "User Banner",
        "description": "User products banners"
    },
    {
        "name": "User Reviews",
        "description": "Product reviews and ratings"
    },
    {
        "name": "Guest Checkout",
        "description": "Guest checkout without registration"
    }
]

app = FastAPI(
    title="E-Commerce Backend API",
    description="FastAPI + PostgreSQL E-Commerce Backend",
    version="1.0.0",
    openapi_tags=tags_metadata,
)

app.include_router(category_router)
app.include_router(product_router)
app.include_router(admin_auth)
app.include_router(admin_orders)
app.include_router(admin_dashboard)
app.include_router(admin_banners)
app.include_router(admin_coupons)

app.include_router(user_auth)
app.include_router(user_cart)
app.include_router(user_order)
app.include_router(user_payment)
app.include_router(user_products)
app.include_router(user_banners)
app.include_router(user_categories)
app.include_router(user_reviews)

from routers.users.checkout import (
    router as checkout_router
)

app.include_router(
    checkout_router
)

app.include_router(guest_checkout)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
