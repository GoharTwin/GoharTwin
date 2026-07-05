"""Abstract repository interface."""

from abc import ABC, abstractmethod
from typing import Any


class Repository(ABC):
    @abstractmethod
    def get_all(self) -> list[dict[str, Any]]:
        pass

    @abstractmethod
    def get_by_id(self, item_id: str) -> dict[str, Any] | None:
        pass

    def search(self, query: str) -> list[dict[str, Any]]:
        q = query.lower()
        return [
            item for item in self.get_all()
            if q in str(item).lower()
        ]
