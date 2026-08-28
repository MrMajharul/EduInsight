from app.agents.base_agent import BaseAgent
from app.models import ChatRequest, ChatResponse

class ChatAgent(BaseAgent):
    def chat(self, req: ChatRequest) -> ChatResponse:
        system_instruction = (
            "You are EduInsight AI, an intelligent, encouraging academic tutor. "
            "Your role is to help students understand complex academic topics they are struggling with. "
            "Provide clear, concise, and structured explanations. Use analogies where appropriate. "
            "If the student provides context about their current courses or study plan, adapt your advice accordingly."
        )
        
        # Include context if provided
        user_message = req.message
        if req.context:
            context_str = "\n".join([f"{k}: {v}" for k, v in req.context.items()])
            user_message = f"[Student Context:\n{context_str}]\n\nStudent Question: {req.message}"
            
        def fallback():
            # Mock fallback if API fails
            reply = (
                f"This is a simulated tutor response to: '{req.message}'.\n\n"
                "To get real AI responses, please ensure the GEMINI_API_KEY is configured in the backend `.env` file "
                "and you have an active internet connection."
            )
            return reply, ["How do I set up the API key?", "Can you explain this again?"]
            
        reply_text, suggested_qs = self.generate_chat_reply(
            history=req.history,
            user_message=user_message,
            system_instruction=system_instruction,
            fallback_func=fallback
        )
        
        return ChatResponse(
            reply=reply_text,
            suggested_questions=suggested_qs
        )
