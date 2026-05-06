# NexaSphere — GL Bajaj Group of Institutions, Mathura

Official website and community platform for NexaSphere student community.

**🌐 Live Website:** https://nexasphere-glbajaj.vercel.app  
**🔑 Admin Dashboard:** https://admin-nexasphere.vercel.app  
**📧 Contact:** nexasphere@glbajajgroup.org

---

## 🚀 Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | React 18 + Vite 5                |
| Admin Dashboard  | React 18 + Vite 5 (separate app) |
| Primary API      | Java 17 + Spring Boot 3          |
| Forms Service    | Python 3.11 + FastAPI            |
| Database         | PostgreSQL (prod) / H2 (dev)     |
| Form Storage     | Google Sheets + Supabase         |
| Frontend Hosting | Vercel                           |
| Backend Hosting  | Railway / Render / Fly.io        |
| Fonts            | Orbitron · Rajdhani · Space Mono |

---

## 📁 Project Structure

```
nexasphere/
├── src/                                # Main website frontend
│   ├── pages/                         # Page components
│   │   ├── about/
│   │   ├── activities/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── events/
│   │   ├── home/
│   │   ├── membership/
│   │   ├── recruitment/
│   │   └── team/
│   ├── components/                    # Reusable components
│   ├── shared/                        # Shared utilities & layouts
│   ├── services/                      # API clients
│   ├── styles/                        # Global styles
│   ├── data/                          # Static data
│   ├── App.jsx
│   └── main.jsx
├── admin-dashboard/                   # Standalone admin app
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
├── server-java/                       # Spring Boot API
│   ├── src/main/java/org/nexasphere/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   ├── repository/
│   │   └── config/
│   ├── pom.xml
│   └── README.md
├── server-python/                     # FastAPI forms service
│   ├── routers/
│   ├── services/
│   ├── models/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── package.json
├── vite.config.js
├── index.html
├── netlify.toml
├── vercel.json
└── README.md
```

---

## 🛠️ Local Development

### Prerequisites

- **Node.js 20+** (for frontend)
- **Java 17+** (for primary API)
- **Maven 3.8+** (for building Java)
- **Python 3.11+** (for forms service)
- **PostgreSQL** (optional — H2 used by default in dev)

### 1. Frontend (Main Website)

```bash
cd nexasphere
npm install
npm run dev
```

Runs on `http://localhost:5173`

**Environment Variables (.env.local):**

```bash
VITE_API_BASE=http://localhost:8080
```

### 2. Java API Server

```bash
cd server-java
mvn clean install
mvn spring-boot:run
```

Runs on `http://localhost:8080`

**Environment Variables (application.properties or .env):**

```properties
ADMIN_EMAIL=nexasphere@glbajajgroup.org
ADMIN_PASSWORD=Admin@123
CORS_ORIGIN=http://localhost:5173,https://nexasphere-glbajaj.vercel.app
DB_URL=jdbc:h2:mem:nexaspheredb
DB_DRIVER=org.h2.Driver
DB_USER=sa
DB_PASS=
```

For PostgreSQL (production):

```properties
DB_URL=jdbc:postgresql://localhost:5432/nexasphere
DB_DRIVER=org.postgresql.Driver
DB_USER=postgres
DB_PASS=yourpassword
```

### 3. Python Forms Service

```bash
cd server-python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Runs on `http://localhost:8000`

**Environment Variables (.env):**

```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=http://localhost:5173,https://nexasphere-glbajaj.vercel.app
```

### 4. Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
```

Runs on `http://localhost:5174`

**Environment Variables (.env.local):**

```bash
VITE_API_BASE=http://localhost:8080
```

---

## 🌐 API Endpoints

### Public Endpoints (No Auth Required)

| Method | Endpoint                                   | Description                  |
| ------ | ------------------------------------------ | ---------------------------- |
| GET    | /api/content/events                        | List all events              |
| GET    | /api/content/activity-events/{activityKey} | List events for activity     |
| GET    | /api/content/core-team                     | List core team members       |
| POST   | /api/forms/membership                      | Submit membership form       |
| POST   | /api/forms/recruitment                     | Submit recruitment form      |
| POST   | /api/core-team/apply                       | Submit core team application |

### Protected Endpoints (Admin Auth Required)

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| POST   | /api/admin/events         | Create event            |
| PUT    | /api/admin/events/{id}    | Update event            |
| DELETE | /api/admin/events/{id}    | Delete event            |
| POST   | /api/admin/core-team      | Create core team member |
| PUT    | /api/admin/core-team/{id} | Update core team member |
| DELETE | /api/admin/core-team/{id} | Delete core team member |

---

## 🔐 Admin Dashboard

The admin dashboard is a **separate application** deployed independently from the main website.

**Access:** https://admin-nexasphere.vercel.app

**Login Credentials:**

- Email: `nexasphere@glbajajgroup.org`
- Password: `Admin@123`

### Features

- Manage events (create, edit, delete)
- Manage activity events for 8 categories
- Manage core team members
- Event-driven UI updates (no page reloads)
- Real-time change reflection

### Activity Categories

- Hackathon
- Codathon
- Ideathon
- Promptathon
- Workshop
- Insight Session
- Open Source Day
- Tech Debate

---

## 🚢 Deployment

### Frontend (Main Website)

**Platform:** Vercel

1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE=https://your-java-backend-url.railway.app`
5. Deploy

**Live URL:** https://nexasphere-glbajaj.vercel.app

### Admin Dashboard

**Platform:** Vercel (separate project)

1. Create new Vercel project from `admin-dashboard/` directory
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable:
   - `VITE_API_BASE=https://your-java-backend-url.railway.app`
5. Deploy

**Live URL:** https://admin-nexasphere.vercel.app

### Java Backend

**Platform:** Railway / Render / Fly.io

**Railway Deployment:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd server-java
railway init
railway up
```

**Environment Variables:**

```
ADMIN_EMAIL=nexasphere@glbajajgroup.org
ADMIN_PASSWORD=Admin@123
CORS_ORIGIN=https://nexasphere-glbajaj.vercel.app,https://admin-nexasphere.vercel.app
DB_URL=jdbc:postgresql://[railway-db-host]:5432/railway
DB_DRIVER=org.postgresql.Driver
DB_USER=postgres
DB_PASS=[from-railway-dashboard]
```

### Python Backend

**Platform:** Railway / Render / Fly.io

**Railway Deployment:**

```bash
cd server-python
railway init
railway up
```

**Environment Variables:** (Same as local .env)

---

## 📊 Database Setup

### Development (H2 In-Memory)

No setup required. Database auto-creates on application start.

### Production (PostgreSQL)

1. Create database:

```sql
CREATE DATABASE nexasphere;
```

2. Spring Boot will auto-create tables via JPA
3. Seed data loads automatically from `data.sql`

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

### Frontend

```bash
npm run test
npm run test:coverage
```

### Java Backend

```bash
mvn test
mvn verify
```

### Python Backend

```bash
pytest
pytest --cov
```

---

## 🤝 Contributing

This is an internal project for the NexaSphere core team at GL Bajaj Group of Institutions, Mathura.

### For Core Team Members

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes following code quality guidelines
4. Test thoroughly
5. Submit a pull request

### Code Quality Standards

- No console.log statements
- Functions under 40 lines
- Consistent naming conventions
- No unused imports
- Meaningful commit messages

---

## 📝 License

Internal project — GL Bajaj NexaSphere Core Team

---

## 📧 Contact

**Email:** nexasphere@glbajajgroup.org  
**Institution:** GL Bajaj Group of Institutions, Mathura  
**Website:** https://nexasphere-glbajaj.vercel.app

---

## 📌 Additional Documentation

For detailed information on specific components, please refer to:

- **[server-java/README.md](server-java/README.md)** — Java backend setup, build, deployment
- **[server-python/README.md](server-python/README.md)** — Python backend setup, Google Sheets & Supabase integration
- **[admin-dashboard/README.md](admin-dashboard/README.md)** — Admin dashboard installation and deployment

---

## 📋 Project Status Checklist


### Future Improvements

- **Screenshots & Visual Guide** — Add screenshots of key features in future iterations
- **Architecture Diagrams** — Add system architecture and data flow diagrams
- **API Documentation** — Integrate Swagger/OpenAPI documentation
- **Video Tutorials** — Create setup and deployment tutorial videos
- **Performance Metrics** — Document and track performance benchmarks

### Maintenance Notes

- **Update URLs** — Update all deployed URLs once production services are live
- **Keep READMEs Updated** — Update documentation as features change or new features are added
- **Version Management** — Maintain changelog for major updates
- **Dependency Updates** — Regularly review and update dependencies across all services
- **Security Reviews** — Conduct security audits and update credentials rotation policies


