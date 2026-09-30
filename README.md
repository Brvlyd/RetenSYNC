# RetenSYNC 🔄

RetenSYNC is a modern employee experience platform that helps HR teams and managers predict and prevent employee turnover. It combines performance tracking, feedback, goals, and engagement tools with ML-powered analytics in a single dashboard for both admins and employees.

## About

Employee turnover is expensive and often preventable — but only if the warning signs are visible before someone resigns. RetenSYNC brings together the day-to-day signals that predict attrition (performance reviews, 1-on-1s, feedback, goal progress, engagement surveys) into one platform, then layers ML-driven risk scoring and analytics on top so HR and managers can act early instead of reacting after the fact.

The platform ships with two experiences: an **Admin/HR console** for organization-wide analytics, department management, and performance oversight, and a **User portal** where employees track their own goals, give and receive feedback, join 1-on-1s, and engage with recognition and learning features.

## Features

### Admin / HR
- 📊 Organization dashboard & analytics (engagement heatmap, turnover risk trend)
- 🤖 ML-powered performance & attrition-risk predictions
- 🎯 Goal tracking and performance reviews
- 🗣️ Feedback, peer recognition, and shoutouts management
- 🤝 1-on-1 and HR interaction logs
- 🏢 Department management
- 👥 User management with role-based access (admin, hr, manager, user)

### Employee (User Portal)
- 📈 Personal dashboard, goals, and self-assessment
- 💬 Feedback, shoutouts, and peer recognition
- 🤝 1-on-1s and HR interactions
- 📋 Surveys
- 🎓 Learning resources
- 🙋 Profile management

### Platform
- 🔐 Role-based authentication with secure token storage (cookies + fallback)
- 🌗 Light/dark theme support
- 📱 Responsive, modern UI built on Radix UI + Tailwind CSS

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI, shadcn-style components
- **Charts**: Chart.js / Recharts
- **Forms & Validation**: React Hook Form, Zod
- **Auth**: Custom role-based auth (cookies + localStorage fallback)
- **State**: React Context (auth, theme)

## Prerequisites

- Node.js 18 or newer
- npm
- A running backend API (RetenSYNC's frontend expects a REST API — see Environment Variables below). A local/demo mode is also available for development without a live backend.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root (never commit this file):

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com/api
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_USE_LOCAL_API=true
```

Set `NEXT_PUBLIC_USE_LOCAL_API` according to whether you want to hit a real backend or use the app's built-in local/demo data.

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Authentication

RetenSYNC uses a role-based authentication system supporting `admin`, `hr`, `manager`, and `user` roles, with tokens stored in cookies (falling back to localStorage) and automatic expiration handling. A quick-login/demo mode is available for local development — see `AUTHENTICATION_SYSTEM_GUIDE.md` for setup details rather than hardcoding real credentials here.

Client-side role checks are for UX only; the backend API must validate every permission independently.

## Project Structure

```
retensync/
├── app/
│   ├── admin/            # Admin & HR console
│   │   ├── dashboard/, analytics/, ml-performance/
│   │   ├── goals/, feedback/, peer-recognition/, shoutout/
│   │   ├── performance-review/, hr-interactions/, 1on1/
│   │   ├── departments/, users/
│   ├── user/              # Employee portal
│   │   ├── dashboard/, goals/, feedback/, self-assessment/
│   │   ├── performance-review/, hr-interactions/, 1on1/
│   │   ├── shoutouts/, surveys/, learning/, profile/
│   ├── auth/              # Login, register, quick-login
│   └── api/               # Local API routes (register, departments)
├── components/            # UI components (admin, user layouts, shared UI)
├── contexts/              # Auth & theme context providers
├── lib/                   # API client, auth-token utils, security utils
├── hooks/                 # Custom hooks (e.g. useDepartments)
├── examples/              # Usage examples
└── public/ , assets/      # Static assets
```

## Security Notes

- Never commit `.env.local` or any real API tokens/credentials to the repository.
- Treat client-side role checks as UX-only; enforce authorization on the backend.
- Rotate any demo/test credentials before using this project against real employee data.
- Review `components/security` and `lib/security-utils.ts` before exposing the app publicly.

## Deployment

Configured for [Vercel](http://retensync.vercel.app/) via `vercel.json`. Set the same environment variables in the Vercel dashboard before deploying.
