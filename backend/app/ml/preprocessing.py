import pandas as pd
import numpy as np
import os
import pickle
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

def get_preprocessor():
    numeric_features = [
        'previous_gpa', 'current_gpa', 'attendance_pct', 
        'midterm_marks', 'quiz_average', 'assignment_average',
        'study_hours', 'course_load', 'previous_failed_courses'
    ]
    
    categorical_features = [
        'study_frequency', 'class_participation', 'assignment_completion'
    ]

    # Preprocessing for numerical data
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # Preprocessing for categorical data
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    # Bundle preprocessing for numerical and categorical data
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
        
    return preprocessor, numeric_features, categorical_features

def preprocess_data(input_csv="raw_student_data.csv", output_csv="processed_dataset.csv", model_dir="."):
    print(f"Loading data from {input_csv}...")
    df = pd.read_csv(input_csv)
    
    # Separate target variables
    targets = df[['pass_fail', 'final_marks', 'final_gpa']]
    X = df.drop(['pass_fail', 'final_marks', 'final_gpa'], axis=1)
    
    preprocessor, _, _ = get_preprocessor()
    
    print("Fitting preprocessing pipeline...")
    X_processed = preprocessor.fit_transform(X)
    
    # Extract feature names after one-hot encoding
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['onehot']
    cat_features = cat_encoder.get_feature_names_out(['study_frequency', 'class_participation', 'assignment_completion'])
    num_features = ['previous_gpa', 'current_gpa', 'attendance_pct', 'midterm_marks', 'quiz_average', 'assignment_average', 'study_hours', 'course_load', 'previous_failed_courses']
    all_features = num_features + list(cat_features)
    
    # Convert to DataFrame
    df_processed = pd.DataFrame(X_processed, columns=all_features)
    df_processed['pass_fail'] = targets['pass_fail'].values
    df_processed['final_marks'] = targets['final_marks'].values
    df_processed['final_gpa'] = targets['final_gpa'].values
    
    # Save processed dataset
    output_path = os.path.join(model_dir, output_csv)
    df_processed.to_csv(output_path, index=False)
    print(f"Saved processed dataset to {output_path}")
    
    # Save preprocessor
    preprocessor_path = os.path.join(model_dir, "preprocessor.pkl")
    with open(preprocessor_path, "wb") as f:
        pickle.dump(preprocessor, f)
    print(f"Saved preprocessor pipeline to {preprocessor_path}")
    
    return preprocessor

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(base_dir, "raw_student_data.csv")
    preprocess_data(input_csv=input_file, model_dir=base_dir)
