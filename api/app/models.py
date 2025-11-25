from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)

    # Relationship opcional pero útil si quieres navegar el usuario → códigos
    reset_codes = relationship("PasswordResetCode", back_populates="user")


class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    code = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="reset_codes")


class PlantImage(Base):
    __tablename__ = "plant_images"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    status = Column(String, nullable=False)  # 'sana' o 'enferma'
    disease = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
