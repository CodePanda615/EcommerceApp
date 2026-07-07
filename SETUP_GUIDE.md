# 🚀 EcommerceApp - Complete Setup Guide

## ✅ What's Been Built

### Backend (FastAPI + SQLite)
- ✓ Professional ecommerce APIs (Products, Orders, Categories, Banners, Coupons)
- ✓ Admin panel APIs with authentication
- ✓ User authentication (registration, login, profile)
- ✓ Product filtering and search
- ✓ Cart management
- ✓ Order management with status tracking

### Frontend (React + Vite + Tailwind)
- ✓ **Professional store UI** with navy/amber/teal color scheme
- ✓ **Attractive home page** with:
  - Banner carousel (auto-sliding with navigation)
  - Category-wise product sections
  - Today's deals section
  - Featured collections
- ✓ **Product browsing** with filters (category, price, sorting)
- ✓ **Shopping cart** with add/remove functionality
- ✓ **User authentication** (login/signup)
- ✓ **Complete admin panel** with CRUD operations for:
  - Products
  - Categories
  - Orders (with status management)
  - Banners
  - Coupons
  - Dashboard with KPIs

---

## 📋 Prerequisites

Ensure you have installed:
- Python 3.12+
- Node.js 18+
- npm or pnpm

---

## 🔧 Installation & Setup

### Step 1: Fix Bcrypt Version (Important!)

Open terminal and run:
```bash
cd /home/ayushi/Projects/EcommerceApp/ecommerce_backend
source .venv/bin/activate
pip uninstall bcrypt passlib -y
pip install bcrypt==4.0.1 passlib[bcrypt]==1.7.4 --break-system-packages
```

### Step 2: Start Backend

In **Terminal 1**:
```bash
cd /home/ayushi/Projects/EcommerceApp/ecommerce_backend
source .venv/bin/activate
uvicorn main:app --reload
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Start Frontend

In **Terminal 2**:
```bash
cd /home/ayushi/Projects/EcommerceApp/ecomm_frontend
npm run dev
```

You should see:
```
VITE v8.0.12  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🌐 Access the Application

### Store (Customer Side)
- **Home**: http://localhost:5173/store
- **Login**: http://localhost:5173/store/login
- **Signup**: http://localhost:5173/store/signup
- **Product Details**: http://localhost:5173/store/product/[id]
- **Cart**: http://localhost:5173/store/cart
- **Order History**: http://localhost:5173/store/orders

### Admin Panel
- **Admin Login**: http://localhost:5173/admin/login
- **Dashboard**: http://localhost:5173/admin
- **Products**: http://localhost:5173/admin/products
- **Categories**: http://localhost:5173/admin/categories
- **Orders**: http://localhost:5173/admin/orders
- **Banners**: http://localhost:5173/admin/banners
- **Coupons**: http://localhost:5173/admin/coupons

### Backend Documentation
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

---

## 👤 Test Credentials

### Create Admin Account
Use Postman, curl, or the API docs to register:

**Endpoint**: `POST http://localhost:8000/api/admin/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456"
}
```

Then login at `/admin/login` with these credentials.

### Create User Account
**Endpoint**: `POST http://localhost:8000/api/users/auth/register`

```json
{
  "name": "Test User",
  "email": "user@test.com",
  "password": "123456"
}
```

Then login at `/store/login`.

---

## 🎨 Features Overview

### Home Page
1. **Carousel Banner** - Auto-rotating banners with navigation arrows
2. **Today's Deals** - Featured products
3. **Category Sections** - Products grouped by category
4. **Collections** - Featured collections (Best Sellers, New Arrivals, Special Offers)

### Product Management
- View all products
- Filter by category
- Filter by price range
- Sort by relevance, price, newest
- Add to cart
- View product details with ratings
- Out of stock indicators

### Admin Features
- **Dashboard**: Real-time KPIs (users, products, orders, revenue)
- **Products**: Full CRUD with bulk status/stock updates
- **Categories**: Manage product categories
- **Orders**: View, update status, cancel orders
- **Banners**: Create/delete promotional banners
- **Coupons**: Create/manage discount coupons with expiry dates

### User Features
- Register/Login
- View products with detailed info
- Add items to cart
- View cart and manage quantities
- View order history
- Product filtering and search

---

## 🎯 Color Scheme

The app uses a professional color palette:
- **Primary**: Navy (#0f2340, #1e3a5f)
- **Accent**: Amber (#f59e0b, #d97706)
- **Secondary**: Teal (#0d9488, #0f766e)

---

## 📱 Database

Uses **SQLite** for easy development:
- **File**: `ecommerce_backend/ecommerce.db`
- Auto-created on first run
- No separate database setup needed

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Make sure virtual env is activated
source .venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --break-system-packages
```

### Frontend won't run
```bash
cd ecomm_frontend
npm install
npm run dev
```

### Port already in use
```bash
# Backend on different port
uvicorn main:app --reload --port 8001

# Frontend on different port
npm run dev -- --port 5174
```

### Bcrypt errors
Always run the bcrypt version fix first (see Step 1 above).

---

## 📚 API Documentation

All APIs are documented in Swagger UI. Visit `http://localhost:8000/docs` for:
- Complete endpoint list
- Request/response schemas
- Try-it-out functionality
- Authentication examples

---

## 🎓 Project Structure

```
EcommerceApp/
├── ecommerce_backend/
│   ├── main.py              # FastAPI app
│   ├── models/              # Database models
│   ├── routers/             # API endpoints
│   │   ├── admin/           # Admin APIs
│   │   └── users/           # User APIs
│   ├── schemas/             # Request/response schemas
│   ├── utils/               # Helpers (DB, auth)
│   └── guards/              # Auth guards
├── ecomm_frontend/
│   ├── src/
│   │   ├── admin/           # Admin panel
│   │   ├── store/           # Store UI
│   │   ├── api/             # API clients
│   │   └── App.jsx          # Root component
│   └── package.json         # Dependencies
└── SETUP_GUIDE.md          # This file
```

---

## ✨ Next Steps

1. ✅ Start backend and frontend
2. ✅ Create test admin account
3. ✅ Login to admin panel
4. ✅ Create test products/categories
5. ✅ Create test banners
6. ✅ Browse store as customer
7. ✅ Test shopping flow

Happy building! 🎉
