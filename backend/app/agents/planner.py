from datetime import datetime, timedelta
from app.agents.base_agent import BaseAgent
from app.models import PlannerRequest, StudyPlan, WeeklySchedule, DailyPlan, Milestone

class PlannerAgent(BaseAgent):
    def generate_plan(self, req: PlannerRequest) -> StudyPlan:
        system_instruction = (
            "You are the AI Study Planner Agent, a critical component of the Smart Student Success Agent app. "
            "Your objective is to generate highly structured, personalized, and realistic study plans for a student's entire semester. "
            "Given the semester name, target exam date, daily hours available, the student's current proficiency level, and a list of courses (each with its name, difficulty, and weak topics), "
            "generate a week-by-week plan that leads up to the exam. "
            "Distribute the daily study hours intelligently across the different courses, balancing easy and hard subjects. "
            "Ensure the plan focuses heavily on resolving the weak topics across all subjects. "
            "Provide specific daily study activities (e.g., read, practice, revise, code) with priorities, indicating which course each activity belongs to."
            "IMPORTANT: If a 'Predicted Academic Risk' is provided, adapt your tone and strategy. "
            "If risk is HIGH, create an intensive, rescue-focused schedule prioritizing weak areas and exam-passing fundamentals. "
            "If risk is LOW, create an optimization-focused schedule prioritizing advanced topics and perfect scoring."
        )
        
        course_details = "\n".join([f"- {c.name} (Difficulty: {c.difficulty}, Weak Topics: {', '.join(c.weak_topics)})" for c in req.courses])
        prompt = (
            f"Generate a personalized study plan for the semester '{req.semester_name}'.\n"
            f"Target Exam Date: {req.exam_date}\n"
            f"Daily study hours available: {req.daily_hours} hours\n"
            f"Student level: {req.current_level}\n"
            f"Courses to study:\n{course_details}\n"
        )
        
        if req.predicted_risk:
            prompt += f"Predicted Academic Risk: {req.predicted_risk}\n"
        if req.predicted_marks is not None:
            prompt += f"Predicted Final Marks: {req.predicted_marks}/100\n"
        if req.current_progress:
            prompt += f"Current Progress: {req.current_progress}\n"
            
        prompt += "\nReturn the study plan strictly matching the response schema."
        
        def fallback():
            # Calculate weeks until exam
            try:
                exam_dt = datetime.strptime(req.exam_date, "%Y-%m-%d")
                days_until = (exam_dt - datetime.now()).days
                if days_until < 7:
                    weeks = 1
                else:
                    weeks = min(max(1, days_until // 7), 8)
            except Exception:
                weeks = 4  # Default to 4 weeks if date format is invalid or in past
            
            all_weak_topics = []
            for c in req.courses:
                all_weak_topics.extend(c.weak_topics)

            # Generate custom topics based on subject and weak topics
            topics_list = [f"Fundamentals across {len(req.courses)} courses"]
            for wt in all_weak_topics[:3]:
                topics_list.append(f"Deep dive into {wt}")
            while len(topics_list) < weeks:
                topics_list.append(f"Comprehensive revision of semester courses")
            topics_list.append("Practice Exams & Revision")
            
            weekly_schedules = []
            for w in range(1, weeks + 1):
                weekly_goal = f"Master {topics_list[w-1]} and complete practice exercises."
                
                days = []
                days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                for i, day in enumerate(days_of_week):
                    priority = "High" if (i % 2 == 0 or len(all_weak_topics) > 0) else "Medium"
                    
                    course_today = req.courses[i % len(req.courses)].name if req.courses else "General Studies"
                    subtopic = f"{course_today} - {topics_list[w-1]} Section {i+1}"
                    activities = [
                        f"Read study guides or textbooks on {subtopic}",
                        f"Solve 5 practice problems on {subtopic}",
                    ]
                    if priority == "High":
                        activities.append(f"Write summary notes for {subtopic}")
                    
                    days.append(DailyPlan(
                        day_name=day,
                        topic=topics_list[w-1],
                        subtopics=[subtopic],
                        duration_hours=req.daily_hours,
                        priority=priority,
                        activities=activities
                    ))
                
                weekly_schedules.append(WeeklySchedule(
                    week_number=w,
                    weekly_goal=weekly_goal,
                    days=days
                ))
            
            milestones = [
                Milestone(
                    title=f"Week 1 Benchmark",
                    target_date="End of Week 1",
                    description=f"Complete fundamentals for all semester courses."
                )
            ]
            if weeks > 1:
                milestones.append(Milestone(
                    title="Weak Topics Mastery",
                    target_date=f"End of Week {weeks // 2 + 1}",
                    description=f"Complete review and exercises for weak topics: {', '.join(all_weak_topics[:3])}."
                ))
            milestones.append(Milestone(
                title="Exam Readiness",
                target_date="3 Days before Exam",
                description="Achieve >80% on mock quizzes and complete the revision checklist."
            ))
            
            checklist = [
                f"Review summary notes for all {len(req.courses)} courses",
                f"Spend extra time reviewing notes on {', '.join(all_weak_topics[:3])}",
                "Take at least two full-length mock exams per difficult course",
                "Ensure all formulas and definitions are memorized",
                "Review mistake logs from practice quizzes"
            ]
            
            return StudyPlan(
                semester_name=req.semester_name,
                weekly_schedule=weekly_schedules,
                milestones=milestones,
                exam_readiness_checklist=checklist
            )
            
        return self.generate_structured_output(
            prompt=prompt,
            system_instruction=system_instruction,
            response_schema=StudyPlan,
            fallback_func=fallback
        )
