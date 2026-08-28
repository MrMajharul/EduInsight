import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_planner_endpoint():
    payload = {
        "semester_name": "Spring 2026",
        "courses": [{"name": "Operating Systems", "difficulty": "Hard", "weak_topics": ["Virtual Memory", "Deadlocks"]}],
        "exam_date": "2026-07-15",
        "daily_hours": 3.0,
        "current_level": "Beginner"
    }
    response = client.post("/api/planner", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["semester_name"] == "Spring 2026"
    assert "weekly_schedule" in data
    assert "milestones" in data

def test_exam_prep_endpoint():
    payload = {
        "topic": "Process Synchronization",
        "exam_format": "All",
        "number_of_questions": 4,
        "difficulty": "Advanced"
    }
    response = client.post("/api/exam-prep", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["topic"] == "Process Synchronization"
    assert len(data["quizzes"]) == 4

def test_career_endpoint():
    payload = {
        "programming_skills": ["C", "C++"],
        "framework_skills": ["Linux Kernel"],
        "database_skills": ["MySQL"],
        "problem_solving": "Advanced",
        "academic_performance": "Medium",
        "projects": ["Mini OS"],
        "interests": ["Kernel dev", "Security"],
        "academic_level": "Polytechnic"
    }
    response = client.post("/api/career", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["target_career"] != ""
    assert "roadmap" in data

def test_projects_endpoint():
    payload = {
        "domain": "Systems Programming",
        "difficulty": "Advanced",
        "tech_stack": ["Rust", "Linux"],
        "project_scope": "Individual"
    }
    response = client.post("/api/projects", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "projects" in data
    assert len(data["projects"]) > 0

def test_chat_endpoint():
    payload = {
        "message": "Hi, I need help studying databases",
        "history": [],
        "context": {"subject": "Databases"}
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "suggested_questions" in data
