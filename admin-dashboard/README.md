# NexaSphere Admin Dashboard

Standalone admin application for managing NexaSphere community content and events.

---

## 📋 Overview

Separate React + Vite application providing admin interface for:

- Event management (create, read, update, delete)
- Activity event management (8 categories)
- Core team member management
- Real-time UI updates with event-driven architecture
- Role-based access control (admin authentication)

**Frontend:** React 18 + Vite 5  
**Backend:** Java Spring Boot API  
**Hosting:** Vercel (separate deployment)  
**Port (Dev):** 5174

---

## ⚙️ Installation

### Prerequisites

- Node.js 20+
- npm or yarn

### Install Dependencies

```bash
cd admin-dashboard
npm install
```

---

## 🚀 Running Locally

### Development Server

```bash
npm run dev
```

Application starts on `http://localhost:5174`

**Features:**

- Hot reload on code changes
- Vite dev server
- Source maps enabled

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🔑 Environment Variables

Create `.env.local` file in `admin-dashboard/` directory:

```bash
# API Configuration
VITE_API_BASE=http://localhost:8080

# Optional: Analytics, monitoring, etc.
VITE_ENVIRONMENT=development
```

### For Production

```bash
# .env.production
VITE_API_BASE=https://your-java-backend-url.railway.app
VITE_ENVIRONMENT=production
```

---

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── pages/                        # Page components
│   │   ├── LoginPage.jsx            # Admin login
│   │   ├── DashboardPage.jsx        # Main dashboard
│   │   ├── EventsPage.jsx           # Event management
│   │   ├── ActivitiesPage.jsx       # Activity events
│   │   ├── TeamPage.jsx             # Core team management
│   │   └── NotFoundPage.jsx         # 404 page
│   ├── components/                   # Reusable components
│   │   ├── EventForm.jsx            # Create/edit event form
│   │   ├── ActivityEventForm.jsx    # Activity event form
│   │   ├── TeamMemberForm.jsx       # Team member form
│   │   ├── DataTable.jsx            # Generic data table
│   │   ├── Modal.jsx                # Modal component
│   │   └── Sidebar.jsx              # Navigation sidebar
│   ├── services/
│   │   ├── apiClient.js             # API request handler
│   │   ├── authService.js           # Authentication
│   │   ├── eventService.js          # Event API calls
│   │   ├── activityService.js       # Activity API calls
│   │   └── teamService.js           # Team API calls
│   ├── hooks/
│   │   ├── useAuth.js               # Authentication hook
│   │   ├── useEvents.js             # Events data hook
│   │   ├── useActivities.js         # Activities data hook
│   │   └── useTeam.js               # Team data hook
│   ├── styles/
│   │   ├── globals.css              # Global styles
│   │   ├── dashboard.css            # Dashboard styles
│   │   └── forms.css                # Form styles
│   ├── App.jsx
│   ├── main.jsx
│   └── index.html
├── package.json
├── vite.config.js
├── .env.local
├── .env.example
└── README.md
```

---

## 🔐 Authentication

### Login

Admin credentials:

- **Email:** `nexasphere@glbajajgroup.org`
- **Password:** `Admin@123`

### Request Flow

1. User enters credentials on login page
2. Client sends POST request to `/api/admin/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token included in Authorization header for protected requests

---

## 📊 Features

### Event Management

- **List Events:** View all community events with filters and pagination
- **Create Event:** Add new event with date, description, location
- **Edit Event:** Modify event details
- **Delete Event:** Remove events with confirmation

### Activity Event Management

Manage events for 8 activity categories:

- Hackathon
- Codathon
- Ideathon
- Promptathon
- Workshop
- Insight Session
- Open Source Day
- Tech Debate

Each activity has:

- Event creation form
- Event listing with filter/sort
- Edit and delete functionality

### Core Team Management

- **Add Members:** Create core team member profiles
- **Edit Members:** Update member details, roles, contact info
- **Delete Members:** Remove members from team
- **View Members:** Display team member profiles

### Real-Time Updates

- Event-driven architecture
- No page reloads required
- Immediate UI updates on data changes
- WebSocket support (optional)

---

## 🔗 API Integration

### Authentication Endpoints

```
POST /api/admin/login              # Login and get JWT token
POST /api/admin/logout             # Logout
```

### Event Endpoints

```
GET    /api/admin/events           # List all events
POST   /api/admin/events           # Create event
PUT    /api/admin/events/{id}      # Update event
DELETE /api/admin/events/{id}      # Delete event
```

### Activity Endpoints

```
GET    /api/admin/activities/{key}/events     # Get activity events
POST   /api/admin/activities/{key}/events     # Create activity event
PUT    /api/admin/activities/{key}/events/{id} # Update
DELETE /api/admin/activities/{key}/events/{id} # Delete
```

### Team Endpoints

```
GET    /api/admin/core-team        # List team members
POST   /api/admin/core-team        # Create team member
PUT    /api/admin/core-team/{id}   # Update team member
DELETE /api/admin/core-team/{id}   # Delete team member
```

---

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Run with Coverage

```bash
npm run test:coverage
```

### Component Testing

```bash
npm run test:components
```

---

## 🚢 Deployment

### Vercel Deployment

#### Initial Setup

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Configure project:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variables:** Add `VITE_API_BASE`

#### Deploy Steps

1. Set environment variables in Vercel dashboard:

   ```
   VITE_API_BASE=https://your-java-backend-url.railway.app
   ```

2. Click "Deploy"

3. Vercel automatically deploys on push to main branch

### Environment Variables (Production)

```
VITE_API_BASE=https://nexasphere-api.railway.app
VITE_ENVIRONMENT=production
```

### Live URL

https://admin-nexasphere.vercel.app

---

## 🔄 Post-Deployment Checks

After deploying to Vercel:

1. **Verify API Connection**
   - Check browser console for API errors
   - Test login functionality
   - Verify data loading

2. **Check Environment**
   - Verify `VITE_API_BASE` is set correctly
   - Test cross-origin requests

3. **Performance**
   - Run Lighthouse audit
   - Check bundle size
   - Monitor Core Web Vitals

---

## 📝 Development Guidelines

### Code Quality

- ESLint configuration for code consistency
- Prettier for code formatting
- No console.log statements in production
- Meaningful component and function names

### Component Structure

```jsx
// Good component structure
export default function EventForm({ onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    // Handle input changes
  };

  const handleSubmit = (e) => {
    // Validate and submit
    onSubmit(formData);
  };

  return <form onSubmit={handleSubmit}>{/* Form JSX */}</form>;
}
```

### API Call Pattern

```javascript
// Use service layer for API calls
const response = await eventService.createEvent(eventData);
```

---

## 📝 Troubleshooting

### Build Errors

**Problem:** `Module not found` errors

- **Solution:** Run `npm install` and clear node_modules if needed

**Problem:** `Port 5174 already in use`

- **Solution:** Kill process on that port or use different port: `npm run dev -- --port 5175`

### API Connection Issues

**Problem:** `CORS error` from backend

- **Solution:** Check `VITE_API_BASE` environment variable

**Problem:** `401 Unauthorized` on protected routes

- **Solution:** Clear localStorage and re-login

### Deployment Issues

**Problem:** Blank page after deployment to Vercel

- **Solution:** Check build output, verify environment variables are set

**Problem:** API requests failing in production

- **Solution:** Verify backend URL in production environment variable

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication](https://jwt.io/introduction)
