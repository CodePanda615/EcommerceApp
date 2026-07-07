from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.users import User
from schemas.user_schema import RegisterSchema, LoginSchema
from utils.helper import token
from passlib.context import CryptContext

security = HTTPBearer()

router = APIRouter(
    prefix="/api/admin/auth",
    tags=["Admin Authentication"]
)

# Password Hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Hash Password
def hash_password(password: str):
    # Bcrypt has a 72-byte limit; truncate if necessary
    password = password[:72]
    return pwd_context.hash(password)


# Verify Password
def verify_password(
    plain_password,
    hashed_password
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

@router.post(
    "/register",
    tags=["Authentication"],
    summary="Register Admin",
    description="Create a new admin account."
)
def register(
    request: RegisterSchema,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == request.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_admin = User(
        name=request.name,
        email=request.email,
        password=hash_password(
            request.password
        ),
        role="admin"
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "message": "Admin registered successfully"
    }



@router.post(
    "/login",
    tags=["Authentication"],
    summary="Admin Login",
    description="Authenticate admin and generate JWT token."
)
def login(
    request: LoginSchema,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        request.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    access_token = token.create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    tags=["Authentication"],
    summary="Get Admin Info",
    description="Get current admin information from JWT token."
)
def get_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token_str = credentials.credentials
    payload = token.get_user(token_str)

    return {
        "id": payload["user_id"],
        "email": payload["email"],
        "role": payload["role"]
    }
