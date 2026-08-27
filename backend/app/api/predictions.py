from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

try:
    from app.ml.inference import inference_engine
except ImportError:
    inference_engine = None

logger = logging.getLogger(__name__)
router = APIRouter()

class StudentRiskRequest(BaseModel):
    previous_gpa: float
    current_gpa: float
    attendance_pct: float
    midterm_marks: float
    quiz_average: float
    assignment_average: float
    study_hours: float
    course_load: int
    previous_failed_courses: int
    study_frequency: str
    class_participation: str
    assignment_completion: str

class StudentRiskResponse(BaseModel):
    prediction: str
    risk_level: str
    pass_probability: float

class StudentPerformanceResponse(BaseModel):
    predicted_marks: float
    predicted_gpa: float

@router.post("/risk", response_model=StudentRiskResponse)
def predict_academic_risk(req: StudentRiskRequest):
    if not inference_engine:
        raise HTTPException(status_code=503, detail="ML Inference Engine is not loaded.")
        
    try:
        data = req.dict()
        result = inference_engine.predict_risk(data)
        return result
    except Exception as e:
        logger.error(f"Error making risk prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate prediction: {str(e)}")

@router.post("/explain")
def explain_academic_risk(req: StudentRiskRequest):
    if not inference_engine:
        raise HTTPException(status_code=503, detail="ML Inference Engine is not loaded.")
        
    try:
        data = req.dict()
        result = inference_engine.get_risk_explanation(data)
        if "error" in result:
            raise HTTPException(status_code=503, detail=result["error"])
        return result
    except Exception as e:
        logger.error(f"Error making risk explanation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {str(e)}")

@router.post("/performance", response_model=StudentPerformanceResponse)
def predict_performance(req: StudentRiskRequest):
    if not inference_engine:
        raise HTTPException(status_code=503, detail="ML Inference Engine is not loaded.")
        
    try:
        data = req.dict()
        result = inference_engine.predict_performance(data)
        return result
    except Exception as e:
        logger.error(f"Error making performance prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate performance prediction: {str(e)}")

@router.get("/comparison")
def get_model_comparison():
    if not inference_engine:
        raise HTTPException(status_code=503, detail="ML Inference Engine is not loaded.")
    
    try:
        report = inference_engine.get_comparison_report()
        if "error" in report:
            raise HTTPException(status_code=404, detail=report["error"])
        return report
    except Exception as e:
        logger.error(f"Error fetching comparison report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch comparison report: {str(e)}")
