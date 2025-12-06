# AGENTS.md – AI Governance für World-OS Console

**Version**: 1.1  
**Datum**: 2025-12-06  
**Projekt**: World-OS Console + AI-Dev-Orchestration

---

## 🎯 Zweck

Dieses Dokument definiert die **Governance-Regeln** für KI-Agenten (Claude, GPT, Copilot etc.), die am World-OS Console Projekt arbeiten.

Es ist der **"Arbeitsvertrag"** zwischen:
- **Layer 1 (Brain)**: Strategische Architekt:innen
- **Layer 2 (Agent)**: KI-Agenten (Claude, Copilot)
- **Layer 3 (Control)**: Review & QA (Continue IDE, Human Review + GitHub Actions)

---

## 📋 Kontext: Das Projekt

**Name**: World-OS Console  
**Typ**: Web-App für strukturierte Welt-Verwaltung  
**Tech-Stack**: FastAPI (Backend) + React (Frontend) + JSON (Storage)  
**CI/CD**: GitHub Actions (Backend QA automated)  
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
| **QA-Analyst** | Liest GitHub Actions Logs, erstellt Reports | Claude, Perplexity, Continue | Verwendet qa-report-template.md |

---

## ✅ Definition of Done (DoD)

### Für Backend-Tickets

- [ ] Code folgt PEP 8 (Python)
- [ ] `./scripts/test_all.sh` läuft ohne Fehler
- [ ] Keine Linter-Fehler (pylint/flake8)
- [ ] Neue Endpunkte haben Tests
- [ ] `backend/data/projects.json` bleibt gültig nach der Änderung
- [ ] **GitHub Actions Backend QA passt** (grün in Actions UI)
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
- .github/workflows/ (nur mit explizitem Arch-Approval)
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

## 🔄 Workflow: Agent → GitHub Actions → Review → Merge

### Phase 1: Agent arbeitet lokal

```
1. Create Feature Branch: git checkout -b feature/DESCRIPTION
2. Implement Feature
3. Run ./scripts/test_all.sh (lokal)
4. Commit mit aussagekräftiger Message
5. Push zu GitHub
```

### Phase 2: GitHub Actions QA (automatisch)

```
1. Backend QA Workflow triggt auf Push
2. Python 3.11 Setup
3. Dependencies installieren
4. Tests ausführen (./scripts/test_backend.sh)
5. Security-Checks (./scripts/security_backend.sh)
6. Artefakt erstellen: backend-qa-summary/latest-run.txt

Status in GitHub UI: grün (pass) / gelb (warning) / rot (fail)
```

### Phase 3: QA-Analyse (KI-Agent oder Human)

```
1. QA-Agent liest:
   - GitHub Actions Logs
   - Artifact: latest-run.txt
   - portal/AGENTS.md (Governance)

2. QA-Agent erstellt Report (qa-report-template.md):
   - Test-Fehler kategorisiert
   - Security-Warnings priorisiert
   - Recommendations (High/Medium/Low)
   - Next Steps für Developer & KI

3. Report geht an Developer oder neuen PR-Comment
```

### Phase 4: Continue IDE / Local Review

```
1. Continue IDE (als Code-Reviewer):
   - Liest Code + QA-Report
   - Checkt gegen DoD
   - Gibt Feedback inline
2. Agent passt an (wenn nötig)
3. Neuer Push → GitHub Actions läuft erneut
```

### Phase 5: Human Review & Merge

```
1. Maintainer checkt:
   - GitHub Actions Status (muss grün sein)
   - QA-Report (keine kritischen Issues)
   - DoD erfüllt?
2. Merge zu main
```

---

## 📔 GitHub Actions: Backend QA Workflow

### Trigger

Workflow läuft automatisch bei:
- Push zu `world-os-console/backend/**`
- Push zu `world-os-console/scripts/**`
- Update von `world-os-console/portal/AGENTS.md`
- Opt.: täglich um 05:00 UTC

**Workflow-Datei**: `.github/workflows/backend-qa.yml`

### Artifacts & Logs

Nach jedem Run:
- **Logs**: GitHub Actions UI (Actions tab)
- **Artifacts**: `backend-qa-summary/latest-run.txt` (download)
- **Status Badge**: Grn/Rot in Commit-Details

### Beispiel-Prompt für QA-Agents

```
Lies portal/AGENTS.md + GitHub Actions Run #123:

1. Lade artifact: backend-qa-summary/latest-run.txt
2. Lese test output aus GitHub Logs
3. Erstelle strukturierten Report (qa-report-template.md)
4. Format:
   - Summary-Tabelle (Tests/Security/Lint)
   - Passed: (Liste bestandener Tests)
   - Warnings: (priorisierte Issues)
   - Recommendations: (High/Med/Low)
   - Next Steps: (für Developer + KI-Agenten)
```

---

## 🌤️ Kommunikation

### Wenn Agent unsicher ist:

1. **In Commit-Message fragen**: `[QUESTION] Wie soll T2-Modul-Validierung funktionieren?`
2. **Oder PR-Comment**: Detaillierte Frage mit Kontext
3. **Oder Ticket updaten**: Link zu GitHub Actions Log

### Wenn Agent Fehler findet:

1. **Fehlerbericht**: `[BUG] Schema erlaubt ungültige T3-Characters`
2. **Mit Reproduzierer**: Konkretes Beispiel + erwartetes Verhalten
3. **Mit Link**: Link zur fehlgeschlagenen Action oder Code-Zeile

### Wenn GitHub Actions failed:

1. **Check Logs**: GitHub Actions UI → Step-Details
2. **Download Artifact**: latest-run.txt
3. **Lokal reproduzieren**: `./scripts/test_backend.sh` in world-os-console/
4. **Issue erstellen**: Mit Error-Output + Commit-Link

---

## 📊 Prioritäten (für Multi-Ticket-Szenarien)

| Priorität | Typ | Beispiel |
|-----------|-----|----------|
| **P0 – KRITISCH** | Bugs die App brechen | API-Endpoint 500er Error, GitHub Actions failed |
| **P1 – HOCH** | Features für MVP | T2-Module CRUD-Endpunkte |
| **P2 – MITTEL** | Verbesserungen | Performance-Optimierung, Code-Refactor |
| **P3 – NIEDRIG** | Nice-to-Have | UI-Polish, Doku-Updates |

---

## 🔮 Zünftige Agenten-Features

### Phase B (geplant): KI-Assistenz

- Agenten können Lore-Inhalte für T2–T5 vorschlagen
- Auto-Generierung von Character-Beschreibungen aus T0/T1
- Schema-Validierung in Echtzeit
- **QA-Report-Auto-Generation** (KI liest Logs, erstellt Reports)

### Phase C (Vision): Multi-Agent-Studio

- Mehrere Agenten arbeiten parallel
- Voting auf Breaking-Change Proposals
- Automatische Narrative-Generation
- GitHub Actions führt komplexere Checks aus (Migrations, Visual-Regression, etc.)

---

## 📞 Support & Eskalation

| Problem | Anlaufstelle |
|---------|---------------|
| Code-Frage | GitHub PR Comments |
| Schema-Frage | Issue mit Label `schema` |
| Test-Fehler | Run `./scripts/debug.sh` + Screenshot |
| GitHub Actions Fail | Check Artifact + Log, dann Issue |
| Großer Change | Öffne `DISCUSSION` Issue vorher |

---

## 🎆 Best Practices für Agenten

✅ **DO**:
- Schreib Tests ZUERST (TDD-Style)
- Nutze beschreibende Variablennamen
- Kommentiere schwierige Logik
- Mache kleine, fokussierte Commits
- Lese und aktualisiere Doku
- **Warte auf GitHub Actions zu grün wird bevor du PR nennst**

❌ **DON'T**:
- Ändere nicht mehrere Concerns in einem Commit
- Nutze keine globalen Variablen
- Ignorierer Test-Fehler oder GitHub Actions Status
- Committe API-Keys oder Secrets
- Erstelle Code-Duplikate (DRY-Prinzip)
- **Force-Merge bei fehlgeschlagener CI**

---

## 📝 Versionierung & Changelog

- **Schema-Versionen**: `world_os_project_schema_vX.json` (Major nur mit Breaking Changes)
- **API-Versioning**: Kommt in Phase B, dann `/api/v1/`, `/api/v2/`
- **Changelog**: `CHANGELOG.md` wird mit jedem Release aktualisiert
- **AGENTS.md**: Diese Datei wird mit jeder CI/Workflow-Änderung aktualisiert

---

## 🎓 Referenzen & Links

- **Repo**: [github.com/Guevo8/termux-projects](https://github.com/Guevo8/termux-projects)
- **World-OS Console**: `world-os-console/`
- **Schema Docs**: `schema/world_os_project_schema_v1.json`
- **Backend API**: `backend/app/main.py`
- **CI Workflow**: `.github/workflows/backend-qa.yml`
- **QA Report Template**: `world-os-console/portal/qa-report-template.md`
- **Overview**: `world-os-console/portal/overview.md`

---

**Letzte Aktualisierung**: 2025-12-06 (CI/CD Integration hinzugefügt)  
**Autor**: Tobias Peters (Architect)  
**Status**: Active for MVP Phase

*Feedback? Update diese Datei über PR mit Label `[docs] Update AGENTS.md`*