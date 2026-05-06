# NexaSphere Admin Dashboard

Standalone React admin panel for managing NexaSphere content.

## Setup

```bash
npm install
cp .env.example .env        # set VITE_API_BASE to your Java backend URL
npm run dev                 # runs on http://localhost:5174
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | Java backend URL (e.g. `https://api.nexasphere.in`) |

## Deployment (Vercel)

1. Create a new Vercel project pointing to the `admin-dashboard/` folder
2. Set `VITE_API_BASE` environment variable
3. Deploy — access via `admin.nexasphere-glbajaj.vercel.app`

Also add the admin dashboard URL to `CORS_ORIGIN` in the Java backend environment.

## Features

- Login with email/password → JWT stored in localStorage
- Events CRUD (create, edit, delete)
- Activity Events management per category (8 activity types)
- Core Team member add/remove
- Event-driven UI — no page reloads on mutations
- Skeleton loaders, toast notifications, confirm dialogs
- Auto-redirect to login on session expiry
