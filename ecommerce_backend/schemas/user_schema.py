from pydantic import BaseModel, EmailStr
from typing import Optional


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserMeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    phone: Optional[int] = None

class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    password: str
    role: str
    phone: Optional[int] = None

