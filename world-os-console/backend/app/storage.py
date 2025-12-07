import json
from pathlib import Path
from typing import List
from datetime import datetime, timezone

from .models import Project


DATA_PATH = Path(__file__).resolve().parent.parent / "data"
DATA_FILE = DATA_PATH / "projects.json"


def _ensure_storage() -> None:
    DATA_PATH.mkdir(parents=True, exist_ok=True)
    if not DATA_FILE.exists():
        DATA_FILE.write_text("[]", encoding="utf-8")


def load_projects() -> List[Project]:
    _ensure_storage()
    raw_text = DATA_FILE.read_text(encoding="utf-8").strip()
    if not raw_text:
        raw = []
    else:
        raw = json.loads(raw_text)

    projects: List[Project] = []
    for item in raw:
        projects.append(Project(**item))
    return projects


def save_projects(projects: List[Project]) -> None:
    """
    Speichert alle Projekte als JSON.

    mode="json" sorgt dafür, dass datetime-Felder
    (created_at, updated_at) als Strings serialisiert werden.
    """
    _ensure_storage()
    DATA_FILE.write_text(
        json.dumps(
            [p.model_dump(mode="json", by_alias=False) for p in projects],
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def get_project(project_id: str) -> Project | None:
    for p in load_projects():
        if p.id == project_id:
            return p
    return None


def upsert_project(project: Project) -> Project:
    """
    Legt ein Projekt neu an oder aktualisiert es.
    updated_at wird immer auf 'jetzt' gesetzt.
    """
    projects = load_projects()
    existing_index = None
    for idx, p in enumerate(projects):
        if p.id == project.id:
            existing_index = idx
            break

    project.updated_at = datetime.now(timezone.utc)

    if existing_index is None:
        projects.append(project)
    else:
        projects[existing_index] = project

    save_projects(projects)
    return project


def delete_project(project_id: str) -> bool:
    projects = load_projects()
    new_projects = [p for p in projects if p.id != project_id]
    if len(new_projects) == len(projects):
        return False
    save_projects(new_projects)
    return True
