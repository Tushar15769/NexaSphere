# NexaSphere Python Backend

FastAPI service for handling form submissions and integrating with Google Sheets and Supabase.

---

## 📋 Overview

Secondary backend service providing:

- Form submission processing (membership, recruitment, core team)
- Google Sheets integration for data storage
- Supabase database sync
- CORS support for frontend applications

**Runtime:** Python 3.11+  
**Framework:** FastAPI  
**ASGI Server:** Uvicorn  
**Port:** 8000

---

## ⚙️ Setup Virtual Environment

### Create Virtual Environment

```bash
cd server-python
python -m venv venv
```

### Activate Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

---

## 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

**Key Dependencies:**

- fastapi — Web framework
- uvicorn — ASGI server
- python-dotenv — Environment variable management
- google-auth — Google authentication
- google-cloud-sheets — Google Sheets API
- supabase — Supabase client
- pydantic — Data validation

---

## 🚀 Running Locally

### Development Server

```bash
uvicorn main:app --reload --port 8000
```

Application starts on `http://localhost:8000`

**Features:**

- Auto-reload on code changes
- Interactive API documentation at `/docs`
- ReDoc documentation at `/redoc`

### Production Server

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🔑 Environment Variables

Create `.env` file in `server-python/` directory:

```bash
# Google Cloud Setup
GOOGLE_PROJECT_ID=your-google-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id

# Supabase Setup
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,https://nexasphere-glbajaj.vercel.app

# Server Configuration
DEBUG=True
```

### Getting Credentials

#### Google Sheets Setup

1. Create Google Cloud project
2. Enable Sheets API
3. Create Service Account with JSON key
4. Share Google Sheet with service account email
5. Copy credentials to `.env`

#### Supabase Setup

1. Create Supabase project
2. Get project URL from dashboard
3. Get service role key from settings
4. Add to `.env`

---

## 📁 Project Structure

```
server-python/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── routers/
│   ├── __init__.py
│   └── forms.py            # Form submission endpoints
├── services/
│   ├── __init__.py
│   ├── sheets.py           # Google Sheets integration
│   └── supabase.py         # Supabase integration
├── models/
│   ├── __init__.py
│   └── forms.py            # Pydantic data models
└── README.md
```

---

## 🔗 API Endpoints

### Form Submission Endpoints

#### Membership Form

```
POST /api/forms/membership
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "9876543210",
  "year": "3rd",
  "branch": "Computer Science",
  "section": "A",
  "reason": "Interested in tech community"
}
```

Response: `{"id": 1, "status": "success"}`

#### Recruitment Form

```
POST /api/forms/recruitment
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "whatsapp": "9876543210",
  "year": "2nd",
  "branch": "Electronics",
  "section": "B",
  "reason": "Want to contribute to projects"
}
```

#### Core Team Application

```
POST /api/forms/core-team
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "whatsapp": "9876543210",
  "year": "4th",
  "branch": "IT",
  "section": "A",
  "reason": "Leadership and mentorship experience"
}
```

### Status Endpoints

```
GET  /api/health             # Health check
GET  /api/forms/status       # Forms service status
```

---

## 📊 Google Sheets Integration

### Sheet Structure

**Sheet 1: Membership Forms**

- Column A: Name
- Column B: Email
- Column C: WhatsApp
- Column D: Year
- Column E: Branch
- Column F: Section
- Column G: Reason
- Column H: Timestamp

**Sheet 2: Recruitment Forms**
(Same structure as Membership)

**Sheet 3: Core Team Applications**
(Same structure as Membership)

### Setting Up Google Sheets

1. Create Google Sheet with tabs for each form type
2. Add headers to first row
3. Share sheet with service account email
4. Add `GOOGLE_SHEET_ID` to `.env`

---

## 💾 Supabase Integration

### Supabase Tables

Create these tables in Supabase:

```sql
CREATE TABLE membership_forms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(10) NOT NULL,
  year VARCHAR(20) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  section VARCHAR(1) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE recruitment_forms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(10) NOT NULL,
  year VARCHAR(20) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  section VARCHAR(1) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE core_team_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(10) NOT NULL,
  year VARCHAR(20) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  section VARCHAR(1) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Testing

### Run Tests

```bash
pytest
```

### Run with Coverage

```bash
pytest --cov=. --cov-report=html
```

Coverage report: `htmlcov/index.html`

### Run Specific Test

```bash
pytest tests/test_forms.py::test_membership_form_submission
```

---

## 🚢 Deployment

### Railway Deployment

```bash
cd server-python
railway init
railway up
```

### Render Deployment

1. Connect GitHub repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port 8000`
4. Add environment variables from `.env`
5. Deploy

### Fly.io Deployment

```bash
fly auth login
fly launch
fly deploy
```

### Environment Variables (Production)

```
GOOGLE_PROJECT_ID=production-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=prod-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=[from-service-account-json]
GOOGLE_SHEET_ID=production-sheet-id
SUPABASE_URL=https://prod-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=production-key
CORS_ORIGIN=https://nexasphere-glbajaj.vercel.app,https://admin-nexasphere.vercel.app
DEBUG=False
```

---

## 📝 Troubleshooting

### Module Not Found Errors

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

- **Solution:** Activate virtual environment and run `pip install -r requirements.txt`

### Google Sheets Errors

**Problem:** `403 Forbidden` when accessing Sheet

- **Solution:** Share Google Sheet with service account email

**Problem:** `Invalid GOOGLE_SHEET_ID`

- **Solution:** Verify sheet ID from URL: `docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Connection Errors

**Problem:** `Connection refused` to Supabase

- **Solution:** Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env`

### CORS Issues

**Problem:** `CORS policy error` from frontend

- **Solution:** Check `CORS_ORIGIN` environment variable includes frontend URL

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Supabase Documentation](https://supabase.com/docs)
- [Pydantic Documentation](https://docs.pydantic.dev/)
