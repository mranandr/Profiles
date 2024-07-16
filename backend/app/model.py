from typing import Optional
from enum import Enum
from sqlalchemy import Column, Integer, String
from database import Base

class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    gender = Column(String)
    phone_number = Column(String)
    password = Column(String)
