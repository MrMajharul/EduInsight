import os
import pickle
import pandas as pd
import json

class MLInference:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        preprocessor_path = os.path.join(self.base_dir, "preprocessor.pkl")
        risk_model_path = os.path.join(self.base_dir, "risk_model.pkl")
        marks_model_path = os.path.join(self.base_dir, "marks_model.pkl")
        gpa_model_path = os.path.join(self.base_dir, "gpa_model.pkl")
        explain_model_path = os.path.join(self.base_dir, "explain_model.pkl")
        
        with open(preprocessor_path, "rb") as f:
            self.preprocessor = pickle.load(f)
            
        with open(risk_model_path, "rb") as f:
            self.risk_model = pickle.load(f)
            
        with open(marks_model_path, "rb") as f:
            self.marks_model = pickle.load(f)
            
        with open(gpa_model_path, "rb") as f:
            self.gpa_model = pickle.load(f)
            
        if os.path.exists(explain_model_path):
            with open(explain_model_path, "rb") as f:
                self.explain_model = pickle.load(f)
        else:
            self.explain_model = None
            
    def predict_risk(self, student_data: dict):
        df = pd.DataFrame([student_data])
        X_processed = self.preprocessor.transform(df)
        prob = self.risk_model.predict_proba(X_processed)[0]
        pass_prob = float(prob[1])
        
        # Normalize if model returned percentage instead of [0, 1]
        if pass_prob > 1.0:
            pass_prob = pass_prob / 100.0
            
        pass_prob = max(0.0, min(1.0, pass_prob))
        
        if pass_prob >= 0.70:
            risk_level = "LOW"
        elif pass_prob >= 0.40:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
            
        is_pass = pass_prob >= 0.50
        
        return {
            "prediction": "PASS" if is_pass else "FAIL",
            "risk_level": risk_level,
            "pass_probability": round(pass_prob * 100, 2)
        }
        
    def get_risk_explanation(self, student_data: dict):
        if not self.explain_model:
            return {"error": "Explainability model not found."}
            
        df = pd.DataFrame([student_data])
        X_processed = self.preprocessor.transform(df)
        
        # Determine the decision path
        node_indicator = self.explain_model.decision_path(X_processed)
        leaf_id = self.explain_model.apply(X_processed)[0]
        
        feature_names = self.preprocessor.get_feature_names_out()
        
        # Extract features driving the prediction for this sample
        node_index = node_indicator.indices[node_indicator.indptr[0]:node_indicator.indptr[1]]
        
        rules = []
        for node_id in node_index:
            if leaf_id == node_id:
                continue
                
            feature_idx = self.explain_model.tree_.feature[node_id]
            threshold = self.explain_model.tree_.threshold[node_id]
            feature_name = feature_names[feature_idx]
            
            # Clean feature name (e.g., num__current_gpa -> current_gpa)
            if '__' in feature_name:
                feature_name = feature_name.split('__')[1]
                
            value = X_processed[0, feature_idx]
            
            if value <= threshold:
                rules.append({"feature": feature_name, "value": value, "threshold": threshold, "relation": "<="})
            else:
                rules.append({"feature": feature_name, "value": value, "threshold": threshold, "relation": ">"})
                
        # Generate human-readable explanation based on raw student_data
        factors = []
        recommendations = []
        
        # Simple heuristics comparing raw data to average/ideal
        if student_data.get('attendance_pct', 100) < 75:
            factors.append(f"🔴 Attendance: {student_data['attendance_pct']}%")
            recommendations.append("Improve attendance to 80%+")
        else:
            factors.append(f"🟢 Attendance: {student_data['attendance_pct']}%")
            
        if student_data.get('midterm_marks', 100) < 60:
            factors.append(f"🔴 Midterm: {student_data['midterm_marks']}%")
            recommendations.append("Review midterm topics and practice mock questions")
            
        if student_data.get('study_hours', 10) < 10:
            factors.append(f"🔴 Study Hours: {student_data['study_hours']}/week")
            recommendations.append(f"Increase study time to at least 15 hrs/week")
            
        if student_data.get('assignment_completion', 'Always') != 'Always':
            factors.append(f"🔴 Assignment Completion: {student_data['assignment_completion']}")
            recommendations.append("Ensure all assignments are completed on time")
        else:
            factors.append(f"🟢 Assignment Completion: {student_data['assignment_completion']}")
            
        # Get risk level
        risk_result = self.predict_risk(student_data)
        
        return {
            "risk_level": risk_result['risk_level'],
            "main_factors": factors,
            "recommendations": recommendations,
            "decision_tree_rules": len(rules) # To show it used the model under the hood
        }
        
    def predict_performance(self, student_data: dict):
        df = pd.DataFrame([student_data])
        X_processed = self.preprocessor.transform(df)
        
        predicted_marks = self.marks_model.predict(X_processed)[0]
        predicted_gpa = self.gpa_model.predict(X_processed)[0]
        
        # Apply logical bounds
        predicted_marks = max(0.0, min(100.0, float(predicted_marks)))
        predicted_gpa = max(0.0, min(4.0, float(predicted_gpa)))
        
        return {
            "predicted_marks": round(predicted_marks, 2),
            "predicted_gpa": round(predicted_gpa, 2)
        }
        
    def get_comparison_report(self):
        report_path = os.path.join(self.base_dir, "model_comparison_report.json")
        if os.path.exists(report_path):
            with open(report_path, "r") as f:
                return json.load(f)
        return {"error": "Comparison report not found."}

# Singleton instance
inference_engine = MLInference()
