# Technology Stack Analysis - Ori Platform

**Generated**: 2025-01-13
**Project**: Ori Platform (Microservices Monorepo)
**Scan Level**: Exhaustive

---

## Executive Summary

Ori Platform is a **polyglot microservices monorepo** built for scalability and modularity. The architecture consists of a unified Next.js frontend communicating with multiple specialized backend services, all managed through pnpm workspaces.

**Key Architecture Characteristics:**
- **Pattern**: Microservices with unified frontend
- **Repository**: Monorepo (pnpm workspaces)
- **Current Services**: 3 (Frontend, Core API, AI Engine)
- **Planned**: Extensible microservices architecture for future services
- **Database**: Supabase PostgreSQL (shared)
- **Deployment**: Vercel (frontend + core-api), Google Cloud Run (AI engine)

---

## Part 1: Frontend (Next.js Web Application)

**Location**: `/` (repository root)
**Type**: `web`
**Role**: Unified user interface for all microservices

### Core Technologies

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Framework** | Next.js | 16.0.1 | Latest App Router, React Server Components, optimal DX |
| **React** | React | 19.2.0 | Cutting-edge features, Server Components, concurrent rendering |
| **Language** | TypeScript | 5.9.3 | Type safety, enhanced IDE support, reduced runtime errors |
| **Build System** | Turbopack | Built-in | Next.js 16 default bundler, faster dev builds |
| **Package Manager** | pnpm | Workspace | Efficient disk usage, strict dependency resolution |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **TailwindCSS** | 3.4.18 | Utility-first styling, rapid UI development |
| **shadcn/ui** | Latest | Pre-built accessible components (Radix UI based) |
| **Radix UI** | Various | Unstyled, accessible component primitives |
| **next-themes** | 0.4.6 | Dark/light mode toggle (brand uses dark mode primary) |
| **Lucide React** | 0.553.0 | Icon library (consistent with brand's clean aesthetic) |

### State Management & Data Fetching

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Query** | 5.90.7 | Server state management, caching, optimistic updates |
| **React Hook Form** | 7.66.0 | Form state management, validation |
| **Zod** | 4.1.12 | Runtime type validation, schema validation |

### Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| **i18next** | 25.6.1 | Core i18n framework |
| **react-i18next** | 16.2.4 | React bindings for i18next |
| **i18next-browser-languagedetector** | 8.2.0 | Auto-detect user language |
| **i18next-http-backend** | 3.0.2 | Load translations dynamically |
| **DeepL API** | deepl-node 1.21.0 | Professional translation service |

**Supported Languages**: English, German, Spanish, French, Italian
**Translation Coverage**: 100% of user-facing pages

### Authentication & Backend Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase Client** | 2.80.0 | Auth, realtime, database access from frontend |
| **Stripe JS** | 8.3.0 | Payment processing (test mode active) |
| **@stripe/react-stripe-js** | 5.3.0 | React components for Stripe integration |

### PWA & Performance

| Technology | Version | Purpose |
|------------|---------|---------|
| **@ducanh2912/next-pwa** | 10.2.9 | Progressive Web App capabilities |
| **@vercel/analytics** | 1.5.0 | Web analytics |
| **@vercel/speed-insights** | 1.2.0 | Performance monitoring |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 4.0.8 | Unit testing (faster than Jest) |
| **@testing-library/react** | 16.3.0 | Component testing |
| **@testing-library/user-event** | 14.6.1 | User interaction simulation |
| **jsdom** | 27.1.0 | DOM environment for tests |

### Development Tools

- **ESLint** (9.39.1): Code linting with Next.js config
- **Prettier** (3.6.2): Code formatting with Tailwind plugin
- **TypeScript Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/*` for `./src/*`, `@ori/types` for shared types

### Architecture Pattern

**Pattern**: Component-based architecture with App Router
- **Pages**: `/src/app/` - File-system based routing
- **Components**: `/src/components/` - Reusable UI components
- **API Integration**: `/src/integrations/api/` - Backend API clients
- **Hooks**: `/src/hooks/` - React Query hooks for data fetching
- **Contexts**: `/src/contexts/` - React Context providers (Auth, UI state)
- **Styles**: Utility-first with Tailwind, component-specific styles co-located

**Key Design Decisions:**
1. **No Redux**: React Query handles server state, Context API for client state
2. **Server Components First**: Leverage React 19 Server Components for optimal performance
3. **Type-Safe API Layer**: All API calls typed with Zod schemas
4. **Dark Mode Primary**: Aligns with brand identity (cosmic/serene aesthetic)

---

## Part 2: Core API (Express.js Backend)

**Location**: `/services/core-api`
**Type**: `backend`
**Role**: Primary business logic, authentication, user management, Stripe integration

### Core Technologies

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Runtime** | Node.js | 20+ | LTS, stable, excellent ecosystem |
| **Framework** | Express.js | 4.19.2 | Mature, flexible, extensive middleware ecosystem |
| **Language** | TypeScript | 5.9.3 | Type safety for backend logic |
| **Module System** | NodeNext | ESM modules | Modern module resolution |

### Database & Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase Client** | 2.80.0 | PostgreSQL access, Auth, RLS policies |
| **Zod** | 4.1.12 | Request/response validation |

### Payment Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Stripe** | 16.12.0 | Subscription management, payment processing |

**Stripe Configuration:**
- **Mode**: Test mode active, production pending
- **Features**: Webhook handling, subscription lifecycle, customer management
- **Webhook Secret**: Raw body parsing before `express.json()` middleware (critical)

### API Architecture

| Technology | Version | Purpose |
|------------|---------|---------|
| **CORS** | 2.8.5 | Cross-origin resource sharing for frontend |
| **dotenv** | 16.4.5 | Environment variable management |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 30.2.0 | Unit and integration testing |
| **ts-jest** | 29.4.5 | TypeScript support for Jest |
| **Supertest** | 7.1.4 | HTTP assertion testing |

### Development Tools

- **tsx** (4.20.6): TypeScript execution and hot reload
- **TypeScript Strict Mode**: Enabled
- **Jest Setup**: Load env vars in `setupFiles` (not `setupFilesAfterEnv`)

### Architecture Pattern

**Pattern**: Layered API architecture
- **Routes**: `/src/routes/` - Express route handlers
- **Middleware**: Authentication, validation, error handling
- **Services**: Business logic layer
- **Integration**: Supabase for data, Stripe for payments

**Ports:**
- Development: 3001
- Deployment: Vercel serverless functions

**Key Design Decisions:**
1. **Service Role Key**: Uses Supabase service role for backend operations
2. **Webhook-First Stripe**: Raw body parsing for webhook signature verification
3. **`.js` Extensions**: Required for ES module compatibility
4. **Validation Layer**: Zod schemas for all endpoints

---

## Part 3: AI Engine (Python FastAPI)

**Location**: `/services/ai-engine`
**Type**: `backend`
**Role**: AI-powered features, semantic matching, skill analysis, recommendations

### Core Technologies

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| **Framework** | FastAPI | 0.115.0 | Modern async Python API framework, auto-docs |
| **Runtime** | Python | 3.11+ | Latest stable with performance improvements |
| **ASGI Server** | Uvicorn | 0.32.0 | High-performance async server |
| **Validation** | Pydantic | 2.9.0 | Data validation and settings management |

### AI & ML Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Sentence Transformers** | 3.1.0 | Semantic embeddings for job/skill matching |
| **OpenAI** | 1.51.0 | GPT models for conversational AI, content generation |
| **Anthropic** | 0.39.0 | Claude models for empathetic career guidance |
| **NumPy** | 1.26.4 | Numerical computing for embeddings |

**AI Model Strategy:**
- **Embeddings**: `all-MiniLM-L6-v2` (local, no API keys needed)
- **Generative**: OpenAI GPT-4 and Anthropic Claude for conversational features
- **Philosophy**: Local embeddings for cost efficiency, cloud LLMs for quality

### Backend Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.7.0 | Database access for user profiles, job data |
| **python-dotenv** | 1.0.1 | Environment configuration |
| **httpx** | 0.27.0 | Async HTTP client for external APIs |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| **pytest** | 8.3.0 | Python testing framework |
| **pytest-asyncio** | 0.24.0 | Async test support |
| **pytest-cov** | 5.0.0 | Code coverage reporting |

### Architecture Pattern

**Pattern**: Service-oriented async API
- **Main Entry**: `/main.py` - FastAPI application setup
- **Models**: Pydantic models for request/response validation
- **Services**: AI/ML logic, embedding generation, matching algorithms
- **Config**: Centralized configuration management

**Ports:**
- Development: 3002
- Deployment: Google Cloud Run (containerized)

**Key Design Decisions:**
1. **Async-First**: All operations async for high concurrency
2. **Local Embeddings**: Sentence Transformers run in-process (no external API calls)
3. **Graceful Degradation**: Core API works even if AI Engine is down
4. **Containerized**: Dockerized for consistent deployment

---

## Shared Infrastructure

### Database (Supabase PostgreSQL)

| Feature | Implementation |
|---------|----------------|
| **Provider** | Supabase Cloud |
| **Project ID** | zvngsecxzcgxafbzjewh |
| **Access** | Service role key (backend), anon key (frontend) |
| **Security** | Row Level Security (RLS) policies |
| **Schema** | Documented in `docs/CORE/CORE_DATABASE_SCHEMA.md` |

**Tables**: users, profiles, applications, recommendations, skills, etc.

### Monorepo Management

| Tool | Purpose |
|------|---------|
| **pnpm Workspaces** | Package management, dependency deduplication |
| **Turborepo** | Build orchestration (turbo.json) |
| **Shared Types** | `/shared/types/` - TypeScript types shared across services |

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Vercel                              │
│  ┌────────────────┐         ┌────────────────┐         │
│  │  Next.js       │         │  Core API      │         │
│  │  Frontend      │────────▶│  (Serverless)  │         │
│  │  Port: 3000    │         │  Port: 3001    │         │
│  └────────────────┘         └────────────────┘         │
└──────────────┬──────────────────────┬──────────────────┘
               │                      │
               │                      │
               ▼                      ▼
       ┌───────────────┐     ┌──────────────────┐
       │  AI Engine    │     │   Supabase       │
       │  (Cloud Run)  │     │   PostgreSQL     │
       │  Port: 3002   │     │   (Cloud)        │
       └───────────────┘     └──────────────────┘
               │                      ▲
               │                      │
               └──────────────────────┘
```

**Integration Points:**
- Frontend → Core API: REST API calls via `src/integrations/api/`
- Core API → AI Engine: HTTP calls for AI features
- All services → Supabase: Direct database access
- Frontend → Stripe: Client-side Stripe.js for payment UI
- Core API → Stripe: Server-side Stripe API for subscriptions

### CI/CD Pipeline

**Provider**: GitHub Actions (`.github/workflows/`)
**Triggers**: Push to `main`, PR to `main`
**Stages**:
1. Lint (ESLint for TS, pylint for Python)
2. Test (Vitest, Jest, pytest)
3. Build (Next.js, TypeScript compilation)
4. Deploy (Vercel for frontend/API, Cloud Run for AI Engine)
5. Database Migrations (Supabase migrations)

---

## Development Environment

### Prerequisites

- **Node.js**: 20+ (LTS)
- **pnpm**: Latest
- **Python**: 3.11+
- **Docker**: Optional (for AI Engine containerization)

### Environment Variables

**Frontend** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Core API** (`services/core-api/.env`):
```bash
PORT=3001
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
AI_ENGINE_URL=http://localhost:3002
```

**AI Engine** (`services/ai-engine/.env`):
```bash
PORT=3002
ENVIRONMENT=development
EMBEDDING_MODEL=all-MiniLM-L6-v2
LOG_LEVEL=INFO
CORE_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
```

### Local Development Commands

```bash
# Install all dependencies
pnpm install

# Run frontend (port 3000)
pnpm dev

# Run core API (port 3001)
pnpm dev:api
# or: pnpm --filter @ori/core-api dev

# Run AI engine (port 3002)
cd services/ai-engine
pip install -r requirements.txt
python main.py

# Run all tests
pnpm test                    # Frontend
pnpm --filter @ori/core-api test  # Core API
cd services/ai-engine && pytest   # AI Engine

# Linting and formatting
pnpm lint
pnpm format
```

---

## Architecture Patterns by Service

### Frontend Pattern: Component-Based with App Router

**Routing**: File-system based in `/src/app/`
- `/src/app/page.tsx` → Homepage (marketing)
- `/src/app/app/dashboard/page.tsx` → Dashboard (authenticated app)
- Subdomain routing: `getori.app` (marketing), `app.getori.app` (application)

**Data Flow**:
```
Component → useQuery Hook → API Client → Core API → Supabase
          ← React Query    ← Response  ← JSON     ← Data
```

### Core API Pattern: Express Middleware Pipeline

**Request Flow**:
```
Client Request
  → CORS Middleware
  → Authentication Middleware
  → Zod Validation
  → Route Handler
  → Business Logic
  → Supabase/Stripe
  → Response
```

### AI Engine Pattern: Async Service Layer

**Processing Flow**:
```
Request
  → FastAPI Endpoint
  → Pydantic Validation
  → Service Layer
    → Embedding Generation (local)
    → Semantic Search (vector similarity)
    → LLM Call (OpenAI/Anthropic)
  → Response
```

---

## Technology Decision Rationale

### Why Next.js 16?
- **App Router**: Modern routing with React Server Components
- **Performance**: Automatic code splitting, optimized bundles
- **DX**: Best-in-class developer experience
- **Deployment**: Seamless Vercel integration
- **SEO**: Server-side rendering for marketing pages

### Why Express for Core API?
- **Maturity**: Battle-tested, stable
- **Flexibility**: Minimal opinions, easy customization
- **Ecosystem**: Vast middleware ecosystem
- **TypeScript Support**: Excellent with modern ES modules

### Why FastAPI for AI Engine?
- **Async**: Native async/await for high concurrency
- **Performance**: One of the fastest Python frameworks
- **Type Safety**: Pydantic validation out of the box
- **Auto-Docs**: OpenAPI documentation generated automatically
- **ML Ecosystem**: Seamless integration with Python ML libraries

### Why Monorepo?
- **Code Sharing**: Shared types, utilities
- **Atomic Commits**: Changes across services in single commit
- **Unified Tooling**: Single lint, test, deploy pipeline
- **Developer Experience**: One repo to clone, understand, contribute to

### Why Microservices?
- **Scalability**: Scale services independently
- **Technology Flexibility**: Different languages for different use cases
- **Fault Isolation**: AI Engine can fail without affecting core functionality
- **Team Autonomy**: Future teams can own individual services

---

## Security & Best Practices

### Authentication
- **Supabase Auth**: JWT-based authentication
- **RLS Policies**: Database-level security
- **Service Role**: Backend services use elevated permissions responsibly

### API Security
- **CORS**: Properly configured origins
- **Validation**: Zod schemas on all endpoints
- **Rate Limiting**: (TODO: Implement if not present)
- **Webhook Verification**: Stripe webhook signatures validated

### Environment Management
- **Secrets**: Never committed to git
- **`.env.example`**: Template provided for developers
- **Production**: Environment variables managed in Vercel/Cloud Run

### Type Safety
- **TypeScript Strict Mode**: Enabled across all TS code
- **Shared Types**: Single source of truth in `/shared/types/`
- **Runtime Validation**: Zod for request/response validation

---

## Future Technology Considerations

### Planned Services (Microservices Vision)
- **Notification Service**: Email, push, in-app notifications
- **Analytics Service**: User behavior tracking, insights
- **Content Service**: Blog, learning resources, career guides
- **Matching Service**: Advanced job-candidate matching algorithms
- **Integration Service**: Third-party API integrations (LinkedIn, Indeed, etc.)

### Technology Candidates for Future Services
- **GraphQL Gateway**: Unified API layer over microservices
- **Redis**: Caching layer for performance
- **RabbitMQ/Kafka**: Message queue for service communication
- **Elasticsearch**: Full-text search for jobs, skills
- **Temporal**: Workflow orchestration for complex multi-step processes

---

## Performance Considerations

### Frontend Optimizations
- **Image Optimization**: Next.js Image component with WebP
- **Code Splitting**: Automatic route-based splitting
- **PWA**: Offline support, app-like experience
- **CDN**: Vercel Edge Network for global low latency

### Backend Optimizations
- **Connection Pooling**: Supabase client connection management
- **Caching**: (TODO: Implement Redis for frequently accessed data)
- **Async Operations**: AI Engine fully async for high concurrency

### Database Optimizations
- **Indexes**: Critical queries have database indexes
- **RLS Policies**: Efficient row-level security
- **Query Optimization**: (TODO: Analyze slow queries, add indexes)

---

## Monitoring & Observability

### Current Tools
- **Vercel Analytics**: Frontend performance, Core Vitals
- **Supabase Dashboard**: Database metrics, query performance
- **Console Logs**: Basic logging across services

### Recommended Additions
- **Sentry**: Error tracking across all services
- **Datadog/New Relic**: Full-stack APM
- **LogRocket**: Session replay for debugging user issues
- **Prometheus + Grafana**: Custom metrics and dashboards

---

## Conclusion

Ori Platform's technology stack is **modern, scalable, and strategically chosen** to support the product vision:

✅ **Frontend Excellence**: Next.js 16 + React 19 for cutting-edge UX
✅ **Backend Reliability**: Express.js for stable, flexible API
✅ **AI Sophistication**: Python FastAPI + ML stack for intelligent features
✅ **Type Safety**: TypeScript across frontend and core API
✅ **Monorepo Benefits**: Shared code, unified tooling
✅ **Microservices Ready**: Architecture supports future service expansion
✅ **Production-Grade**: Deployment pipeline, testing, type safety

The stack balances **innovation** (Next.js 16, React 19, FastAPI) with **stability** (Express, PostgreSQL, pnpm) to deliver a platform that can scale from startup to enterprise.

