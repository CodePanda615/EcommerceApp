from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from datetime import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from utils.connection import get_db
from models.order import Order
from models.users import User
from schemas.order_schema import OrderSchema

from utils.helper import token
from guards.user.auth import UserGuard

# Load environment variables
load_dotenv()

security = HTTPBearer()

router = APIRouter(
    prefix="/api/users/orders",
    tags=["Orders"],
    dependencies=[Depends(UserGuard.authorize)]
)

def send_order_confirmation_email(user_email: str, user_name: str, order_id: int, total_amount: float, order_date: str):
    """Send order confirmation email using SendGrid"""
    try:
        sendgrid_api_key = os.getenv("SENDGRID_APIKEY") 
        if not sendgrid_api_key:
            print("Error: SENDGRID_APIKEY not found in environment variables")
            return False

        # Create professional HTML email template
        html_content = f"""
        <html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e3a8a 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <div style="width: 50px; height: 50px; background-color: #a855f7; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <span style="color: white; font-size: 24px; font-weight: bold;">S</span>
                        </div>
                        <h1 style="color: white; margin: 0; font-size: 28px;">ShopNova</h1>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                        <h2 style="color: #0f172a; margin-top: 0; margin-bottom: 10px; font-size: 24px;">Order Confirmed! 🎉</h2>
                        <p style="color: #64748b; margin-bottom: 30px; font-size: 16px;">Thank you for your order, <strong>{user_name}</strong>. Your order has been successfully placed and is being processed.</p>

                        <!-- Order Details Card -->
                        <div style="background-color: #f1f5f9; border-left: 4px solid #a855f7; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order ID</span>
                                        <div style="color: #0f172a; font-size: 18px; font-weight: bold; margin-top: 5px;">#{order_id}</div>
                                    </td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                                        <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Date</span>
                                        <div style="color: #0f172a; font-size: 14px; font-weight: 500; margin-top: 5px;">{order_date}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Status</span>
                                        <div style="color: white; background-color: #eab308; display: inline-block; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-top: 5px;">PENDING</div>
                                    </td>
                                    <td style="padding: 15px 0; text-align: right;">
                                        <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Order Total</span>
                                        <div style="color: #a855f7; font-size: 24px; font-weight: bold; margin-top: 5px;">₹{total_amount:,.2f}</div>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!-- What's Next -->
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 16px;">What's Next?</h3>
                            <ol style="color: #475569; line-height: 1.8; padding-left: 20px; margin: 0;">
                                <li style="margin-bottom: 10px;">We'll confirm your payment and process your order</li>
                                <li style="margin-bottom: 10px;">Your items will be packed with care</li>
                                <li style="margin-bottom: 10px;">We'll ship your order and provide tracking details</li>
                                <li>You'll receive a delivery confirmation email</li>
                            </ol>
                        </div>

                        <!-- Delivery Info -->
                        <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
                            <p style="color: #166534; margin: 0; font-size: 14px;">
                                <strong>📦 Free Delivery</strong><br>
                                On orders above ₹499. Your order will be delivered in 2-3 business days.
                            </p>
                        </div>

                        <!-- Support -->
                        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">Need help? We're here for you!</p>
                            <a href="https://shopnova.com/support" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 14px;">Contact Support</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 5px 0;">ShopNova • Your Online Shopping Destination</p>
                        <p style="color: #cbd5e1; font-size: 11px; margin: 5px 0;">This is an automated email. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
        </html>
        """

        message = Mail(
            from_email='saxenaayushi615@gmail.com',
            to_emails=user_email,
            subject=f'Order Confirmation - Order #{order_id}',
            html_content=html_content
        )

        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(f"Email sent successfully. Status code: {response.status_code}")
        return True

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

@router.post(
    "",
    tags=["User Orders"],
    summary="Create Order",
    description="Create a new order."
)
def create_order(
    request: OrderSchema,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    # Get user details
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    order = Order(
        user_id=user_id,
        total_amount=request.total_amount
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    # Send order confirmation email
    order_date = order.created_at.strftime("%d %B %Y, %I:%M %p") if order.created_at else datetime.now().strftime("%d %B %Y, %I:%M %p")
    send_order_confirmation_email(
        user_email=user.email,
        user_name=user.name,
        order_id=order.order_id,
        total_amount=order.total_amount,
        order_date=order_date
    )

    return {
        "message": "Order Created",
        "order_id": order.order_id
    }

@router.get("")
def get_user_orders(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user_id = token.get_userid(credentials.credentials)

    orders = db.query(Order).filter(Order.user_id == user_id).all()

    return orders
