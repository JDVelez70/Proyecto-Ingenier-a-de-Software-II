from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    email: EmailStr
    code: str
    new_password: str


class PlantImageCreate(BaseModel):
    status: str
    disease: Optional[str] = None


class PlantImageRead(BaseModel):
    id: int
    file_path: str
    status: str
    disease: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
