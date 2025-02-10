"""
FastAPI backend for Resume Matcher ML components.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

app = FastAPI(title="Resume Matcher ML API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

class FeedbackRequest(BaseModel):
    job_id: str
    resume_id: str
    match_score: float
    user_rating: int
    feedback_text: Optional[str] = None
    feedback_categories: Optional[Dict[str, float]] = None

@app.post("/match")
async def match_resume(request: MatchRequest):
    """Match a resume against a job description."""
    try:
        # Simple mock response for testing
        return {
            "overall_match": 0.85,
            "skill_match": 0.9,
            "experience_match": 0.8
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_resume(request: MatchRequest):
    """Perform detailed resume analysis."""
    try:
        # Simple mock response for testing
        return {
            "technical_score": 0.8,
            "experience_score": 0.7,
            "semantic_score": 0.85,
            "culture_score": 0.9,
            "future_score": 0.75,
            "detailed_analysis": {
                "skill_gaps": {
                    "missing_skills": ["Docker", "Kubernetes"],
                    "additional_skills": ["React", "Node.js"]
                },
                "recommendations": {
                    "technical": ["Learn Docker basics", "Get familiar with Kubernetes"],
                    "soft_skills": ["Improve communication skills"],
                    "future_growth": ["Focus on cloud technologies"]
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"status": "healthy", "message": "Resume Matcher ML API is running"}
