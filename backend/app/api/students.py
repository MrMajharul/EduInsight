from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.db_models import Student
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class StudentCreate(BaseModel):
    user_id: int
    full_name: str
    major: str
    academic_year: int
    gpa: Optional[float] = None


class StudentResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    major: str
    academic_year: int
    gpa: Optional[float] = None

    class Config:
        orm_mode = True


@router.post("/profile", response_model=StudentResponse)
def create_profile(student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(
        Student.user_id == student.user_id).first()
    if db_student:
        raise HTTPException(
            status_code=400, detail="Student profile already exists for this user")

    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.get("/profile/{user_id}", response_model=StudentResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(
            status_code=404, detail="Student profile not found")
    return student
