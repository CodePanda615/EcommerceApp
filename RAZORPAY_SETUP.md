# Razorpay Integration Setup Guide

## 🚀 What We've Implemented (Frontend)

✅ **Checkout Page** now includes:
- Razorpay as a payment method option
- Razorpay script loader
- Order creation flow for Razorpay
- Payment verification flow
- Success/error handling

## ⏱️ Timeline
- **Frontend Implementation**: ✅ Complete (30 mins)
- **Backend Implementation**: Needed (~1-2 hours)
- **Testing & Deployment**: 30 mins

## 📋 What You Need to Do

### Step 1: Create a Razorpay Account
1. Go to https://razorpay.com
2. Sign up for a Business Account
3. Complete KYC verification
4. Go to Dashboard → Settings → API Keys
5. Copy your **Key ID** (public) and **Key Secret** (keep secret)

### Step 2: Backend APIs That Need to be Created

Create these two new endpoints in your FastAPI backend:

#### Endpoint 1: Create Razorpay Order
```
POST /api/users/orders/razorpay/create

Request Body:
{
  "amount": 10000,
  "currency": "INR",
  "shipping_address": "123 Main St",
  "city": "Mumbai",
  "state": "MH",
  "postal_code": "400001"
}

Response:
{
  "order_id": 1,
  "razorpay_order_id": "order_xyz",
  "razorpay_key_id": "rzp_live_xxxxx"
}
```

#### Endpoint 2: Verify Razorpay Payment
```
POST /api/users/orders/razorpay/verify

Request Body:
{
  "razorpay_order_id": "order_xyz",
  "razorpay_payment_id": "pay_xyz",
  "razorpay_signature": "signature_xyz"
}

Response:
{
  "order_id": 1,
  "status": "paid",
  "message": "Payment verified successfully"
}
```

### Step 3: Install Razorpay Python SDK in Backend

```bash
pip install razorpay
```

### Step 4: Add Environment Variables

Create/update your `.env` file:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
```

### Step 5: Backend Implementation

Add these dependencies to your backend:
```python
import razorpay
import hmac
import hashlib
```

Create a new router file: `routers/users/razorpay.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import razorpay
import hmac
import hashlib
import os
from utils.connection import get_db
from models.order import Order
from schemas.order_schema import OrderCreate
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter(
    prefix="/api/users/orders/razorpay",
    tags=["User Orders - Razorpay"]
)

# Initialize Razorpay client
client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),
        os.getenv("RAZORPAY_KEY_SECRET")
    )
)

@router.post("/create")
def create_razorpay_order(
    payload: dict,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: Session = Depends(get_db)
):
    try:
        # Create Razorpay order
        razorpay_order = client.order.create(
            {
                "amount": int(payload["amount"] * 100),  # Convert to paise
                "currency": "INR",
                "receipt": f"order_{payload.get('shipping_address')}",
            }
        )
        
        # Create order in database with pending status
        order = Order(
            user_id=1,  # Get from token
            total_amount=payload["amount"],
            status="pending",
            payment_method="razorpay",
            razorpay_order_id=razorpay_order["id"]
        )
        
        db.add(order)
        db.commit()
        db.refresh(order)
        
        return {
            "order_id": order.id,
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": os.getenv("RAZORPAY_KEY_ID")
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify")
def verify_razorpay_payment(
    payload: dict,
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    db: Session = Depends(get_db)
):
    try:
        # Verify signature
        signature = payload.get("razorpay_signature")
        order_id = payload.get("razorpay_order_id")
        payment_id = payload.get("razorpay_payment_id")
        
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        message = f"{order_id}|{payment_id}"
        
        expected_signature = hmac.new(
            key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        if signature != expected_signature:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Update order status to paid
        order = db.query(Order).filter(
            Order.razorpay_order_id == order_id
        ).first()
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        order.status = "confirmed"
        order.razorpay_payment_id = payment_id
        db.commit()
        
        return {
            "order_id": order.id,
            "status": "paid",
            "message": "Payment verified successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Step 6: Update Order Model

Add these fields to your `Order` model:
```python
razorpay_order_id: str = Column(String, nullable=True)
razorpay_payment_id: str = Column(String, nullable=True)
```

### Step 7: Register Router in main.py

```python
from routers.users.razorpay import router as razorpay_router

app.include_router(razorpay_router)
```

## 🧪 Testing in Sandbox Mode

Razorpay provides test credentials:
- Key ID: `rzp_test_1DP5MMOk78xreg`
- Key Secret: `9efQQCUeB0sJbb01DsYd1vX1`

Test Card Details:
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`

## ✅ Testing Checklist

- [ ] User selects Razorpay payment method
- [ ] Razorpay dialog opens with correct amount
- [ ] User completes payment with test card
- [ ] Payment signature is verified on backend
- [ ] Order status changes to "confirmed"
- [ ] Success page shows order ID
- [ ] Order appears in user's order history

## 🔐 Security Notes

- Never expose `RAZORPAY_KEY_SECRET` in frontend code ✓
- Always verify signatures on backend ✓
- Use HTTPS in production ✓
- Store payment IDs in database for reconciliation ✓

## 🚀 Going Live

1. Replace test credentials with live credentials
2. Update your website URLs in Razorpay dashboard
3. Test with small amounts first
4. Monitor transactions in Razorpay dashboard

## 📞 Support

- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Dashboard: https://dashboard.razorpay.com

---

**Estimated Time to Complete:** 2-3 hours
**Difficulty Level:** Medium
**Priority:** High (increases conversions)
