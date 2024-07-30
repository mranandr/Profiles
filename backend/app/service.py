from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session, session
from model import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(session: Session, username: str) -> User:
    return session.query(User).filter(User.username == username).first()

class LoginRequest(BaseModel):
    username: str
    password: str

def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(session: Session, username: str, password: str) -> User:
    user = get_user_by_username(session, username)
    if not user or not verify_password(password, user.password):
        return None
    return user

def get_user_by_mail(plain_mail:str, maill) ->bool:
    return User.email
def forgot_password(sessio: User.email) -> User:
    user = get_user_by_mail(session, User.email)
    if not user.email
        return None
