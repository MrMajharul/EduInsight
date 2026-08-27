import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Import the PDF generator
from app.services.report_generator import generate_student_report

router = APIRouter()

# Schema for history response
class PredictionHistoryItem(BaseModel):
    semester: str
    risk: str
    improvement: Optional[str] = None

class HistoryResponse(BaseModel):
    student_id: int
    history: List[PredictionHistoryItem]

# In a real app, this would be in a database. Using an in-memory mock for the showcase.
# Format: student_id -> list of predictions
mock_db = {
    1: [
        {"semester": "Semester 1", "risk_prob": 0.35, "risk": "HIGH"},
        {"semester": "Semester 2", "risk_prob": 0.55, "risk": "MEDIUM"},
        {"semester": "Semester 3", "risk_prob": 0.85, "risk": "LOW"},
    ]
}

@router.get("/{student_id}", response_model=HistoryResponse)
def get_prediction_history(student_id: int):
    """
    Module 9: Retrieve history and calculate improvement.
    """
    if student_id not in mock_db:
        # Default mock for demonstration
        mock_db[student_id] = [
            {"semester": "Semester 1", "risk_prob": 0.30, "risk": "HIGH"},
            {"semester": "Semester 2", "risk_prob": 0.85, "risk": "LOW"},
        ]
        
    history = mock_db[student_id]
    result = []
    
    for i in range(len(history)):
        item = history[i]
        improvement = None
        
        # Calculate improvement from previous semester
        if i > 0:
            prev_item = history[i-1]
            diff = item["risk_prob"] - prev_item["risk_prob"]
            sign = "+" if diff > 0 else ""
            improvement = f"{sign}{round(diff * 100)}%"
            
        result.append(PredictionHistoryItem(
            semester=item["semester"],
            risk=item["risk"],
            improvement=improvement
        ))
        
    return HistoryResponse(student_id=student_id, history=result)

@router.get("/{student_id}/report")
def download_student_report(student_id: int):
    """
    Module 10: Generate and download a complete PDF report.
    """
    # Fetch data (mocked for showcase)
    history_resp = get_prediction_history(student_id).dict()
    
    student_data = {
        "name": "Jane Doe",
        "major": "Computer Science",
        "academic_year": 3,
        "previous_gpa": 2.8,
        "current_gpa": 3.42,
        "attendance_pct": 82,
        "risk_level": "LOW",
        "pass_probability": 87.5,
        "expected_marks": 78.4,
        "expected_gpa": 3.42,
        "history": history_resp["history"],
        "weak_subjects": ["Algorithms", "Database Management"],
        "recommendations": ["Improve attendance to 90%+", "Focus on Database Joins"],
        "careers": [
            {"role": "Backend Developer", "confidence": 85.0},
            {"role": "Data Analyst", "confidence": 62.0}
        ],
        "skill_gaps": ["Docker (Containerization)", "PostgreSQL (Advanced Joins)"]
    }
    
    # Ensure reports directory exists
    reports_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    file_path = os.path.join(reports_dir, f"student_report_{student_id}.pdf")
    
    try:
        generate_student_report(student_data, file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
        
    return FileResponse(
        path=file_path,
        filename=f"EduInsight_Report_{student_id}.pdf",
        media_type="application/pdf"
    )
