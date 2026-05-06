# NexaSphere Forms Submission Service (FastAPI)

FastAPI service that receives form submissions (membership, recruitment, core team application) and writes them to:
- Google Sheets (via Service Account)
- Supabase PostgREST REST API (service role key)

## Project Structure

```
server-python/
├── main.py
├── routers/
│   └── forms.py
├── services/
│   ├── sheets.py
│   └── supabase.py
├── models/
│   └── forms.py
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

1) Create a virtual environment (recommended):

```bash
python -m venv .venv
.scripts\activate
# or on PowerShell: .\ .venv\Scripts\Activate.ps1
```

2) Install dependencies:

```bash
pip install -r requirements.txt
```

3) Copy env file and configure:

```bash
cp .env.example .env
```

## Run

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /api/forms/membership`
- `POST /api/forms/recruitment`
- `POST /api/core-team/apply`
- `GET /health`

## Google Sheets

Expected worksheet/tab names inside `GOOGLE_SHEET_ID`:
- `Membership`
- `Recruitment`
- `CoreTeamApplications`

The appended row format is:
1. timestamp (ISO)
2. name
3. email
4. whatsapp
5. year
6. branch
7. section
8. reason (empty string if missing)

## Supabase Tables

This service inserts into the following tables:
- `membership_forms`
- `recruitment_forms`
- `core_team_applications`

The JSON payload sent is the same as the validated request body.

## Validation Rules (Pydantic v2)

- `email`: must be a valid email
- `whatsapp`: exactly 10 digits (`^\d{10}$`)
- `section`: exactly one uppercase letter (`^[A-Z]$`)
- `reason`: optional, max length 500

