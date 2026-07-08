from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from utils.connection import get_db
from models.users import User
from schemas.user_schema import RegisterSchema, LoginSchema, UserMeResponse

from utils.helper import token
from passlib.context import CryptContext

router = APIRouter(
    prefix="/api/users/auth",
    tags=["User Authentication"]
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
    summary="Register User",
    description="Create a new user account."
)
def register(
    request: RegisterSchema,
    db: Session = Depends(get_db)
):
    print(request)
    existing_user = db.query(User).filter(
        User.email == request.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=request.name,
        email=request.email,
        password=hash_password(
            request.password
        )
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post(
    "/login",
    tags=["Authentication"],
    summary="User Login",
    description="Authenticate user and generate JWT token."
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


from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException

security = HTTPBearer()

@router.get("/me", response_model=UserMeResponse)
def get_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token_str = credentials.credentials

    payload = token.get_user(token_str)
    user = db.query(User).get(payload["user_id"])

    return UserMeResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        phone=user.phone
    )