import json
import os
import time
from collections import defaultdict
from typing import AsyncGenerator, List, Literal

import httpx
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Rate limiting storage (in production, use Redis)
rate_limit_storage = defaultdict(list)

router = APIRouter()

class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    mode: Literal["general", "projects", "resume"] = "general"
    topk: int = Field(default=4, ge=1, le=10)

class SystemPrompt:
    @staticmethod
    def get_base_prompt() -> str:
        return """You are Surya's AI assistant for his portfolio website. You're friendly, professional, and concise.
        
        About Surya:
        - Full-stack developer skilled in Next.js, React, TypeScript, FastAPI, Python, and Stripe integrations
        - Passionate about building scalable web applications and payment solutions
        - Enjoys hiking, cooking, and playing basketball in free time
        - Always learning new technologies and sharing knowledge
        
        Guidelines:
        - Be helpful and conversational, but keep responses focused and not too long
        - When discussing projects, cite specific details if provided in context
        - Avoid harmful, sensitive, or inappropriate content
        - If you don't know something specific about Surya's work, say so honestly
        - Weave in personality (hobbies, interests) when relevant to the conversation
        """

    @staticmethod
    def get_with_context(mode: str, context: str = None) -> str:
        base = SystemPrompt.get_base_prompt()

        if mode == "projects" and context:
            return f"""{base}
            
{context}"""

        elif mode == "resume":
            return f"""{base}
            
The user is asking about Surya's resume/experience. Focus on his technical skills, work experience, and career highlights. Be professional but personable."""

        return base

def check_rate_limit(ip: str, window_minutes: int = 10, max_requests: int = 20) -> bool:
    """Simple in-memory rate limiting"""
    now = time.time()
    window_start = now - (window_minutes * 60)

    # Clean old requests
    rate_limit_storage[ip] = [req_time for req_time in rate_limit_storage[ip] if req_time > window_start]

    # Check if under limit
    if len(rate_limit_storage[ip]) >= max_requests:
        return False

    # Add current request
    rate_limit_storage[ip].append(now)
    return True

async def get_openai_stream(messages: List[ChatMessage]) -> AsyncGenerator[str, None]:
    """Stream tokens from OpenAI-compatible API"""
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

    if not api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [msg.dict() for msg in messages],
        "stream": True,
        "temperature": 0.7,
        "max_tokens": 2048
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            async with client.stream(
                "POST",
                f"{base_url}/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"OpenAI API error: {error_text.decode()}"
                    )

                async for chunk in response.aiter_lines():
                    if chunk.startswith("data: "):
                        data = chunk[6:]  # Remove "data: " prefix

                        if data == "[DONE]":
                            break

                        try:
                            parsed = json.loads(data)
                            content = parsed.get("choices", [{}])[0].get("delta", {}).get("content")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue  # Skip malformed chunks

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Streaming error: {str(e)}")

async def log_analytics(session_count: bool = False, token_count: int = 0):
    """Log analytics using KV client"""
    from ..core.analytics import log_chat_session, log_chat_tokens

    if session_count:
        await log_chat_session()
    if token_count > 0:
        await log_chat_tokens(token_count)

@router.post("/chat")
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    """Chat endpoint with SSE streaming"""
    client_ip = request.client.host

    # Rate limiting
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Try again in a few minutes."
        )

    # Handle RAG for projects mode
    system_prompt = SystemPrompt.get_base_prompt()
    if chat_request.mode == "projects" and chat_request.messages:
        # Get the last user message for RAG search
        user_messages = [msg for msg in chat_request.messages if msg.role == "user"]
        if user_messages:
            last_user_message = user_messages[-1].content

            try:
                from ..core.rag import augment_prompt_with_context
                system_prompt = augment_prompt_with_context(
                    system_prompt,
                    last_user_message,
                    chat_request.topk
                )
            except Exception as e:
                print(f"RAG search failed, using base prompt: {e}")
                system_prompt = SystemPrompt.get_with_context(chat_request.mode)
    else:
        system_prompt = SystemPrompt.get_with_context(chat_request.mode)

    # Prepare messages with system prompt
    messages = [ChatMessage(role="system", content=system_prompt)] + chat_request.messages

    # Log analytics
    await log_analytics(session_count=True)

    async def generate_stream():
        token_count = 0
        try:
            async for token in get_openai_stream(messages):
                token_count += 1
                yield f"data: {json.dumps({'token': token})}\n\n"

            # Log token count
            await log_analytics(token_count=token_count)
            yield f"data: {json.dumps({'done': True})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        }
    )
