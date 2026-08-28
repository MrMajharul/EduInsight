from fastapi import APIRouter, HTTPException
from app.models import ChatRequest, ChatResponse
from app.agents.chat import ChatAgent
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

chat_agent = ChatAgent()

@router.post("/", response_model=ChatResponse)
def handle_chat(req: ChatRequest):
    try:
        response = chat_agent.chat(req)
        return response
    except Exception as e:
        logger.error(f"Error handling chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
