# ...existing code...
import random
import string
from datetime import datetime, timedelta
from . import email_utils
from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
from . import models, schemas, auth, google_oauth, database
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

def get_db():
	db = database.SessionLocal()
	try:
		yield db
	finally:
		db.close()

# Signup endpoint
@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
	hashed_password = auth.get_password_hash(user.password)
	db_user = models.User(email=user.email, hashed_password=hashed_password)
	db.add(db_user)
	try:
		db.commit()
		db.refresh(db_user)
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=400, detail="Email already registered")
	token = auth.create_access_token({"sub": db_user.email})
	return {"access_token": token, "token_type": "bearer"}

# Signin endpoint
@app.post("/signin", response_model=schemas.Token)
def signin(user: schemas.UserLogin, db: Session = Depends(get_db)):
	db_user = db.query(models.User).filter(models.User.email == user.email).first()
	if not db_user or not db_user.hashed_password:
		raise HTTPException(status_code=400, detail="Invalid credentials")
	if not auth.verify_password(user.password, db_user.hashed_password):
		raise HTTPException(status_code=400, detail="Invalid credentials")
	token = auth.create_access_token({"sub": db_user.email})
	return {"access_token": token, "token_type": "bearer"}

# Google OAuth endpoints
@app.get("/login/google")
def login_google():
	google_auth_url = (
		f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code"
		f"&client_id={google_oauth.GOOGLE_CLIENT_ID}"
		f"&redirect_uri={google_oauth.GOOGLE_REDIRECT_URI}"
		f"&scope=openid%20email%20profile"
	)
	return RedirectResponse(google_auth_url)

@app.get("/auth/google/callback", response_model=schemas.Token)
def google_callback(request: Request, db: Session = Depends(get_db)):
	code = request.query_params.get("code")
	if not code:
		raise HTTPException(status_code=400, detail="No code provided")
	token_data = google_oauth.get_google_token(code)
	userinfo = google_oauth.get_google_userinfo(token_data["access_token"])
	email = userinfo.get("email")
	google_id = userinfo.get("id")
	if not email or not google_id:
		raise HTTPException(status_code=400, detail="Google user info incomplete")
	db_user = db.query(models.User).filter(models.User.email == email).first()
	if not db_user:
		db_user = models.User(email=email, google_id=google_id)
		db.add(db_user)
		db.commit()
		db.refresh(db_user)
	token = auth.create_access_token({"sub": db_user.email})
	return {"access_token": token, "token_type": "bearer"}

# Migración manual (crear tablas)
# Migración manual (crear tablas)
@app.on_event("startup")
def on_startup():
	models.Base.metadata.create_all(bind=database.engine)


# Endpoint para solicitar recuperación de contraseña
@app.post("/password-reset/request")
def password_reset_request(data: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
	user = db.query(models.User).filter(models.User.email == data.email).first()
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")
	code = ''.join(random.choices(string.digits, k=6))
	expires_at = datetime.utcnow() + timedelta(minutes=15)
	# Eliminar códigos previos
	db.query(models.PasswordResetCode).filter(models.PasswordResetCode.user_id == user.id).delete()
	db.add(models.PasswordResetCode(user_id=user.id, code=code, expires_at=expires_at))
	db.commit()
	email_utils.send_reset_email(user.email, code)
	return {"message": "Código enviado al correo electrónico"}

# Endpoint para confirmar recuperación de contraseña
@app.post("/password-reset/confirm")
def password_reset_confirm(data: schemas.PasswordResetConfirm, db: Session = Depends(get_db)):
	user = db.query(models.User).filter(models.User.email == data.email).first()
	if not user:
		raise HTTPException(status_code=404, detail="Usuario no encontrado")
	reset_code = db.query(models.PasswordResetCode).filter(models.PasswordResetCode.user_id == user.id, models.PasswordResetCode.code == data.code).first()
	if not reset_code or reset_code.expires_at < datetime.utcnow():
		raise HTTPException(status_code=400, detail="Código inválido o expirado")
	user.hashed_password = auth.get_password_hash(data.new_password)
	db.delete(reset_code)
	db.commit()
	return {"message": "Contraseña actualizada correctamente"}
