# Architecture Quick Reference

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 + React 19 + TypeScript |
| Backend | Node.js 20 + Express.js |
| AI | Python 3.11 + FastAPI + Sentence-Transformers |
| Database | Supabase PostgreSQL |
| Deploy | Vercel (Frontend + API) + Cloud Run (AI) |

## Structure

```
ori-platform/
├── src/              # Next.js frontend (port 3000)
├── services/
│   ├── core-api/    # Express API (port 3001)
│   └── ai-engine/   # FastAPI AI (port 3002)
├── shared/          # Types & utils
└── supabase/        # DB migrations
```

## Data Flow

```
User → Frontend → Core API → Database
                     ↓
                 AI Engine (skills, matching, recommendations)
```

## Deployment

- **Vercel:** Frontend + Core API (automatic from `main` branch)
- **Cloud Run:** AI Engine (containerized Python service)
- **Supabase:** PostgreSQL database (managed)
