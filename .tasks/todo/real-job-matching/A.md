---
Task ID: A
Feature: Real Job Matching Integration
Title: Integrate AI Engine for Real Job Recommendations
Assignee: Claude (Implementer & Builder)
Status: To Do
Priority: High
Depends On: Job data source implementation
---

### Objective

Replace the simulated job recommendations count in the dashboard API with real job matching powered by the AI engine's semantic matching capabilities.

### Context

Currently, `services/core-api/src/routes/dashboard.ts` returns a simulated job recommendations count based on profile completeness. This task will integrate with the AI engine's `/api/v1/match` endpoint to provide real, personalized job recommendations.

### Files to Modify/Create

- `services/core-api/src/routes/dashboard.ts` - Update recommendations logic
- `services/core-api/src/lib/ai-engine-client.ts` - Create AI engine API client
- `services/core-api/src/routes/jobs.ts` - Create jobs endpoint (NEW)
- `supabase/migrations/XXXXXX_create_jobs_table.sql` - Job storage schema
- `shared/types/src/index.ts` - Add Job types

### Implementation Steps

1. **Create Job Data Source**:
   - Decide on job data strategy:
     - Option A: Scrape from job boards (Indeed, LinkedIn)
     - Option B: Integrate with job board APIs
     - Option C: Manual job database (for MVP)
   - For MVP, create a jobs table in Supabase

2. **Create Jobs Database Schema**:
   ```sql
   CREATE TABLE jobs (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title TEXT NOT NULL,
     company TEXT NOT NULL,
     description TEXT NOT NULL,
     required_skills TEXT[] NOT NULL,
     location TEXT,
     remote BOOLEAN DEFAULT false,
     salary_min INTEGER,
     salary_max INTEGER,
     experience_level TEXT,
     posted_date TIMESTAMP DEFAULT NOW(),
     expires_date TIMESTAMP,
     source TEXT,
     external_url TEXT,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Create AI Engine Client**:
   - Create `services/core-api/src/lib/ai-engine-client.ts`
   - Implement functions:
     - `getJobRecommendations(profile, limit)`
     - `analyzeSkillGap(profile, targetJobs)`
   - Add proper error handling and timeouts
   - Use fetch or axios for HTTP calls

4. **Create Jobs API Endpoint**:
   - `GET /api/v1/jobs` - List all active jobs
   - `GET /api/v1/jobs/:id` - Get specific job
   - `GET /api/v1/jobs/recommendations` - Get personalized recommendations
   - Add pagination support
   - Add filtering by skills, location, remote

5. **Update Dashboard API**:
   - Replace simulated count with real AI engine call
   - Fetch relevant jobs from database
   - Call AI engine `/api/v1/match` endpoint
   - Cache results for 5-10 minutes to reduce API calls
   - Return top match count (not full job details)

6. **Implement Caching Strategy**:
   - Use Redis or simple in-memory cache
   - Cache key: `recommendations:{userId}`
   - TTL: 5 minutes
   - Invalidate on profile update

7. **Error Handling**:
   - Gracefully fall back to simulated count if AI engine unavailable
   - Log errors for monitoring
   - Return partial results if some jobs fail to match

8. **Frontend Integration**:
   - Update dashboard to show real recommendations count
   - Link to new recommendations page
   - Create `/app/recommendations` page (separate task)

### Acceptance Criteria

- Jobs table exists in Supabase with sample job data
- AI engine client successfully calls `/api/v1/match` endpoint
- Dashboard returns real job recommendations count based on semantic matching
- Results are cached to prevent repeated AI engine calls
- System gracefully degrades if AI engine is unavailable
- API response time is <500ms (with caching)
- Documentation updated with new jobs API endpoints

### Technical Notes

- AI engine uses sentence-transformers for semantic matching
- Match scores are weighted: semantic (40%), skills (30%), experience (15%), location (10%), salary (5%)
- Consider background job to pre-compute recommendations daily
- Jobs table should be populated with at least 50 sample jobs for testing
- Use connection pooling for AI engine HTTP calls

### Sample Job Data Sources

- For MVP testing, manually add 20-50 jobs from:
  - LinkedIn job postings
  - Indeed listings
  - Company career pages
- Focus on tech roles matching your target audience

### Estimated Effort

4-6 hours (including schema, API implementation, and integration)
