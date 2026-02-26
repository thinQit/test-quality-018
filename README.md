# test-quality-018

## Features
- Marketing landing page with hero section and CTA
- Embedded contact form with client-side validation
- Admin dashboard to view contact submissions
- Health endpoint for monitoring
- Toast notifications and global error handling

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- Jest + React Testing Library
- Playwright

## Prerequisites
- Node.js 18+
- npm 9+

## Quick Start
### macOS/Linux
```bash
bash install.sh
```

### Windows (PowerShell)
```powershell
./install.ps1
```

Then start the dev server:
```bash
npm run dev
```

## Environment Variables
Create a `.env` file from `.env.example`.

Required:
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_URL`

Optional/Recommended:
- `ADMIN_API_KEY`
- `NODE_ENV`
- `PORT`
- `SENTRY_DSN`

## Project Structure
```
src/
  app/                # App Router pages and route handlers
  components/         # Reusable UI components
  lib/                # Utilities and API helpers
  providers/          # React providers (auth, toast)
  types/              # Shared TypeScript types
prisma/               # Prisma schema and migrations
tests/                # Unit and e2e tests
```

## API Endpoints
- `GET /api/health` — Health check
- `POST /api/contacts` — Create contact submission
- `GET /api/contacts` — List contact submissions (admin)
- `GET /api/contacts/:id` — Get contact submission
- `DELETE /api/contacts/:id` — Delete submission

## Available Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build production
- `npm run start` — Start production
- `npm run lint` — Lint project
- `npm run test` — Unit tests
- `npm run test:e2e` — Playwright tests

## Testing
### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```
