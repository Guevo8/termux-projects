# World-OS Console (MVP)

World-OS Console ist Version A deiner World-OS-Familie:
Eine schlanke Web-Anwendung, mit der Welten nach einem klaren World-OS-Schema (T0–T5)
als strukturierte Daten angelegt, bearbeitet und exportiert werden können – ohne KI-Integration.

Die Idee:
Erst das Datenmodell & die UX stehen stabil (A), dann kommen KI-Assistenz (B) und Studio-/Multi-Agent-System (C) oben drauf.

---

## Features (MVP-Stand)

- World-OS-Datenmodell (JSON-Schema)
  - Datei: schema/world_os_project_schema_v1.json
  - Projekt mit:
    - id, name, type, description, tags, created_at, updated_at
    - tiers:
      - T0_foundation – Kanon, Physik/Magie, Themes, Ton, Constraints
      - T1_core – World Core Card (Logline, Setting, Core Conflict, Signature Elements, Factions)
      - T2_modules[] – Module & Systeme (Fraktionen, Öko, Tech, Magiesysteme, …)
      - T3_characters[] – R.A.C.E.-Lite-Charaktere
      - T4_zones[] – Zonen/Schauplätze (Lite)
      - T5_narrative[] – Narrative Chains (Arcs, Quests, Episoden)

- Beispielprojekt (Heartroot City)
  - examples/heartroot_demo_lite_project.json
  - vereinfachte Demo-Welt mit ausgefülltem T0/T1.

- Backend (FastAPI)
  - Ordner: backend/
  - Technologien: Python 3, FastAPI, Uvicorn, Pydantic v2
  - Endpunkte:
    - GET  /health                 – Healthcheck
    - GET  /projects               – Liste aller Projekte
    - GET  /projects/{project_id}  – einzelnes Projekt
    - POST /projects               – Projekt anlegen/überschreiben
    - PUT  /projects/{project_id}  – Projekt aktualisieren
    - DELETE /projects/{project_id} – Projekt löschen
  - Persistenz:
    - JSON-Datei backend/data/projects.json

- Frontend (minimaler React-Viewer)
  - Ordner: frontend/
  - index.html + main.jsx
  - Lädt /projects vom Backend und zeigt eine einfache Projektliste + Tier-Roadmap-Viewer.

---

## Projektstruktur (Kurz)

- README.md         – dieses Dokument
- LICENSE           – MIT-Lizenz (2025, Tobias Peters)
- .gitignore        – ignores für venv, node_modules, Laufzeitdaten
- schema/
  - world_os_project_schema_v1.json
- examples/
  - heartroot_demo_lite_project.json
- backend/
  - requirements.txt
  - app/
    - __init__.py
    - main.py        – FastAPI-App + Endpunkte
    - models.py      – Pydantic-Modelle für Tiers & Project
    - storage.py     – JSON-Storage-Layer (schreibt projects.json)
  - data/
    - projects.json  – Laufzeitdaten (wird bei Bedarf erzeugt)
- frontend/
  - index.html
  - main.jsx

---

## Backend-Quickstart

    cd backend
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    # → http://127.0.0.1:8000

## Frontend (aktuell minimal)

    cd frontend
    # Optional: Vite/React einrichten, main.jsx anpassen
    # Für den MVP reicht es, die index.html im Browser zu öffnen
