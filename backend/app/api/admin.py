import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/analytics")
def get_ml_analytics():
    """
    Module 11: Admin/ML Analytics endpoint.
    Reads the model comparison report and dataset stats.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.join(base_dir, "..", "ml")
    report_path = os.path.join(ml_dir, "model_comparison_report.json")
    dataset_path = os.path.join(ml_dir, "processed_dataset.csv")
    
    # 1. Dataset stats
    total_students = 0
    if os.path.exists(dataset_path):
        with open(dataset_path, "r") as f:
            total_students = sum(1 for line in f) - 1 # subtract header
            
    # Assuming standard 80/20 train test split from train_models.py
    training_samples = int(total_students * 0.8)
    testing_samples = total_students - training_samples
    
    dataset_stats = {
        "total_students": total_students,
        "training_samples": training_samples,
        "testing_samples": testing_samples
    }
    
    # 2. Model Performance
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="Model comparison report not found. Has the ML pipeline been trained?")
        
    with open(report_path, "r") as f:
        report_data = json.load(f)
        
    return {
        "dataset": dataset_stats,
        "best_model": report_data.get("best_model", "Unknown"),
        "models": report_data.get("models", [])
    }
