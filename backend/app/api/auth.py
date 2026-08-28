from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.db_models import User
from pydantic import BaseModel

router = APIRouter()

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str | None = None
    email: str
    is_active: bool

    class Config:
        orm_mode = True

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # In a real app, hash the password
    fake_hashed_password = user.password + "notreallyhashed"
    
    new_user = User(email=user.email, full_name=user.full_name, hashed_password=fake_hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=UserResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    fake_hashed_password = user.password + "notreallyhashed"
    if db_user.hashed_password != fake_hashed_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return db_user
