from app.model.person import Person
from app.repo.base_repo import BaseRepo

class PersonRepository(BaseRepo):
    model = Person