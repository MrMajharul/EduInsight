from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="user", uselist=False)

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String)
    major = Column(String)
    academic_year = Column(Integer)
    gpa = Column(Float, nullable=True)
    
    user = relationship("User", back_populates="student")
    results = relationship("StudentResult", back_populates="student")
    attendances = relationship("Attendance", back_populates="student")
    skills = relationship("Skill", back_populates="student")
    predictions = relationship("Prediction", back_populates="student")
    study_plans = relationship("StudyPlanModel", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, unique=True, index=True)
    course_name = Column(String)
    credits = Column(Integer)
    
    results = relationship("StudentResult", back_populates="course")
    attendances = relationship("Attendance", back_populates="course")

class StudentResult(Base):
    __tablename__ = "student_results"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    score = Column(Float)
    grade = Column(String)
    semester = Column(String)
    
    student = relationship("Student", back_populates="results")
    course = relationship("Course", back_populates="results")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    date = Column(DateTime, default=datetime.utcnow)
    is_present = Column(Boolean, default=True)
    
    student = relationship("Student", back_populates="attendances")
    course = relationship("Course", back_populates="attendances")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    skill_name = Column(String)
    proficiency = Column(String) # Beginner, Intermediate, Advanced
    
    student = relationship("Student", back_populates="skills")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    prediction_type = Column(String) # e.g., "gpa_prediction", "at_risk"
    predicted_value = Column(Float)
    confidence_score = Column(Float)
    semester = Column(String, default="Semester 1") # e.g. "Semester 1"
    date_generated = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="predictions")

class StudyPlanModel(Base):
    __tablename__ = "study_plans"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    plan_title = Column(String)
    plan_data = Column(JSON) # Store the generated plan timeline
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="study_plans")

class CareerRecommendation(Base):
    __tablename__ = "career_recommendations"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    recommended_role = Column(String)
    match_score = Column(Float)
    gap_analysis = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", primaryjoin="CareerRecommendation.student_id==Student.id")
