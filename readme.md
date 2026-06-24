# Incident Management System

A lightweight incident tracking application with a REST API backend and a web UI frontend.

---

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Backend  | Python 3.12 · FastAPI · SQLModel · SQLite · uv     |
| Frontend | Next.js 16 (App Router) · TypeScript · Tailwind CSS |

---

## Project Structure

```
incident-management/
├── backend/
│   ├── app/
│   │   ├── config.py         # App settings via pydantic-settings
│   │   ├── database.py       # SQLite engine + session dependency
│   │   ├── models.py         # SQLModel table (Incident) + enums
│   │   ├── schema.py         # Pydantic request/response schemas
│   │   └── routers/
│   │       └── incidents.py  # All incident API endpoints
│   ├── main.py               # FastAPI app entry point
│   ├── pyproject.toml        # uv dependencies
│   └── .env.example          # Environment variable template
└── frontend/
    ├── app/
    │   ├── page.tsx                   # Landing page
    │   ├── layout.tsx                 # Root layout
    │   └── incidents/
    │       ├── page.tsx               # Incident list (server component)
    │       ├── IncidentFilters.tsx    # Filter controls (client component)
    │       ├── new/page.tsx           # Create incident form
    │       └── [id]/page.tsx         # Incident detail + status update
    └── lib/
        ├── api.ts            # All backend fetch calls
        ├── helpers.ts        # Base fetch wrapper (apiFetch)
        ├── interfaces.ts     # TypeScript interfaces
        └── types.ts          # TypeScript type aliases
```

---

## Prerequisites

Make sure you have these installed before starting:

- **Python 3.12+** — check with `python --version`
- **uv** — Python package manager ([install guide](https://github.com/astral-sh/uv))
- **Node.js 18+** — check with `node --version`
- **Git**

---

## Backend Setup

Open a terminal and run these commands one by one.

**Step 1 — Navigate into the backend folder**
```bash
cd incident-management/backend
```

**Step 2 — Install dependencies with uv**
```bash
uv sync
```
This reads `pyproject.toml` and installs all packages into a `.venv` folder automatically. No need to create a virtual environment manually.

**Step 3 — Set up your environment file**
```bash
cp .env.example .env
```
Open `.env` and set the values:
```env
DEBUG=true
DATABASE_URL=sqlite:///./backend/incidents.db
CORS_ALLOWED_ORIGINS=["http://localhost:3000"]
```
> **Note on DATABASE_URL path:** The path is relative to where you run the server from. If you run from the project root use `sqlite:///./backend/incidents.db`. If you run from inside the `backend/` folder use `sqlite:///./incidents.db`.

**Step 4 — Start the backend server**

From the **project root** (`incident-management/`):
```bash
uv run --directory backend uvicorn backend.main:app --reload --port 8000
```

Or from inside the `backend/` folder:
```bash
uv run uvicorn main:app --reload --port 8000
```

**Step 5 — Verify it's running**

Open your browser and go to:
```
http://localhost:8000/api/docs
```
You should see the interactive Swagger UI with all available endpoints.

---

## Frontend Setup

Open a **new terminal** (keep the backend terminal running) and run:

**Step 1 — Navigate into the frontend folder**
```bash
cd incident-management/frontend
```

**Step 2 — Install dependencies**
```bash
npm install
```

**Step 3 — Check your environment file**

The `.env.local` file should already exist with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
If it doesn't exist, create it manually with that content.

**Step 4 — Start the frontend dev server**
```bash
npm run dev
```

**Step 5 — Open the app**
```
http://localhost:3000
```

---

## Running Both Together

You need **two terminals open at the same time**:

| Terminal | Command | URL |
|----------|---------|-----|
| Terminal 1 (backend) | `uv run uvicorn main:app --reload` | http://localhost:8000 |
| Terminal 2 (frontend) | `npm run dev` | http://localhost:3000 |

---

## API Reference

Base URL: `http://localhost:8000`
Interactive docs: `http://localhost:8000/api/docs`

### Current Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/incidents/` | List all incidents with optional filters |
| `POST` | `/api/incidents/` | Create a new incident |
| `GET` | `/api/incidents/{id}/` | Get full detail of a single incident |
| `PATCH` | `/api/incidents/{id}/status/` | Update the status of an incident |

### Query Parameters for `GET /api/incidents/`

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `severity` | string | `?severity=high` | Filter by severity level |
| `status` | string | `?status=open` | Filter by current status |
| `search` | string | `?search=database` | Search in title and description |
| `page` | integer | `?page=2` | Page number (default: 1) |
| `page_size` | integer | `?page_size=20` | Results per page (default: 10, max: 100) |

### Severity Levels

| Value | Meaning |
|-------|---------|
| `low` | Minor issue, no immediate impact |
| `medium` | Noticeable issue, limited impact |
| `high` | Significant issue affecting users |
| `critical` | Severe issue, major impact on production |

### Status Values

| Value | Meaning |
|-------|---------|
| `open` | Newly reported, not yet actioned |
| `in_progress` | Actively being worked on |
| `resolved` | Fix applied, monitoring |
| `closed` | Fully resolved and verified |

### Example Requests

**Create an incident:**
```bash
curl -X POST http://localhost:8000/api/incidents/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Database connection pool exhausted",
    "description": "Postgres is rejecting new connections under peak load.",
    "severity": "critical",
    "category": "database",
    "reporter_name": "Gaurav"
  }'
```

**List incidents filtered by severity and status:**
```bash
curl "http://localhost:8000/api/incidents/?severity=critical&status=open"
```

**Update incident status:**
```bash
curl -X PATCH http://localhost:8000/api/incidents/1/status/ \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

---

## Data Model

### Incident

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Auto-generated primary key |
| `title` | string (max 200) | Short summary of the incident |
| `description` | string | Full description of what happened |
| `severity` | enum | `low`, `medium`, `high`, `critical` |
| `status` | enum | `open`, `in_progress`, `resolved`, `closed` |
| `category` | enum (optional) | `database`, `network`, `authentication`, `third_party_api`, `infrastructure`, `other` |
| `reporter_name` | string (optional) | Name of the person reporting |
| `created_at` | datetime | Auto-set on creation (UTC) |
| `updated_at` | datetime | Auto-updated on every change (UTC) |

---

## Common Issues

**Backend won't start — `ModuleNotFoundError`**
Make sure you're running from the correct directory. The import paths depend on where you launch `uvicorn` from. Running from the project root requires `uvicorn backend.main:app`; running from inside `backend/` requires `uvicorn main:app`.

**Frontend shows "is the backend running?" error**
The backend isn't running or is on a different port. Check Terminal 1 and confirm you see `Uvicorn running on http://0.0.0.0:8000`.

**CORS error in the browser console**
Check that `CORS_ALLOWED_ORIGINS` in your backend `.env` includes `http://localhost:3000` exactly (no trailing slash).

**`uv: command not found`**
Install uv first:
```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Database file not found / table doesn't exist**
The DB is created automatically when the server starts for the first time. If you see this error, the server either hasn't started yet or the `DATABASE_URL` path in `.env` is wrong.

---

## Future Scope

### 1. AI-Assisted Incident Triage

The next planned enhancement is an AI triage layer powered by **LangChain + Groq** (free tier LLM) that activates before an incident is submitted.

**How it will work:**
- User fills in the title and description on the create form
- Clicks **"Get AI Suggestion"** before submitting
- Backend calls `POST /api/incidents/ai-suggest/` — this does NOT persist anything
- The LLM analyses the text using LangChain's structured output (`.with_structured_output` bound to a Pydantic schema) and returns:
  ```json
  {
    "suggested_severity": "critical",
    "suggested_category": "database",
    "reasoning": "Keywords indicate a production outage affecting core infrastructure.",
    "confidence": 0.91,
    "source": "ai"
  }
  ```
- Frontend shows this as an advisory chip: *"AI suggested: critical · database (91% confidence)"*
- User can **accept or override** before submitting — the AI never silently sets the value

**Why advisory and not automatic:** Severity directly affects who gets paged and how urgently. A wrong auto-assignment causes misrouting. The human stays in the loop.

**Heuristic fallback:** If `GROQ_API_KEY` is not set or the LLM call fails for any reason, the endpoint falls back to a deterministic keyword-matching heuristic — for example, words like "outage", "down", "data loss" map to `critical`; "typo", "cosmetic" map to `low`. The `source` field in the response tells you which path fired: `"ai"` or `"heuristic_fallback"`. The endpoint never returns a 500 on a missing key.

**New endpoint:**
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/incidents/ai-suggest/` | Returns severity + category suggestion, does not persist |

---

### 2. AI Incident Summary

A **"Generate Summary"** button on the incident detail page that produces a 2-3 sentence plain-English status update — useful for status pages or stakeholder updates.

**How it will work:**
- User opens an incident detail page and clicks **"Generate AI Summary"**
- Backend sends the incident's title, description, current status, and timestamps to the LLM
- Returns a plain-English paragraph, e.g.:
  > *"A database connection pool exhaustion was reported on June 21st affecting the checkout API. The engineering team identified the root cause as a misconfigured max-connections setting and applied a fix. The incident is currently resolved and being monitored for recurrence."*
- Summary is **persisted** to an `ai_summary` field so it doesn't regenerate on every page load
- A **"Regenerate"** button allows refreshing it after the status changes
- If no API key is set, the endpoint returns HTTP 503 with a clear message — it never silently fails

**New endpoint:**
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/incidents/{id}/ai-summary/` | Generates and persists a plain-English summary |

**New fields to be added to the Incident model:**

| Field | Type | Description |
|-------|------|-------------|
| `ai_suggested_severity` | enum (optional) | What the AI recommended at creation time, kept separately from the human-confirmed `severity` for audit comparison |
| `ai_summary` | string (optional) | Cached AI-generated plain-English summary |
| `ai_summary_generated_at` | datetime (optional) | When the summary was last generated |

---

### 3. Status Transition Validation

Currently any status can be set to any other value freely. A planned enhancement enforces meaningful transition rules so the audit trail stays coherent:

```
open        → in_progress, resolved, closed
in_progress → resolved, open, closed
resolved    → closed, open
closed      → open   (must reopen before progressing again)
```

Attempting an invalid transition — for example moving directly from `closed` to `resolved` — would return HTTP 400 with a clear message:
```json
{"detail": "Cannot move incident from 'closed' to 'resolved'."}
```

This prevents incidents from jumping states without being explicitly reopened, which keeps the history meaningful.

---

### 4. Seed Script for Sample Data

A standalone `seed.py` script to populate the database with realistic sample incidents across all severity and status combinations — useful for demos and manual testing without creating incidents by hand.

```bash
uv run python seed.py           # add 16 sample incidents (idempotent, no dupes)
uv run python seed.py --flush   # wipe existing incidents and reseed fresh
```

---

### 5. Dependencies Required for AI Features

Add the following to `pyproject.toml`:

```toml
dependencies = [
    ...
    "langchain",
    "langchain-groq",
]
```

Then add to your `.env`:
```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

Get a free Groq API key at [https://console.groq.com/keys](https://console.groq.com/keys).

> If `GROQ_API_KEY` is left blank, all AI endpoints automatically use the heuristic fallback — the app remains fully functional without it.