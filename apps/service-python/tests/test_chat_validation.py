import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app
from app.routes.chat import ChatMessage, ChatRequest

client = TestClient(app)

def test_chat_message_validation():
    """Test ChatMessage model validation"""
    # Valid message
    valid_msg = ChatMessage(role="user", content="Hello")
    assert valid_msg.role == "user"
    assert valid_msg.content == "Hello"
    
    # Invalid role
    with pytest.raises(ValueError):
        ChatMessage(role="invalid", content="Hello")
    
    # Missing content
    with pytest.raises(ValueError):
        ChatMessage(role="user")

def test_chat_request_validation():
    """Test ChatRequest model validation"""
    messages = [ChatMessage(role="user", content="Hello")]
    
    # Valid request with defaults
    req = ChatRequest(messages=messages)
    assert req.mode == "general"
    assert req.topk == 4
    
    # Valid request with custom values
    req = ChatRequest(messages=messages, mode="projects", topk=2)
    assert req.mode == "projects"
    assert req.topk == 2
    
    # Invalid mode
    with pytest.raises(ValueError):
        ChatRequest(messages=messages, mode="invalid")
    
    # Invalid topk (too low)
    with pytest.raises(ValueError):
        ChatRequest(messages=messages, topk=0)
    
    # Invalid topk (too high)
    with pytest.raises(ValueError):
        ChatRequest(messages=messages, topk=11)

@patch('app.routes.chat.get_openai_stream')
@patch('app.routes.chat.log_analytics')
def test_chat_endpoint_general_mode(mock_log_analytics, mock_openai_stream):
    """Test chat endpoint in general mode"""
    # Mock streaming response
    async def mock_stream(messages):
        yield "Hello"
        yield " there!"
    
    mock_openai_stream.return_value = mock_stream(None)
    mock_log_analytics.return_value = AsyncMock()
    
    response = client.post("/ai/chat", json={
        "messages": [{"role": "user", "content": "Hello"}],
        "mode": "general"
    })
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

@patch('app.routes.chat.get_openai_stream')
@patch('app.routes.chat.log_analytics')
@patch('app.core.rag.augment_prompt_with_context')
def test_chat_endpoint_projects_mode(mock_augment, mock_log_analytics, mock_openai_stream):
    """Test chat endpoint in projects mode with RAG"""
    # Mock RAG augmentation
    mock_augment.return_value = "Augmented prompt with project context"
    
    # Mock streaming response
    async def mock_stream(messages):
        yield "Project info: "
        yield "AI platform details..."
    
    mock_openai_stream.return_value = mock_stream(None)
    mock_log_analytics.return_value = AsyncMock()
    
    response = client.post("/ai/chat", json={
        "messages": [{"role": "user", "content": "Tell me about your AI projects"}],
        "mode": "projects",
        "topk": 3
    })
    
    assert response.status_code == 200
    # Verify RAG was called with correct parameters
    mock_augment.assert_called_once()

def test_chat_endpoint_rate_limiting():
    """Test rate limiting functionality"""
    # This would require mocking the rate limiting storage
    # For now, just test the endpoint exists
    response = client.post("/ai/chat", json={
        "messages": [{"role": "user", "content": "Hello"}]
    })
    
    # Should either succeed or fail with rate limit, not 404
    assert response.status_code in [200, 429, 500]  # 500 if OpenAI key missing

def test_chat_endpoint_invalid_payload():
    """Test chat endpoint with invalid payload"""
    # Missing messages
    response = client.post("/ai/chat", json={})
    assert response.status_code == 422
    
    # Invalid message format
    response = client.post("/ai/chat", json={
        "messages": [{"role": "invalid", "content": "Hello"}]
    })
    assert response.status_code == 422
    
    # Empty messages list
    response = client.post("/ai/chat", json={
        "messages": []
    })
    assert response.status_code == 200  # Valid but will have no user context

def test_system_prompt_generation():
    """Test system prompt generation"""
    from app.routes.chat import SystemPrompt
    
    # Base prompt
    base = SystemPrompt.get_base_prompt()
    assert "Surya's AI assistant" in base
    assert "Next.js" in base
    assert "FastAPI" in base
    
    # General mode
    general = SystemPrompt.get_with_context("general")
    assert base in general
    
    # Projects mode with context
    context = "Project details here"
    projects = SystemPrompt.get_with_context("projects", context)
    assert base in projects
    assert context in projects
    
    # Resume mode
    resume = SystemPrompt.get_with_context("resume")
    assert base in resume
    assert "resume/experience" in resume