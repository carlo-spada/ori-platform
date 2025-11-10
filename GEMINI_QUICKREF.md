# GEMINI QUICK REFERENCE CARD
> Research and planning commands. Fast lookups only.

## TASK MANAGEMENT (Same as Claude)
```bash
./scripts/task health         # Overview
./scripts/task list todo      # What's available
./scripts/task claim X         # Start work
./scripts/task complete X      # Finish work
```

## RESEARCH PATTERNS
```bash
# Find all implementations of pattern
grep -r "pattern" --include="*.ts" --include="*.tsx" src/

# Find file by name pattern
find . -name "*auth*" -type f | grep -v node_modules | head -20

# Check imports/dependencies
grep -r "import.*from" src/ | grep "@" | sort -u

# Find API endpoints
ls -la services/core-api/src/routes/*.js

# Check database schema
cat supabase/migrations/*.sql | grep "CREATE TABLE"
```

## PLANNING CHECKLIST
Before starting any task:
- [ ] Read task file in `.tasks/todo/[task-name].md`
- [ ] Search for existing similar implementations
- [ ] Check for related completed tasks in `.tasks/done/`
- [ ] Review relevant test files
- [ ] Create implementation plan with clear steps
- [ ] List acceptance criteria
- [ ] Identify potential risks/blockers

## CODEBASE MAP
```
ori-platform/
├── src/                    # Frontend (Next.js 16, port 3000)
│   ├── app/               # App Router pages
│   ├── components/        # React components + tests
│   ├── integrations/      # External services
│   │   ├── api/          # API client functions
│   │   └── supabase/     # Auth/DB client
│   ├── hooks/            # React Query hooks
│   └── contexts/         # React Context providers

├── services/
│   ├── core-api/         # Express backend (port 3001)
│   │   ├── routes/       # API endpoints (.js files)
│   │   ├── middleware/   # Auth, validation
│   │   └── __tests__/    # Jest integration tests
│   │
│   └── ai-engine/        # Python FastAPI (port 3002)
│       ├── src/          # AI processing logic
│       ├── tests/        # pytest tests
│       └── requirements.txt

├── shared/types/         # Shared TypeScript interfaces
│   └── src/
│       ├── index.ts      # Main type exports
│       ├── database.ts   # Supabase types
│       └── api.ts        # API contracts

├── supabase/
│   ├── migrations/       # SQL migration files
│   └── functions/        # Edge functions

├── .tasks/               # Task management
│   ├── todo/            # Available work
│   ├── in-progress/     # Current (max 5)
│   ├── done/            # Completed
│   └── backlog/         # Archived

└── .claude/              # AI agent configs
    ├── agents/          # Specialized agents
    └── mcp.json         # MCP servers
```

## INVESTIGATION COMMANDS
```bash
# Find route handlers
ls -la services/core-api/src/routes/

# Check what tables exist
grep "CREATE TABLE" supabase/migrations/*.sql | cut -d: -f2

# Find React Query hooks
grep -r "useQuery\|useMutation" src/hooks/

# Check env variables used
grep -r "process.env\|import.meta.env" . --include="*.ts" --include="*.tsx" --include="*.js"

# Find all test files
find . -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.test.js" | grep -v node_modules

# Check component structure
tree src/components -L 2 -d

# Find API integration points
grep -r "fetch\|axios" src/integrations/api/

# Analyze bundle size
ls -lah .next/static/chunks/*.js 2>/dev/null | sort -k5 -h
```

## COMMON QUESTIONS & ANSWERS
| Question | Answer | File/Location |
|----------|--------|---------------|
| Where's authentication? | AuthProvider context | `src/contexts/AuthProvider.tsx` |
| API base URL? | Environment variable | `src/integrations/api/client.ts` |
| Database types? | Generated from Supabase | `shared/types/src/database.ts` |
| Stripe webhooks? | Express route | `services/core-api/src/routes/stripe-webhook.js` |
| User profile hook? | React Query | `src/hooks/useProfile.ts` |
| Supabase client? | Singleton pattern | `src/integrations/supabase/client.ts` |
| Test examples? | In __tests__ folders | `*/__tests__/*.test.*` |
| Environment configs? | Multiple .env files | `.env.local`, `services/*/.env` |

## ARCHITECTURE DECISIONS
| Decision | Reasoning | Impact |
|----------|-----------|--------|
| Monorepo with pnpm | Shared types, atomic deploys | Single source of truth |
| React Query | Server state management | No Redux needed |
| Supabase Auth | Built-in RLS, real-time | Simplified auth flow |
| Express + FastAPI | Node for API, Python for AI | Best tool for each job |
| App Router | Next.js 16 latest | Better performance |
| Tailwind CSS | Utility-first styling | Consistent design |

## TASK RESEARCH WORKFLOW
```bash
# 1. Understand the task
cat .tasks/todo/feature-x.md

# 2. Find similar implementations
grep -r "similar-feature" src/ --include="*.tsx"

# 3. Check how it was done before
ls .tasks/done/ | grep -i "auth\|payment\|feature"
cat .tasks/done/similar-task.md

# 4. Find the test patterns
find . -name "*similar*.test.tsx" | xargs cat

# 5. Plan implementation
echo "## Implementation Plan
1. Create API endpoint
2. Add types
3. Create hook
4. Build component
5. Write tests"

# 6. Check for blockers
grep -r "TODO\|FIXME\|XXX" src/ | grep -i "related"
```

## VALIDATION BEFORE IMPLEMENTATION
```bash
# Check if similar code exists
grep -r "className\|function\|interface" --include="*.ts*" | grep -i "feature"

# Verify API endpoint doesn't exist
ls services/core-api/src/routes/ | grep -i "endpoint"

# Check if types are defined
grep "interface\|type" shared/types/src/*.ts | grep -i "Model"

# Ensure no duplicate hooks
ls src/hooks/ | grep -i "useFeature"

# Review database schema
cat supabase/migrations/*.sql | grep -i "table_name"
```

## QUICK DECISION TREE
```
Need to add a feature?
├── Is it UI only?
│   └── Create component in src/components/
├── Does it need data?
│   ├── From database?
│   │   ├── Add API endpoint (5 steps)
│   │   └── Create React Query hook
│   └── From external API?
│       └── Add to src/integrations/
└── Does it change schema?
    ├── Create migration in supabase/migrations/
    └── Update shared/types/
```

## RESEARCH CHECKLIST
- [ ] Task requirements clear
- [ ] Similar code found/reviewed
- [ ] API endpoints identified
- [ ] Database schema understood
- [ ] Test patterns located
- [ ] Dependencies checked
- [ ] Breaking changes assessed
- [ ] Implementation steps listed
- [ ] Acceptance criteria defined