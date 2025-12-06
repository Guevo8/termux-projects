# World-OS Console: Architektur & Überblick

**Generiert**: 2025-12-06 | **Projekt**: termux-projects  
**Status**: MVP-Phase | **Versionsstand**: v1.0

---

## 📋 Projektübersicht

### Was ist World-OS Console?

Eine schlanke Web-Anwendung zur Verwaltung strukturierter Welten-Daten nach dem **World-OS 6-Tier-Modell** (T0–T5).

**Kernidee**: 
- Erst stabiles Datenmodell & UX (Phase A: aktuell)
- Dann KI-Assistenz (Phase B: geplant)
- Später Multi-Agent-System (Phase C: Vision)

**Keine KI-Integration im MVP** – das ist bewusst!

---

## 🏗️ Architektur: 3-Layer-Stack

### Layer 1: Datenmodell (Schema)
- **Datei**: `schema/world_os_project_schema_v1.json`
- **Format**: JSON-Schema mit 6 Tiers
- **Zweck**: Definiert die Struktur aller Welt-Projekte

### Layer 2: Backend (FastAPI)
- **Technologie**: Python 3 + FastAPI + Uvicorn
- **Ordner**: `backend/app/` + `backend/data/`
- **Persistenz**: `projects.json` (JSON-Datei-basiert)
- **Endpunkte**:
  - `GET /health` – Healthcheck
  - `GET /projects` – Alle Projekte
  - `GET /projects/{id}` – Einzelnes Projekt
  - `POST /projects` – Neues Projekt
  - `PUT /projects/{id}` – Projekt aktualisieren
  - `DELETE /projects/{id}` – Projekt löschen

### Layer 3: Frontend (React/Vite)
- **Technologie**: React + Vite (minimal)
- **Ordner**: `frontend/`
- **Funktion**: Projektliste + Tier-Roadmap-Viewer
- **Dateien**: `index.html` + `main.jsx`

---

## 📊 Das World-OS 6-Tier-Modell

| Tier | Name | Beschreibung | Beispiel |
|------|------|-------------|----------|
| **T0** | Foundation | Canon, Physik/Magie, Themes, Ton, Constraints | "Heartroot City ist ein Urban-Fantasy-Setting mit Biolumineszenz" |
| **T1** | Core Card | Logline, Setting, Core Conflict, Signature Elements, Factions | "Eine verbotene Liebe zwischen zwei Fraktionen" |
| **T2** | Modules | Systeme: Fraktionen, Ökologie, Technologie, Magie, etc. | "Nachtblüte-Fraktion vs. Tagwächter-Orden" |
| **T3** | Characters | R.A.C.E.-Lite Charaktere (Rolle, Architektur, Charakter, Eigenschaft) | "Lyra: Geheime Nachtseherin mit doppelter Loyalität" |
| **T4** | Zones | Schauplätze, Locations (Namen, Beschreibungen, NPCs) | "Der Kristallwald: Heimat der Nachtblüte" |
| **T5** | Narrative | Narrative Chains: Arcs, Quests, Episoden | "Arc 1: Das erste Treffen; Quest: Den Kristall finden" |

---

## 📁 Projektstruktur (Detailliert)

```
world-os-console/
├── README.md                    ← Projektdoku (MVP)
├── LICENSE                      ← MIT (2025, Tobias Peters)
├── .gitignore
│
├── schema/
│   └── world_os_project_schema_v1.json    ← Datenmodell-Definition
│
├── examples/
│   └── heartroot_demo_lite_project.json   ← Demo-Projekt (Heartroot City)
│
├── backend/
│   ├── requirements.txt         ← Python-Dependencies
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              ← FastAPI App + Endpunkte
│   │   ├── models.py            ← Pydantic Tier-Modelle
│   │   └── storage.py           ← JSON Storage-Layer
│   ├── data/
│   │   └── projects.json        ← Runtime-Daten (generiert)
│   └── .venv/                   ← Virtual Env (gitignored)
│
├── frontend/
│   ├── index.html               ← Einstiegspunkt
│   ├── main.jsx                 ← React-Komponenten
│   └── (Vite-Config: optional)
│
└── portal/                      ← NEU: Dokumentation & Portal
    ├── AI-Dev-Orchestration-Portal.html
    ├── overview.md
    └── AGENTS.md
```

---

## 🚀 Quickstart

### Backend starten
```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # oder: .venv\\Scripts\\activate (Windows)
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://127.0.0.1:8000
```

### Frontend öffnen
```bash
# Minimal: index.html im Browser öffnen
# Oder mit Vite:
cd frontend
npm install
npm run dev
```

---

## 📝 Beispielprojekt: Heartroot City

**Datei**: `examples/heartroot_demo_lite_project.json`

Eine vereinfachte Demo-Welt mit:
- ✅ Ausgefülltem T0 (Canon & Constraints)
- ✅ Ausgefülltem T1 (Core Card)
- ✅ Grundlagen für T2–T5 (Platzhalter)

**Zweck**: Zeigt, wie das Datenmodell in der Praxis aussieht.

---

## 🔄 Weitere Komponenten

### space-invaders-game (unabhängig)
- Status: Fertige HTML/JS Game
- Unabhängig von World-OS Console
- Demonstration von Termux-Game-Entwicklung

---

## 🎯 Nächste Schritte (Phase B & C)

### Phase B: KI-Integration
- Agenten können neue Tier-Inhalte vorschlagen
- AGENTS.md definiert die KI-Governance
- Continue IDE-Integration für Code-Review

### Phase C: Studio-System
- Multi-Agent-Orchestrierung
- Narrative-Generation aus Tier-Daten
- Godot-Integration für prototyping

---

## 📚 Technologie-Stack Zusammenfassung

| Layer | Tech | Purpose |
|-------|------|----------|
| **Frontend** | React + Vite | UI für Daten-Verwaltung |
| **Backend** | FastAPI (Python 3) | REST API + Datenbank-Zugriff |
| **Storage** | JSON (Datei) | Persistenz (MVP-einfach) |
| **Schema** | JSON-Schema v1 | Validierung & Typ-Definition |
| **Orchester** | AGENTS.md | KI-Governance (optional) |

---

## 🔗 Repository-Links

- **Main Repo**: [github.com/Guevo8/termux-projects](https://github.com/Guevo8/termux-projects)
- **World-OS Console**: `termux-projects/world-os-console/`
- **Portal/Docs**: `termux-projects/world-os-console/portal/`

---

## 📋 Lizenz & Attribution

**World-OS Console** © 2025 Tobias Peters  
Lizenziert unter MIT License

---

*Dieses Dokument wurde generiert am 2025-12-06 als strukturierte Übersicht des World-OS Console Projekts.*