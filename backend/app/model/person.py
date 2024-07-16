

from datetime import date
from typing import Optional
from sqlalchemy import Enum
from sqlmodel import SQLModel, Field
from app.model.mixins import TimeMixin


class Sex(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"


class Person(SQLModel, TimeMixin, table=True):
    __tablename__ = "person"

    id: Optional[str] = Field(None, primary_key=True, nullable=False)
    name: str
    birth: date
    sex: Sex
    profile: str
    phone_number: str

