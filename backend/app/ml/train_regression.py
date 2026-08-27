import pandas as pd
import numpy as np
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def evaluate_model(y_true, y_pred, name):
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)
    
    print(f"{name}:")
    print(f"  MAE:  {mae:.4f}")
    print(f"  MSE:  {mse:.4f}")
    print(f"  RMSE: {rmse:.4f}")
    print(f"  R²:   {r2:.4f}\n")
    return r2

def train_regression(model_dir="."):
    processed_file = os.path.join(model_dir, "processed_dataset.csv")
    print(f"Loading processed data from {processed_file}...")
    df = pd.read_csv(processed_file)
    
    X = df.drop(['pass_fail', 'final_marks', 'final_gpa'], axis=1)
    
    targets = {
        'marks': df['final_marks'],
        'gpa': df['final_gpa']
    }
    
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }
    
    for target_name, y in targets.items():
        print(f"\n{'='*40}")
        print(f"Training Regression Models for {target_name.upper()}")
        print(f"{'='*40}")
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        best_r2 = -float('inf')
        best_model = None
        best_name = ""
        
        for name, model in models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            r2 = evaluate_model(y_test, y_pred, name)
            
            if r2 > best_r2:
                best_r2 = r2
                best_model = model
                best_name = name
                
        print(f"Best {target_name.upper()} Model: {best_name} (R² = {best_r2:.4f})")
        
        # Save the best model
        model_path = os.path.join(model_dir, f"{target_name}_model.pkl")
        with open(model_path, "wb") as f:
            pickle.dump(best_model, f)
        print(f"Saved {best_name} to {model_path}")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    train_regression(model_dir=base_dir)
