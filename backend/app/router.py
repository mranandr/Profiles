import jwt
from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import timedelta, datetime
import logging
from sqlalchemy.orm import Session
from model import User  # Assuming you have a User model defined
from service import create_user, get_user_by_username, authenticate_user, pwd_context, LoginRequest
from database import get_session  # Assuming you have a function to get SQLAlchemy session

router = APIRouter()

SECRET_KEY = "anand.321"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    name: str
    username: str
    email: str
    gender: str
    phone_number: str
    password: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

logger = logging.getLogger(__name__)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    except Exception as e:
        logger.error(f"Error generating token: {e}")
        raise HTTPException(status_code=500, detail="Error generating token")
    return encoded_jwt

def get_current_active_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=401, detail="Invalid credentials", headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception as e:
        logger.error(f"Error validating token: {e}")
        raise credentials_exception
    user = get_user_by_username(session, username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/auth/register", response_model=UserCreate)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, username=user.username, email=user.email,
                   gender=user.gender, phone_number=user.phone_number,
                   password=hashed_password)
    created_user = create_user(session, db_user)
    return created_user

@router.post("/auth", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token({"sub": user.username}, access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/auth/users/me", response_model=UserCreate)
def get_current_user(current_user: User = Depends(get_current_active_user)):
    return current_user
@router.post("/auth/login")
async def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = authenticate_user(session, request.username, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer", "detail": "Login successful"}

