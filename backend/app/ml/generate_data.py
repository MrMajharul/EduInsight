import pandas as pd
import numpy as np
import os

def generate_student_data(num_samples=1500, output_path="raw_student_data.csv"):
    np.random.seed(42)
    
    # Generate Academic Features
    previous_gpa = np.clip(np.random.normal(3.0, 0.6, num_samples), 0.0, 4.0)
    current_gpa = previous_gpa + np.random.normal(0, 0.3, num_samples)
    current_gpa = np.clip(current_gpa, 0.0, 4.0)
    
    attendance_pct = np.clip(np.random.normal(85, 15, num_samples), 0, 100)
    midterm_marks = np.clip(np.random.normal(75, 15, num_samples), 0, 100)
    quiz_average = np.clip(np.random.normal(75, 15, num_samples), 0, 100)
    assignment_average = np.clip(np.random.normal(80, 12, num_samples), 0, 100)
    
    study_hours = np.clip(np.random.normal(15, 8, num_samples), 0, 40)
    course_load = np.random.randint(3, 7, num_samples) # 3 to 6 courses
    previous_failed_courses = np.random.choice([0, 1, 2, 3], num_samples, p=[0.7, 0.2, 0.08, 0.02])

    # Generate Behavioral Features
    study_freq_choices = ['Daily', 'Weekly', 'Rarely']
    # Bias study freq based on study_hours
    study_frequency = []
    for h in study_hours:
        if h > 20: study_frequency.append('Daily')
        elif h > 8: study_frequency.append(np.random.choice(['Daily', 'Weekly'], p=[0.3, 0.7]))
        else: study_frequency.append(np.random.choice(['Weekly', 'Rarely'], p=[0.4, 0.6]))
        
    class_part_choices = ['High', 'Medium', 'Low']
    class_participation = []
    for a in attendance_pct:
        if a > 90: class_participation.append(np.random.choice(['High', 'Medium'], p=[0.7, 0.3]))
        elif a > 70: class_participation.append(np.random.choice(['Medium', 'Low'], p=[0.6, 0.4]))
        else: class_participation.append('Low')

    assign_comp_choices = ['Always', 'Often', 'Rarely']
    assignment_completion = []
    for a in assignment_average:
        if a > 85: assignment_completion.append('Always')
        elif a > 60: assignment_completion.append(np.random.choice(['Often', 'Always'], p=[0.7, 0.3]))
        else: assignment_completion.append(np.random.choice(['Rarely', 'Often'], p=[0.8, 0.2]))
        
    # Create DataFrame
    df = pd.DataFrame({
        'previous_gpa': previous_gpa,
        'current_gpa': current_gpa,
        'attendance_pct': attendance_pct,
        'midterm_marks': midterm_marks,
        'quiz_average': quiz_average,
        'assignment_average': assignment_average,
        'study_hours': study_hours,
        'course_load': course_load,
        'previous_failed_courses': previous_failed_courses,
        'study_frequency': study_frequency,
        'class_participation': class_participation,
        'assignment_completion': assignment_completion
    })
    
    # Generate final_marks (0-100) based on academic features
    base_marks = (
        (df['attendance_pct'] * 0.15) + 
        (df['midterm_marks'] * 0.25) + 
        (df['quiz_average'] * 0.15) + 
        (df['assignment_average'] * 0.20) + 
        (df['current_gpa'] / 4.0 * 20) +
        (df['study_hours'] * 0.2)
    )
    final_marks = np.clip(base_marks + np.random.normal(0, 5, num_samples), 0, 100)
    df['final_marks'] = np.round(final_marks, 2)
    
    # Generate final_gpa (0.0-4.0) heavily correlated with final_marks
    final_gpa = (final_marks / 100) * 4.0 + np.random.normal(0, 0.2, num_samples)
    df['final_gpa'] = np.round(np.clip(final_gpa, 0.0, 4.0), 2)
    
    # Calculate a risk score to determine pass/fail
    # Lower score means higher risk of failing
    risk_score = (
        (df['current_gpa'] / 4.0 * 30) + 
        (df['attendance_pct'] / 100.0 * 20) + 
        (df['midterm_marks'] / 100.0 * 20) + 
        (df['assignment_average'] / 100.0 * 15) + 
        (df['quiz_average'] / 100.0 * 15) -
        (df['previous_failed_courses'] * 5)
    )
    
    # Add some noise
    risk_score += np.random.normal(0, 5, num_samples)
    
    # Threshold for passing (e.g., score > 50 means pass (1), else fail (0))
    # Let's target roughly 20% fail rate
    threshold = np.percentile(risk_score, 20)
    df['pass_fail'] = (risk_score >= threshold).astype(int)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {num_samples} samples and saved to {output_path}")
    print("Pass/Fail distribution:")
    print(df['pass_fail'].value_counts(normalize=True))

if __name__ == "__main__":
    generate_student_data(output_path="/Users/user/Smart-Student-Success-Agent/backend/app/ml/raw_student_data.csv")
