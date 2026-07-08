
# JWT
SECRET_KEY = "mysecretkey"

ALGORITHM = "HS256"

from datetime import (
    datetime,
    timedelta
)
from jose import jwt
from fastapi import HTTPException

class token:
    @staticmethod
    def create_access_token(data: dict):
        to_encode = data.copy()

        expire = datetime.utcnow() + timedelta(
            days=7
        )

        to_encode.update({
            "exp": expire
        })

        token = jwt.encode(
            to_encode,
            SECRET_KEY,
            algorithm=ALGORITHM
        )

        return token

    @staticmethod
    def get_userid(token):
        data = jwt.decode(
            token,
            key=SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return data["user_id"]
    
    @staticmethod
    def get_user(token):
        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM]
            )
            return payload

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="Token expired"
            )

        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )