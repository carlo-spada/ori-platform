# AI Engine Quick Start Guide

Get Ori's intelligent matching engine running in under 5 minutes.

## Prerequisites

- Python 3.10 or higher
- pip (Python package manager)
- 2GB free RAM (for embedding model)

## Installation

### 1. Navigate to AI Engine

```bash
cd services/ai-engine
```

### 2. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

**Note:** First install will download the sentence-transformer model (~80MB). This happens once.

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# No editing needed! Defaults work out of the box.
# Optional: Adjust PORT, LOG_LEVEL, etc. if desired
```

### 4. Start the Service

```bash
python main.py
```

You should see:

```
==================================================
Starting Ori AI Engine v1.0.0
Environment: development
==================================================
Pre-loading embedding model...
✓ Embedding service ready (dimension: 384)
AI Engine ready to serve requests
INFO:     Uvicorn running on http://0.0.0.0:3002
```

### 5. Verify It's Working

Open http://localhost:3002/docs in your browser to see the interactive API documentation.

Or test the health endpoint:

```bash
curl http://localhost:3002/health
```

Should return:

```json
{
  "status": "healthy",
  "service": "ai-engine",
  "version": "1.0.0",
  "model_loaded": true,
  "checks": {
    "embedding_model": true,
    "matching_service": true,
    "skill_analyzer": true
  }
}
```

## Starting Core API with AI Integration

Once the AI engine is running, start the core-api:

```bash
# In a new terminal
cd services/core-api

# Make sure .env has AI_ENGINE_URL=http://localhost:3002
pnpm dev
```

The core-api will now use AI-powered matching instead of random scores!

## Test the Integration

1. Start both services (AI engine on :3002, core-api on :3001)
2. Make a match request to core-api
3. Check the core-api logs - you should see AI matching being used
4. Jobs will now have intelligent scores with reasoning!

## Troubleshooting

### "Model loading failed"

**Cause:** Not enough RAM or network issue downloading model.

**Fix:**
```bash
# Manually download model first
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

### "Port 3002 already in use"

**Fix:** Change PORT in `.env`:
```bash
PORT=3003
```

Also update core-api's `AI_ENGINE_URL` to match.

### "AI matching failed, falling back to basic scoring"

**Cause:** AI engine not running or not reachable.

**Fix:**
1. Verify AI engine is running: `curl http://localhost:3002/health`
2. Check core-api environment has correct `AI_ENGINE_URL`
3. Check firewall isn't blocking localhost connections

### Slow first request

**Normal behavior.** The first match request after startup may take 2-3 seconds as the model warms up. Subsequent requests are ~100-300ms.

## Development Workflow

```bash
# Terminal 1: AI Engine
cd services/ai-engine
source venv/bin/activate
python main.py

# Terminal 2: Core API
cd services/core-api
pnpm dev

# Terminal 3: Frontend (optional)
cd ../..
pnpm dev
```

## Running Tests

```bash
cd services/ai-engine
pytest tests/ -v
```

## Next Steps

- Read `services/ai-engine/README.md` for detailed documentation
- Explore the API at http://localhost:3002/docs
- Check out the matching algorithm in `services/ai-engine/services/matching.py`
- Try the skill analysis endpoint for gap analysis

## Performance Tips

- **First startup:** Model download + loading takes ~30-60 seconds
- **Warm startup:** Model loads from cache in ~5-10 seconds
- **Matching:** 10 jobs matched in ~100-300ms after warmup
- **Memory:** Expect ~500MB RAM usage (model in memory)

## Production Deployment

For production, set these environment variables:

```bash
ENVIRONMENT=production
LOG_FORMAT=json
LOG_LEVEL=INFO
PORT=3002
```

Consider:
- Running behind a reverse proxy (nginx)
- Setting up health check monitoring
- Configuring auto-scaling (service is stateless)
- Using a process manager (systemd, supervisord, PM2)

---

**Ready to make fulfillment scalable!** 🚀
