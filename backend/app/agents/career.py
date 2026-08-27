from app.agents.base_agent import BaseAgent
from app.models import CareerGuidanceRequest, CareerGuidanceResponse, SkillGap, RoadmapPhase, InternshipAdvice, CareerConfidence

class CareerAgent(BaseAgent):
    def generate_career_guidance(self, req: CareerGuidanceRequest) -> CareerGuidanceResponse:
        # Predefined roles and required skills
        roles = {
            "Backend Developer": {
                "prog": ["Python", "Java", "Node.js", "C#", "Go"],
                "frameworks": ["Django", "FastAPI", "Express", "Spring"],
                "db": ["SQL", "PostgreSQL", "MongoDB", "Redis"]
            },
            "Data Analyst": {
                "prog": ["Python", "R", "SQL"],
                "frameworks": ["Pandas", "Matplotlib", "Seaborn"],
                "db": ["SQL", "MySQL"]
            },
            "ML Engineer": {
                "prog": ["Python", "C++"],
                "frameworks": ["TensorFlow", "PyTorch", "Scikit-Learn"],
                "db": ["SQL", "VectorDB"]
            },
            "Frontend Developer": {
                "prog": ["JavaScript", "TypeScript", "HTML", "CSS"],
                "frameworks": ["React", "Vue", "Next.js", "Tailwind"],
                "db": []
            },
            "Full Stack Developer": {
                "prog": ["JavaScript", "Python", "TypeScript"],
                "frameworks": ["React", "Node.js", "Django", "Next.js"],
                "db": ["PostgreSQL", "MongoDB"]
            }
        }

        # Scoring logic
        scores = {}
        all_user_skills = set([s.lower() for s in (req.programming_skills + req.framework_skills + req.database_skills)])
        
        for role, required in roles.items():
            req_set = set([s.lower() for s in (required["prog"] + required["frameworks"] + required["db"])])
            if len(req_set) == 0:
                scores[role] = 0
                continue
                
            intersection = req_set.intersection(all_user_skills)
            score = (len(intersection) / len(req_set)) * 100
            
            # Boost based on interest
            if any(role.lower() in interest.lower() or interest.lower() in role.lower() for interest in req.interests):
                score += 20
                
            scores[role] = min(round(score, 1), 99.9)
            
        # Sort careers
        sorted_careers = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top_careers = [CareerConfidence(role=k, confidence=v) for k, v in sorted_careers[:3]]
        target_career = top_careers[0].role
        matched_skills = roles[target_career]["prog"] + roles[target_career]["frameworks"] + roles[target_career]["db"]
        
        system_instruction = (
            "You are the Career Guidance Agent for the Smart Student Success app. "
            "Your objective is to help students navigate their career aspirations, map out learning paths, "
            "analyze skills gaps, and identify relevant opportunities based on their academic level and interests. "
            "Suggest concrete, actionable roadmaps with resource links and portfolio strategies to succeed in their target career."
        )
        
        prompt = (
            f"Based on our data-driven analysis, the student's top recommended career is '{target_career}'.\n"
            f"Academic Level: {req.academic_level}\n"
            f"Interests: {', '.join(req.interests)}\n"
            f"Current Skills: {', '.join(list(all_user_skills))}\n"
            f"Required Skills for this role: {', '.join(matched_skills)}\n\n"
            "Generate the roadmap and gap analysis strictly matching the response schema."
        )
        
        def fallback():
            skills_gap = []
            for skill in matched_skills:
                is_acquired = skill.lower() in all_user_skills
                status = "Acquired" if is_acquired else "Gap"
                action = (
                    "Keep building projects to reinforce this skill." if is_acquired 
                    else f"Learn the basics of {skill} through free documentation and build practice tools."
                )
                skills_gap.append(SkillGap(
                    skill_name=skill,
                    status=status,
                    action_item=action
                ))
            
            roadmap = [
                RoadmapPhase(
                    phase_name="Phase 1: Foundations",
                    duration="Month 1-2",
                    description=f"Master the core languages required for {target_career}.",
                    skills_to_learn=roles[target_career]["prog"],
                    resources=["Official Docs", "FreeCodeCamp"]
                ),
                RoadmapPhase(
                    phase_name="Phase 2: Frameworks & DBs",
                    duration="Month 3-4",
                    description=f"Learn industry standard frameworks.",
                    skills_to_learn=roles[target_career]["frameworks"] + roles[target_career]["db"],
                    resources=["YouTube Crash Courses", "Udemy"]
                )
            ]
            
            internships = [
                InternshipAdvice(
                    role_title=f"Junior {target_career} Intern",
                    required_skills=matched_skills[:3],
                    project_focus=f"Build an end-to-end system utilizing {matched_skills[0]}."
                )
            ]
            
            return CareerGuidanceResponse(
                top_careers=top_careers,
                target_career=target_career,
                skills_gap_analysis=skills_gap,
                roadmap=roadmap,
                internship_recommendations=internships,
                industries_hiring=["Tech Startups", "Enterprises"]
            )
            
        return self.generate_structured_output(
            prompt=prompt,
            system_instruction=system_instruction,
            response_schema=CareerGuidanceResponse,
            fallback_func=fallback
        )
