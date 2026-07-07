from fastapi import Header, HTTPException, Depends

from utils.helper import token as Token

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from utils.helper import token as Token

security = HTTPBearer()

class AdminGuard:

    @staticmethod
    def authorize(
        credentials: HTTPAuthorizationCredentials = Depends(security)
    ):

        token = credentials.credentials

        try:
            payload = Token.get_user(token)

        except Exception:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )

        return payload