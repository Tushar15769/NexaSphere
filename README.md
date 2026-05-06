# NexaSphere — GL Bajaj's Student-Driven Tech Ecosystem

A modern, animated single-page React application for NexaSphere, the official student tech community of GL Bajaj Group of Institutions, Mathura.

---

## Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | [nexasphere.vercel.app](https://nexasphere.vercel.app) |
| **GitHub Pages** | [ayushh-sharmaa.github.io/NexaSphere-NSOC](https://ayushh-sharmaa.github.io/NexaSphere-NSOC) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Styling | Vanilla CSS — design token system via CSS custom properties |
| Animations | CSS keyframes + custom React motion hooks |
| Forms | Google Apps Script → Google Sheets backend |
| Deployment | Vercel (primary) + GitHub Pages |
| Package Manager | npm |

---

## Features

- **Cinematic opening** — glass-shatter intro sequence with letter-by-letter type-in
- **Dark / Light theme** — system-aware with `localStorage` persistence, toggled via sun/moon button in navbar
- **Wine-Red brand system** — full `#CC1111` palette replacing legacy blue/purple
- **Aurora night layer** — Apple 2027-inspired prismatic ambient dark mode (breathing aurora blobs, iridescent card borders, conic logo halo)
- **Glassmorphism** — fully transparent frosted-glass navbar + backdrop-blur on all cards, banners, modals
- **Motion layer** — parallax, magnetic buttons, 3D card tilt, scroll reveals, particle background, geometric grid
- **Custom cursor** — magnetic hover with glow trail
- **Pages**: Home, Activities, Events, About, Team, Contact, Core Team Recruitment, Membership Application, Admin

---

## Pages & Navigation

| Route / State | Component | Description |
|---------------|-----------|-------------|
| `Home` | `HeroSection` + sections | Landing with hero, activities, events, about, team |
| `Activities` | `ActivitiesPage` | All activity cards |
| Activity detail | `ActivityDetailPage` | Per-activity deep-dive with events list |
| `Events` | `EventsPage` | KSS and all events |
| Event detail | `EventDetailPage` | Individual event page |
| `About` | `AboutPage` | Club mission, stats, timeline |
| `Team` | `TeamPage` | Core team member cards + modal bios |
| `Contact` | `ContactPage` | Social links and contact form |
| `apply` (type) | `RecruitmentPage` | Core Team application form → Google Sheets |
| `join` (type) | `MembershipPage` | Membership application form → Google Sheets |
| `Admin` | `AdminPage` | Internal admin panel (hash-gated) |

All navigation is handled via the `page` state in `App.jsx` with animated wipe transitions.

---

## Project Structure

```
src/
├── assets/images/logos/      # Brand logos (nexasphere-logo.png, glbajaj-logo.png)
├── data/                     # Activities, events, team data
│   ├── activities/           # Per-activity JS data files + index.js
│   └── eventsData.js         # KSS events data
├── pages/
│   ├── home/                 # HeroSection.jsx
│   ├── activities/           # ActivitiesPage, ActivitiesSection, ActivityDetailPage
│   ├── events/               # EventsPage, EventsSection, EventDetailPage
│   ├── about/                # AboutPage, AboutSection
│   ├── team/                 # TeamPage, TeamSection, TeamMemberCard, TeamMemberModal
│   ├── contact/              # ContactPage
│   ├── recruitment/          # RecruitmentPage (Core Team form)
│   ├── membership/           # MembershipPage (Membership form)
│   └── admin/                # AdminPage
├── shared/                   # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CinematicOpening.jsx
│   ├── ParticleBackground.jsx
│   ├── GeometricGridBackground.jsx
│   ├── MotionLayer.jsx       # All motion hooks (parallax, reveals, cursor, scroll)
│   ├── StormOverlay.jsx
│   └── Icons.jsx
└── styles/
    ├── themes.css            # CSS custom property tokens (dark + light)
    ├── globals.css           # Body, typography, scrollbar, utility classes
    ├── components.css        # All component styles
    ├── animations.css        # @keyframes library
    ├── aurora.css            # Dark mode prismatic night layer
    └── motion.css            # Motion layer CSS
```

---

## Brand Design System

### Color Tokens (CSS custom properties)

| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| `--bg` | `#050508` | `#FFFFFF` | Page background |
| `--card` | `#0C0C11` | `#FFFFFF` | Card/surface background |
| `--c1` | `#CC1111` | `#BB0F0F` | Primary brand red |
| `--c2` | `#EE2222` | `#DD2020` | Highlight red |
| `--c4` | `#880000` | `#880000` | Deep wine red |
| `--t1` | `#F0F0F0` | `#1A1A1A` | Primary text |
| `--t2` | `#A8A8A8` | `#4A4A4A` | Secondary text |

### Fonts

| Font | Usage |
|------|-------|
| `Orbitron` | Headings, brand name, cinematic opener |
| `Rajdhani` | Navigation, labels, body |
| `Space Mono` | Taglines, code-style text |
| `Inter` | Form inputs, general body |

### Theme Toggle
- Stored in `localStorage` key `ns-theme`
- Applied via `data-theme="light"` on `<html>` element (default dark)
- Transitions on all surfaces: `0.42s cubic-bezier(.4,0,.2,1)`

---

## Forms & Backend

### Core Team Recruitment
- **Component**: `RecruitmentPage.jsx`
- **Endpoint**: Google Apps Script web app
- **Destination**: Google Sheets — Core Team Applications
- **Fields**: Name, Email, Phone, Branch, Year, Section, Domain, Motivation, Skills, LinkedIn, Portfolio
- **Trigger**: "Apply for Core Team" button on HeroSection / TeamPage

### Membership Application
- **Component**: `MembershipPage.jsx`
- **Endpoint**: Google Apps Script web app
- **Destination**: Google Sheets — Membership Applications
- **Fields**: Name, Email, Phone, Branch, Year, Section, Skills, Why join
- **Trigger**: "Join as Member" button on HeroSection

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Deployment

### Vercel (Primary)
The project auto-deploys from the `main` branch via Vercel GitHub integration.

```bash
# Manual deploy
npx vercel --prod
```

### GitHub Pages
Configured via `.github/workflows/` — auto-deploys on push to `main`.

---

## Environment Variables

No environment variables are required for the frontend.  
Google Apps Script endpoints are hardcoded in the form components (public web app URLs).

---

## Active Branch

| Branch | Purpose |
|--------|---------|
| `main` | Production — deployed to Vercel + GitHub Pages |
| `feat/brand-rebrand-wine-red` | Current — wine-red rebrand + aurora night layer |

**Current PR**: `feat/brand-rebrand-wine-red` → `main`

---

## Changelog (Recent)

### feat/brand-rebrand-wine-red
- Full wine-red brand identity (`#CC1111`) replacing blue/purple
- Dark / light theme toggle with `localStorage` persistence
- Aurora night layer — prismatic dark mode ambient (breathing blobs, iridescent card borders, conic logo halo)
- Fully transparent glassmorphism navbar (`blur(42px)`) across all pages
- Global frosted-glass backdrop on all cards, banners, modals
- Hero logo: 116px → 210px; Navbar logo: 38px → 58px
- Cinematic opening tagline: fixed color + size (now visible in dark mode)
- Stripped all CSS/JSX comments — 509 lines removed across 33 files
- Fixed UTF-8 BOM on all source files (caused symbol corruption in forms)
- Unified background system: all pages use `var(--bg)` CSS token

---

## Contributors

| Name | Role |
|------|------|
| Ayush Sharma | Founder & Lead Developer |
| Core Team | NexaSphere NSOC |

---

*NexaSphere — Connecting GL Bajaj's Tech Ecosystem*
