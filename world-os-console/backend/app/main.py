from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List

from .models import Project, Tiers, Tier0Foundation, Tier1Core
from .storage import load_projects, get_project, upsert_project, delete_project


app = FastAPI(title="World-OS Console Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # für MVP offen lassen; später einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/projects", response_model=List[Project])
def list_projects():
    return load_projects()


@app.get("/projects/{project_id}", response_model=Project)
def read_project(project_id: str):
    project = get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.post("/projects", response_model=Project)
def create_project(project: Project):
    # Wenn created_at nicht gesetzt: jetzt
    if project.created_at is None:
        project.created_at = datetime.utcnow()
    if project.updated_at is None:
        project.updated_at = datetime.utcnow()
    return upsert_project(project)


@app.put("/projects/{project_id}", response_model=Project)
def update_project(project_id: str, project: Project):
    if project.id != project_id:
        raise HTTPException(status_code=400, detail="Project ID mismatch")
    existing = get_project(project_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Project not found")
    project.created_at = existing.created_at
    return upsert_project(project)


@app.delete("/projects/{project_id}")
def remove_project(project_id: str):
    ok = delete_project(project_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"}
