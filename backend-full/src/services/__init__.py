from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional
from sqlalchemy.orm import Session


T = TypeVar('T')


class BaseService(ABC, Generic[T]):
    def __init__(self, db: Session):
        self.db = db

    @abstractmethod
    def create(self, obj: T) -> T:
        pass

    @abstractmethod
    def get_by_id(self, id: int) -> Optional[T]:
        pass

    @abstractmethod
    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        pass

    @abstractmethod
    def update(self, id: int, obj: T) -> Optional[T]:
        pass

    @abstractmethod
    def delete(self, id: int) -> bool:
        pass