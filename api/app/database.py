from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,     # verifica que la conexión siga viva antes de usarla
    pool_recycle=300,       # (opcional) recicla conexiones cada 5 min
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
