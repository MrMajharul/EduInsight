import pandas as pd
import numpy as np
import os
import pickle
import json
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

def train_and_compare(model_dir="."):
    processed_file = os.path.join(model_dir, "processed_dataset.csv")
    print(f"Loading processed data from {processed_file}...")
    df = pd.read_csv(processed_file)
    
    # In case pass_fail, final_marks, final_gpa are still in X
    X = df.drop(columns=[col for col in ['pass_fail', 'final_marks', 'final_gpa'] if col in df.columns])
    y = df['pass_fail']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define Base Models
    base_models = [
        ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
        ('gb', GradientBoostingClassifier(n_estimators=50, random_state=42)),
        ('svm', SVC(probability=True, random_state=42))
    ]
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Naive Bayes": GaussianNB(),
        "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=5),
        "SVM": SVC(probability=True, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "AdaBoost": AdaBoostClassifier(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "Stacking": StackingClassifier(estimators=base_models, final_estimator=LogisticRegression())
    }
    
    best_model = None
    best_name = ""
    best_accuracy = 0
    
    comparison_report = []
    
    print("\n--- Model Comparison & Evaluation ---")
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        # Probabilities for ROC-AUC
        try:
            y_prob = model.predict_proba(X_test)[:, 1]
            roc_auc = roc_auc_score(y_test, y_prob)
        except:
            roc_auc = None # Some models might not support predict_proba natively without setup
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        model_metrics = {
            "model_name": name,
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "roc_auc": round(roc_auc * 100, 2) if roc_auc is not None else None,
            "confusion_matrix": cm
        }
        
        comparison_report.append(model_metrics)
        
        print(f"{name} -> Accuracy: {acc:.4f} | F1: {f1:.4f}")
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_name = name
            
    print(f"\n🏆 Best Model: {best_name} with Accuracy {best_accuracy:.4f}")
    
    # Save the comparison report to JSON
    report_data = {
        "best_model": best_name,
        "models": comparison_report
    }
    
    report_path = os.path.join(model_dir, "model_comparison_report.json")
    with open(report_path, "w") as f:
        json.dump(report_data, f, indent=4)
    print(f"Saved comparison report to {report_path}")
    
    # Save the best model
    model_path = os.path.join(model_dir, "risk_model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(best_model, f)
    print(f"Saved best model ({best_name}) to {model_path}")

    # Save the Decision Tree model for interpretability/explainability
    explain_model = models.get("Decision Tree")
    explain_model_path = os.path.join(model_dir, "explain_model.pkl")
    with open(explain_model_path, "wb") as f:
        pickle.dump(explain_model, f)
    print(f"Saved Decision Tree explainability model to {explain_model_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    train_and_compare(model_dir=base_dir)
