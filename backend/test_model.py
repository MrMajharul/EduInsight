import pickle
import pandas as pd
from app.ml.inference import MLInference

engine = MLInference()
data = {
    "previous_gpa": 2202,
    "current_gpa": 2202,
    "attendance_pct": 85,
    "midterm_marks": 78,
    "quiz_average": 80,
    "assignment_average": 85,
    "study_hours": 3.5,
    "course_load": 5,
    "previous_failed_courses": 0,
    "study_frequency": "Medium",
    "class_participation": "Medium",
    "assignment_completion": "High"
}

print("Risk:", engine.predict_risk(data))
print("Performance:", engine.predict_performance(data))
