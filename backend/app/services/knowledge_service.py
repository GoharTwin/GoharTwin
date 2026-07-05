"""Knowledge library service."""

from ..repositories.knowledge_repo import KnowledgeRepository

knowledge_repo = KnowledgeRepository()


def list_knowledge(category: str | None = None) -> list[dict]:
    return knowledge_repo.get_by_category(category)
