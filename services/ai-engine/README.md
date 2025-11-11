---
type: technical-reference
role: ai-engine-reference
scope: ai-engine
audience: backend-developers, claude, codex
last-updated: 2025-11-11
relevance: ai, matching, embeddings, fastapi, python, ml
priority: high
quick-read-time: 5min
deep-dive-time: 15min
---

# Ori AI Engine

**⚠️ IMPORTANT: Always read [DOC_INDEX.md](../../DOC_INDEX.md) first for current project status and navigation.**

The intelligent heart of the Ori Platform - providing semantic job matching, skill gap analysis, and personalized career recommendations.

## 🧠 What It Does

The AI Engine transforms career discovery from keyword matching to deep understanding:

- **Semantic Matching**: Uses sentence transformers to understand the _meaning_ of profiles and jobs, not just keywords
- **Multi-Factor Scoring**: Combines semantic similarity with structured data (skills, experience, location, salary)
- **Skill Gap Analysis**: Identifies what users need to learn and prioritizes development paths
- **Learning Paths**: Generates personalized, actionable upskilling recommendations
- **Career Guidance**: Suggests roles, next steps, and strategic career moves

## 🏗️ Architecture

```
ai-engine/
├── main.py                    # FastAPI application entry point
├── config.py                  # Configuration with validation
├── models/
│   ├── schemas.py            # Pydantic models (aligned with shared/types)
│   └── embeddings.py         # Embedding generation service
├── services/
│   ├── matching.py           # Job matching algorithm
│   ├── skill_analysis.py     # Skill gap analyzer
│   └── recommendations.py    # Recommendation engine
├── utils/
│   └── logging.py            # Logging configuration
└── tests/
    └── test_matching.py      # Integration tests
```

## 🚀 Quick Start

### Prerequisites

```bash
# Python 3.10+ required
python --version

# Install dependencies
pip install -r requirements.txt
```

### Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings (all have sensible defaults)
# No API keys required for basic matching!
```

### Run the Service

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 3002
```

The service will be available at:

- API: http://localhost:3002
- Docs: http://localhost:3002/docs
- Health: http://localhost:3002/health

## 📡 API Endpoints

### Core Intelligence

**POST /api/v1/match**
Generate intelligent job matches with multi-factor scoring.

```json
{
  "profile": {
    "user_id": "123",
    "skills": ["Python", "FastAPI", "PostgreSQL"],
    "experience_level": "mid",
    "work_style": "remote",
    "salary_min": 80000
  },
  "jobs": [
    {
      "job_id": "job-1",
      "title": "Backend Engineer",
      "company": "Tech Corp",
      "description": "Build scalable APIs...",
      "requirements": ["Python", "FastAPI", "Docker"]
    }
  ],
  "limit": 10
}
```

**POST /api/v1/analyze-skills**
Analyze skill gaps and readiness for target roles.

**POST /api/v1/learning-paths**
Generate personalized learning paths with resources and milestones.

**POST /api/v1/recommend-roles**
Suggest relevant roles based on skills and experience.

**POST /api/v1/next-steps**
Get actionable career guidance based on profile state.

### Monitoring

**GET /health**
Health check endpoint for load balancers and monitoring.

**GET /**
Service information and status.

## 🎯 Matching Algorithm

The matching engine uses a weighted multi-factor approach:

| Factor               | Weight | Description                               |
| -------------------- | ------ | ----------------------------------------- |
| Semantic Similarity  | 40%    | Deep profile-job alignment via embeddings |
| Skill Match          | 30%    | Explicit skill overlap                    |
| Experience Alignment | 15%    | Career level fit                          |
| Location/Work Style  | 10%    | Lifestyle preferences                     |
| Salary Fit           | 5%     | Compensation alignment                    |

**Why this works:**

- **Semantic layer** catches implicit fits that keywords miss (e.g., "Django" experience → "FastAPI" jobs)
- **Skill matching** ensures explicit requirements are met
- **Experience scoring** prevents mismatches (junior → exec roles)
- **Preferences** ensure lifestyle compatibility
- **Salary** is weighted lowest (negotiable in practice)

## 🧪 Testing

```bash
# Run tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=services --cov=models

# Run specific test file
pytest tests/test_matching.py -v
```

## 🔧 Configuration

Key environment variables:

```bash
# Server
PORT=3002
ENVIRONMENT=development  # development | production

# Model (no API keys needed!)
EMBEDDING_MODEL=all-MiniLM-L6-v2  # Fast, lightweight, offline
EMBEDDING_DIMENSION=384
MAX_SEQUENCE_LENGTH=256

# Performance
BATCH_SIZE=32
CACHE_TTL=3600
MAX_WORKERS=4

# Logging
LOG_LEVEL=INFO  # DEBUG | INFO | WARNING | ERROR
LOG_FORMAT=json # json | text
```

## 🎨 Design Principles

1. **No API Keys Required (for basic matching)**: Uses local sentence-transformers model
2. **Fast First Response**: Pre-loads embedding model at startup
3. **Graceful Degradation**: Returns sensible scores even with missing data
4. **Explainable AI**: Every match includes human-readable reasoning
5. **Stateless**: No database dependencies, pure computation service

## 🔗 Integration with Core API

The core-api calls the AI engine for intelligent features:

```python
# In core-api
import httpx

async def get_job_matches(user_profile, jobs):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:3002/api/v1/match",
            json={
                "profile": user_profile,
                "jobs": jobs,
                "limit": 10
            }
        )
        return response.json()
```

## 📊 Performance

- **First request**: ~2-3s (model loading)
- **Subsequent requests**: ~100-300ms per 10 jobs
- **Memory**: ~500MB (model in memory)
- **Scaling**: Stateless, can run multiple instances

## 🛠️ Future Enhancements

- [ ] Vector database (Pinecone/Qdrant) for large-scale matching
- [ ] Fine-tuned models on career-specific data
- [ ] LLM integration for richer reasoning (GPT-4/Claude)
- [ ] Real-time learning path updates from market data
- [ ] A/B testing framework for algorithm improvements
- [ ] Caching layer (Redis) for frequent queries

## 🤝 Development

This service follows the patterns defined in `CLAUDE.md` and `AGENTS.md`:

- Owned by **claude-branch** (long-form reasoning, backend contracts)
- TypeScript types sync with `shared/types`
- Integrated via core-api REST calls
- Tested before each deployment

## 📚 Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Sentence Transformers](https://www.sbert.net/)
- [Semantic Search Explained](https://www.sbert.net/examples/applications/semantic-search/README.html)

---

**Built with ❤️ for Ori Platform - Making fulfillment scalable.**
