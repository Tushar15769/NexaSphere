# NexaSphere Java Backend

Spring Boot 3 REST API for NexaSphere community platform.

---

## 📋 Overview

Primary backend service providing:

- Event management (CRUD operations)
- Core team member management
- User form submissions handling
- Admin authentication
- Real-time data synchronization with frontend

**Runtime:** Java 17+  
**Framework:** Spring Boot 3  
**Build Tool:** Maven 3.8+  
**Database:** PostgreSQL (prod) / H2 (dev)  
**Port:** 8080

---

## 🛠️ Build Instructions

### Prerequisites

- Java 17 or higher
- Maven 3.8 or higher

### Build Project

```bash
cd server-java
mvn clean install
```

This command:

- Downloads dependencies
- Compiles source code
- Runs unit tests
- Creates executable JAR

---

## 🚀 Running Locally

### Development (H2 Database)

```bash
mvn spring-boot:run
```

Application starts on `http://localhost:8080`

### Production (PostgreSQL)

1. Set environment variables:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/nexasphere
export DB_DRIVER=org.postgresql.Driver
export DB_USER=postgres
export DB_PASS=yourpassword
```

2. Run application:

```bash
mvn spring-boot:run
```

---

## 🧪 Running Tests

### Run All Tests

```bash
mvn test
```

### Run with Coverage Report

```bash
mvn clean test jacoco:report
```

Coverage report: `target/site/jacoco/index.html`

### Run Verification

```bash
mvn verify
```

---

## 🔑 Environment Variables

### Required Variables

| Variable         | Description          | Example                                                       |
| ---------------- | -------------------- | ------------------------------------------------------------- |
| `ADMIN_EMAIL`    | Admin login email    | `nexasphere@glbajajgroup.org`                                 |
| `ADMIN_PASSWORD` | Admin login password | `Admin@123`                                                   |
| `CORS_ORIGIN`    | CORS allowed origins | `http://localhost:5173,https://nexasphere-glbajaj.vercel.app` |

### Database Variables

| Variable    | Description             | Dev Value                  |
| ----------- | ----------------------- | -------------------------- |
| `DB_URL`    | Database connection URL | `jdbc:h2:mem:nexaspheredb` |
| `DB_DRIVER` | Database driver class   | `org.h2.Driver`            |
| `DB_USER`   | Database username       | `sa`                       |
| `DB_PASS`   | Database password       | (empty)                    |

### Application Properties

Create `src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# H2 Database (Development)
spring.datasource.url=jdbc:h2:mem:nexaspheredb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# PostgreSQL (Production)
# spring.datasource.url=jdbc:postgresql://localhost:5432/nexasphere
# spring.datasource.driverClassName=org.postgresql.Driver
# spring.datasource.username=postgres
# spring.datasource.password=yourpassword

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# Admin Credentials
app.admin.email=nexasphere@glbajajgroup.org
app.admin.password=Admin@123

# CORS
app.cors.origin=http://localhost:5173,https://nexasphere-glbajaj.vercel.app

# Logging
logging.level.root=INFO
logging.level.org.nexasphere=DEBUG
```

---

## 📁 Project Structure

```
server-java/
├── src/
│   ├── main/
│   │   ├── java/org/nexasphere/
│   │   │   ├── NexaSphereApplication.java    # Spring Boot entry point
│   │   │   ├── controller/                   # REST endpoints
│   │   │   ├── service/                      # Business logic
│   │   │   ├── model/                        # JPA entities
│   │   │   ├── repository/                   # Data access layer
│   │   │   ├── config/                       # Configuration classes
│   │   │   ├── exception/                    # Custom exceptions
│   │   │   └── util/                         # Utility classes
│   │   └── resources/
│   │       ├── application.properties        # Application config
│   │       └── data.sql                      # Initial seed data
│   └── test/
│       └── java/org/nexasphere/
│           └── NexaSphereApplicationTests.java
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## 📊 Database Setup

### Development (H2)

H2 in-memory database automatically initializes on startup:

- Tables created via JPA entities
- Seed data loaded from `data.sql`
- No manual configuration needed

### Production (PostgreSQL)

1. Create database:

```bash
createdb nexasphere
```

2. Spring Boot creates tables automatically via:

```properties
spring.jpa.hibernate.ddl-auto=validate
```

3. Seed data loads from `data.sql` on first run

### Entity Models

- **Event:** Represents community events with dates and descriptions
- **ActivityEvent:** Activity-specific event entries
- **CoreTeamMember:** Core team member profiles
- **MembershipForm:** User membership applications
- **RecruitmentForm:** User recruitment applications
- **CoreTeamApplication:** Core team position applications

---

## 🔗 API Endpoints

### Public Endpoints (No Authentication)

#### Events

```
GET  /api/content/events              # List all events
GET  /api/content/events/{id}         # Get event details
GET  /api/content/activity-events/{activityKey}  # Events by activity
```

#### Core Team

```
GET  /api/content/core-team           # List all team members
GET  /api/content/core-team/{id}      # Get team member details
```

#### Forms

```
POST /api/forms/membership            # Submit membership form
POST /api/forms/recruitment           # Submit recruitment form
POST /api/core-team/apply             # Submit core team application
```

### Protected Endpoints (Admin Auth Required)

#### Events

```
POST   /api/admin/events              # Create new event
PUT    /api/admin/events/{id}         # Update event
DELETE /api/admin/events/{id}         # Delete event
```

#### Core Team

```
POST   /api/admin/core-team           # Create team member
PUT    /api/admin/core-team/{id}      # Update team member
DELETE /api/admin/core-team/{id}      # Delete team member
```

---

## 🔐 Authentication

### Admin Login

```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nexasphere@glbajajgroup.org","password":"Admin@123"}'
```

Response includes JWT token for subsequent requests.

### Using Token

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/admin/events
```

---

## 🚢 Deployment

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize Railway project
cd server-java
railway init

# Deploy
railway up
```

### Environment Variables (Production)

```
ADMIN_EMAIL=nexasphere@glbajajgroup.org
ADMIN_PASSWORD=Admin@123
CORS_ORIGIN=https://nexasphere-glbajaj.vercel.app,https://admin-nexasphere.vercel.app
DB_URL=jdbc:postgresql://[rail_host]:5432/railway
DB_DRIVER=org.postgresql.Driver
DB_USER=postgres
DB_PASS=[from-railway]
```

---

## 📝 Troubleshooting

### Build Issues

**Problem:** `Maven command not found`

- **Solution:** Install Maven and add to PATH

**Problem:** `Java 17 not found`

- **Solution:** Download Java 17+ from oracle.com or use OpenJDK

### Runtime Issues

**Problem:** `Connection refused on port 8080`

- **Solution:** Check if port 8080 is already in use; change in `application.properties`

**Problem:** `H2 console not accessible`

- **Solution:** Enable H2 console in `application.properties`:
  ```
  spring.h2.console.enabled=true
  ```

### Database Issues

**Problem:** `PostgreSQL connection failed`

- **Solution:** Verify PostgreSQL is running and credentials are correct

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Maven Guide](https://maven.apache.org/guides/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
