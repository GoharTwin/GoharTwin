"""Universal search across equipment, companies, knowledge, hierarchy."""

from ..repositories.company_repo import CompanyRepository
from ..repositories.config_repo import ConfigRepository
from ..repositories.equipment_repo import EquipmentRepository
from ..repositories.knowledge_repo import KnowledgeRepository

company_repo = CompanyRepository()
equipment_repo = EquipmentRepository()
knowledge_repo = KnowledgeRepository()
config_repo = ConfigRepository()


def search(query: str, limit: int = 20) -> list[dict]:
    if not query or len(query.strip()) < 1:
        return []
    q = query.strip().lower()
    results: list[dict] = []

    for company in company_repo.get_all():
        if q in company["name"].lower() or q in company.get("nameFa", "").lower() or q in company["code"].lower():
            results.append({
                "id": company["id"],
                "type": "company",
                "title": company["name"],
                "titleFa": company.get("nameFa"),
                "subtitle": company["code"],
                "route": f"/companies/{company['id']}/dashboard",
            })

    for item in equipment_repo.get_all():
        haystack = f"{item.get('tag','')} {item.get('name','')} {item.get('nameFa','')}".lower()
        if q in haystack:
            cid = item.get("companyId", "gmico")
            pid = item.get("plantId", "pellet")
            results.append({
                "id": item["_id"],
                "type": "equipment",
                "title": item.get("tag", item["_id"]),
                "titleFa": item.get("nameFa"),
                "subtitle": item.get("name"),
                "route": f"/companies/{cid}/plants/{pid}/equipment/{item['_id']}",
            })

    for doc in knowledge_repo.get_all():
        haystack = f"{doc.get('title','')} {doc.get('titleFa','')} {' '.join(doc.get('tags', []))}".lower()
        if q in haystack:
            results.append({
                "id": doc["id"],
                "type": "document",
                "title": doc["title"],
                "titleFa": doc.get("titleFa"),
                "subtitle": doc.get("category"),
                "route": "/knowledge",
            })

    tree = config_repo.get_hierarchy()
    if tree:
        _search_hierarchy(tree.get("companies", []), q, results)

    return results[:limit]


def _search_hierarchy(nodes: list, q: str, results: list) -> None:
    for node in nodes:
        name = node.get("name", "")
        name_fa = node.get("nameFa", "")
        tag = node.get("tag", "")
        haystack = f"{name} {name_fa} {tag} {node.get('id','')}".lower()
        if q in haystack and node.get("type") in ("plant", "area", "unit", "equipment"):
            ntype = node["type"]
            results.append({
                "id": node.get("ref") or node["id"],
                "type": ntype,
                "title": tag or name,
                "titleFa": name_fa or None,
                "subtitle": ntype,
                "route": None,
            })
        if node.get("children"):
            _search_hierarchy(node["children"], q, results)
