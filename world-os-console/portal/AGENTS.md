# AGENTS.md – AI Governance für World-OS Console

**Version**: 1.0  
**Datum**: 2025-12-06  
**Projekt**: World-OS Console + AI-Dev-Orchestration

---

## 🎯 Zweck

Dieses Dokument definiert die **Governance-Regeln** für KI-Agenten (Claude, GPT, Copilot etc.), die am World-OS Console Projekt arbeiten.

Es ist der **"Arbeitsvertrag"** zwischen:
- **Layer 1 (Brain)**: Strategische Architekt:innen
- **Layer 2 (Agent)**: KI-Agenten (Claude, Copilot)
- **Layer 3 (Control)**: Review & QA (Continue IDE, Human Review)

---

## 📋 Kontext: Das Projekt

**Name**: World-OS Console  
**Typ**: Web-App für strukturierte Welt-Verwaltung  
**Tech-Stack**: FastAPI (Backend) + React (Frontend) + JSON (Storage)  
**Status**: MVP-Phase (vor Multi-Agent-Integration)

**6-Tier Datenmodell**:
```
T0: Foundation (Canon, Constraints)
T1: Core Card (Logline, Setting, Conflict)
T2: Modules (Systems, Factions)
T3: Characters (R.A.C.E.-Lite)
T4: Zones (Locations)
T5: Narrative (Arcs, Quests)
```

---

## 🤖 Rollen für KI-Agenten

### Agent Rollen (nach Layer 2)

| Rolle | Aufgaben | Tools | Beschränkungen |
|-------|----------|-------|--------------------|
| **Architect** | Schema-Verbesserungen, Datenmodell-Design | JSON-Schema, Markdown | Keine Breaking Changes ohne Approval |
| **Developer** | Backend-Features, API-Endpunkte | Python, FastAPI, Git | Keine direkte Datenbankveränderung ohne Tests |
| **Tester** | Test-Schreiben, Validierung, QA | Python unittest, Pytest | Alle Tests müssen lokal laufen |
| **Documenter** | README, Guides, API-Docs | Markdown, OpenAPI | Keine Spekulation – nur Fakten |

---

## ✅ Definition of Done (DoD)

### Für Backend-Tickets

- [ ] Code folgt PEP 8 (Python)
- [ ] `./scripts/test_all.sh` läuft ohne Fehler
- [ ] Keine Linter-Fehler (pylint/flake8)
- [ ] Neue Endpunkte haben Tests
- [ ] `backend/data/projects.json` bleibt gültig nach der Änderung
- [ ] Commit-Nachricht: `[Area] Description` (z.B. `[backend] Add DELETE endpoint`)
- [ ] Mindestens ein Comment erklärt die Logik (schwierige Stellen)

### Für Frontend-Tickets

- [ ] React-Code folgt Best Practices (hooks, props)
- [ ] `npm run build` erfolgreich
- [ ] `npm run lint` hat keine Fehler
- [ ] Mindestens ein Testfall vorhanden
- [ ] Responsive Design (mobile-first)
- [ ] Commit-Nachricht: `[UI] Description`

### Für Schema/Datenmodell

- [ ] JSON-Schema ist valide (jsonschema-Validator grün)
- [ ] Beispiel in `examples/` aktualisiert
- [ ] Backward-Kompatibilität überprüft (alte Projekte laden noch)
- [ ] Doku aktualisiert (README, overview.md)
- [ ] Commit-Nachricht: `[schema] Description`

---

## 🚫 Regeln & Beschränkungen

### Für alle Agenten

1. **Kein direkter Datenzugriff ohne API**
   - ❌ Direktes Ändern von `projects.json`
   - ✅ Alle Änderungen gehen über `/projects` Endpunkte

2. **Tests sind Pflicht**
   - ❌ Feature ohne Tests
   - ✅ Feature + Test-Fall

3. **Ärgerliche Commits sind verboten**
   - ❌ `"fix"`, `"stuff"`, `"work in progress"`
   - ✅ `[backend] Fix T0 validation in tier model`

4. **Breaking Changes nur mit Approval**
   - Schema-Änderungen: Notify Architect
   - API-Endpoint-Löschung: Notify Maintainer

5. **Keine Secrets/Credentials in Code**
   - ❌ Passwörter, API-Keys, Email-Adressen
   - ✅ Umgebungsvariablen oder `.env` (gitignored)

---

## 📂 Pfade & Struktur

### Sichere Modifikationszonen

```
✅ SICHER (Agent darf modifizieren):
- backend/app/*.py (außer storage.py – Backend-Arch)
- frontend/src/*.jsx (neue Komponenten)
- backend/tests/*.py (neue Tests)
- docs/*.md (Dokumentation)
- schema/*.json (mit Vorsicht, siehe DoD)

⚠️  MIT VORSICHT (Notify Maintainer):
- backend/app/storage.py (Persistenz-Logik)
- backend/app/main.py (API-Endpunkt-Definition)
- schema/world_os_project_schema_v1.json (Datenmodell)

🔐 BLOCKIERT (Agent darf nicht ändern):
- .gitignore
- requirements.txt (nur wenn neue Dependency notwendig, dann PR)
- LICENSE
- backend/data/projects.json (generiert automatisch)
```

### Skript-Erzwingung

Agenten **müssen** diese Skripte nutzen:

```bash
# Alle Tests laufen
./scripts/test_all.sh

# Linting überprüfen
./scripts/lint.sh

# Code formatieren
./scripts/format.sh

# Build überprüfen
./scripts/build.sh
```

Falls Skripte nicht existieren → Ticket für Setup.

---

## 🔄 Workflow: Agent → Review → Merge

### Phase 1: Agent arbeitet

```
1. Create Feature Branch: git checkout -b feature/DESCRIPTION
2. Implement Feature
3. Run ./scripts/test_all.sh
4. Commit mit aussagekräftiger Message
5. Push zu GitHub
```

### Phase 2: Continue IDE Review

```
1. Continue IDE (als Reviewer):
   - Liest Code
   - Checkt gegen DoD
   - Gibt Feedback inline
2. Agent passt an (wenn nötig)
```

### Phase 3: Human Review & Merge

```
1. Maintainer checkt:
   - Passt zu Architektur?
   - Tests ok?
   - DoD erfüllt?
2. Merge zu main
```

---

## 🌤️ Kommunikation

### Wenn Agent unsicher ist:

1. **In Commit-Message fragen**: `[QUESTION] Wie soll T2-Modul-Validierung funktionieren?`
2. **Oder PR-Comment**: Detaillierte Frage mit Kontext
3. **Oder Ticket updaten**: Link zu Continue Review

### Wenn Agent Fehler findet:

1. **Fehlerbericht**: `[BUG] Schema erlaubt ungültige T3-Characters`
2. **Mit Reproduzierer**: Konkretes Beispiel + erwartetes Verhalten
3. **Mit Vorschlag**: Wenn Agent eine Lösung sieht

---

## 📊 Prioritäten (für Multi-Ticket-Szenarien)

| Priorität | Typ | Beispiel |
|-----------|-----|----------|
| **P0 – KRITISCH** | Bugs die App brechen | API-Endpoint 500er Error |
| **P1 – HOCH** | Features für MVP | T2-Module CRUD-Endpunkte |
| **P2 – MITTEL** | Verbesserungen | Performance-Optimierung |
| **P3 – NIEDRIG** | Nice-to-Have | UI-Polish, Doku-Updates |

---

## 🔮 Zünftige Agenten-Features

### Phase B (geplant): KI-Assistenz

- Agenten können Lore-Inhalte für T2–T5 vorschlagen
- Auto-Generierung von Character-Beschreibungen aus T0/T1
- Schema-Validierung in Echtzeit

### Phase C (Vision): Multi-Agent-Studio

- Mehrere Agenten arbeiten parallel
- Voting auf Breaking-Change Proposals
- Automatische Narrative-Generation

---

## 📞 Support & Eskalation

| Problem | Anlaufstelle |
|---------|--------------|
| Code-Frage | GitHub PR Comments |
| Schema-Frage | Issue mit Label `schema` |
| Test-Fehler | Run `./scripts/debug.sh` + Screenshot |
| Großer Change | Öffne `DISCUSSION` Issue vorher |

---

## 🎆 Best Practices für Agenten

✅ **DO**:
- Schreib Tests ZUERST (TDD-Style)
- Nutze beschreibende Variablennamen
- Kommentiere schwierige Logik
- Mache kleine, fokussierte Commits
- Lese und aktualisiere Doku

❌ **DON'T**:
- Ändere nicht mehrere Concerns in einem Commit
- Nutze keine globalen Variablen
- Ignorierer Test-Fehler
- Committe API-Keys oder Secrets
- Erstelle Code-Duplikate (DRY-Prinzip)

---

## 📝 Versionierung & Changelog

- **Schema-Versionen**: `world_os_project_schema_vX.json` (Major nur mit Breaking Changes)
- **API-Versioning**: Kommt in Phase B, dann `/api/v1/`, `/api/v2/`
- **Changelog**: `CHANGELOG.md` wird mit jedem Release aktualisiert

---

## 🎓 Referenzen & Links

- **Repo**: [github.com/Guevo8/termux-projects](https://github.com/Guevo8/termux-projects)
- **World-OS Console**: `world-os-console/`
- **Schema Docs**: `schema/world_os_project_schema_v1.json`
- **Backend API**: `backend/app/main.py`

---

**Letzte Aktualisierung**: 2025-12-06  
**Autor**: Tobias Peters (Architect)  
**Status**: Active for MVP Phase

*Feedback? Update diese Datei über PR mit Label `[docs] Update AGENTS.md`*