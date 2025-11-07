from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AURA AI Engine", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserProfile(BaseModel):
    user_id: str
    skills: List[str]
    experience: str
    preferences: Dict
    roles: Optional[List[str]] = []
    work_style: Optional[str] = "remote"

class Job(BaseModel):
    job_id: str
    title: str
    company: str
    description: str
    requirements: List[str]
    location: Optional[str] = "Remote"
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None

class MatchResult(BaseModel):
    job_id: str
    match_score: float
    reasoning: str
    key_matches: List[str]

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-engine"}

@app.post("/match", response_model=List[MatchResult])
async def generate_matches(profile: UserProfile, jobs: List[Job]):
    """
    Generate AI-powered job matches with explanations
    """
    # Placeholder matching logic
    matches = []

    for job in jobs:
        # Simple keyword matching for now
        skill_matches = 0
        for skill in profile.skills:
            if skill.lower() in job.description.lower() or \
               any(skill.lower() in req.lower() for req in job.requirements):
                skill_matches += 1

        # Calculate match score
        if profile.skills:
            match_score = (skill_matches / len(profile.skills)) * 100
        else:
            match_score = 50.0  # Default score

        # Add some randomness for demo
        import random
        match_score = min(100, match_score + random.uniform(-10, 20))

        matches.append(MatchResult(
            job_id=job.job_id,
            match_score=round(match_score, 1),
            reasoning=f"Your skills match {skill_matches} of the job requirements",
            key_matches=profile.skills[:3] if profile.skills else ["Experience match"]
        ))

    # Sort by match score
    matches.sort(key=lambda x: x.match_score, reverse=True)

    return matches

@app.post("/coach")
async def career_coaching(user_id: str, question: str):
    """
    Conversational career coaching endpoint
    """
    # Placeholder response
    return {
        "response": f"Based on your question '{question}', I recommend focusing on developing your core skills and exploring opportunities that align with your career goals.",
        "suggestions": [
            "Update your resume with recent achievements",
            "Consider taking online courses in your field",
            "Network with professionals in your industry"
        ]
    }

@app.post("/analyze-cv")
async def analyze_cv(cv_text: str):
    """
    Analyze CV and extract structured data
    """
    # Placeholder CV analysis
    return {
        "skills": ["Python", "JavaScript", "React", "Node.js"],
        "experience_level": "mid",
        "years_of_experience": 5,
        "summary": "Experienced software developer with focus on web technologies"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002, reload=True)