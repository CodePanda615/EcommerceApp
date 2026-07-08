from sqlalchemy.orm import Session
from models.users import User
from utils.connection import SessionLocal
from routers.users.auth import hash_password

def seed_db():
    db = SessionLocal()

    try:
        admin = db.query(User).filter(
            User.email == "admin@gmail.com"
        ).first()

        if not admin:
            db.add(
                User(
                    name="Admin",
                    email="admin@gmail.com",
                    password=hash_password("123456"),
                    role="admin",
                    phone="1234567890"
                )
            )

            db.commit()

    finally:
        db.close()