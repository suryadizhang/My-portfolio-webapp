import pytest
from unittest.mock import AsyncMock, patch
from app.core.analytics import (
    log_page_view, get_page_views,
    toggle_like, get_like_status,
    log_resume_download, get_resume_downloads,
    log_chat_session, log_chat_tokens, get_chat_stats
)

@pytest.fixture
def mock_kv():
    """Mock KV client for testing"""
    with patch('app.core.analytics.kv') as mock:
        mock.incr = AsyncMock(return_value=1)
        mock.get_int = AsyncMock(return_value=5)
        mock.sadd = AsyncMock(return_value=1)
        mock.srem = AsyncMock(return_value=1)
        mock.scard = AsyncMock(return_value=3)
        mock.sismember = AsyncMock(return_value=False)
        yield mock

@pytest.mark.asyncio
async def test_log_page_view(mock_kv):
    """Test page view logging"""
    await log_page_view("test-project")
    
    mock_kv.incr.assert_called_once_with("analytics:views:test-project")

@pytest.mark.asyncio
async def test_get_page_views(mock_kv):
    """Test getting page view count"""
    mock_kv.get_int.return_value = 42
    
    count = await get_page_views("test-project")
    
    assert count == 42
    mock_kv.get_int.assert_called_once_with("analytics:views:test-project")

@pytest.mark.asyncio
async def test_toggle_like_add(mock_kv):
    """Test adding a like"""
    mock_kv.sismember.return_value = False  # Not currently liked
    mock_kv.scard.return_value = 5  # Total after adding
    
    liked, count = await toggle_like("test-project", "user-session-123")
    
    assert liked == True
    assert count == 5
    mock_kv.sadd.assert_called_once_with("set:likes:test-project", "user-session-123")
    mock_kv.scard.assert_called_once_with("set:likes:test-project")

@pytest.mark.asyncio
async def test_toggle_like_remove(mock_kv):
    """Test removing a like"""
    mock_kv.sismember.return_value = True  # Currently liked
    mock_kv.scard.return_value = 4  # Total after removing
    
    liked, count = await toggle_like("test-project", "user-session-123")
    
    assert liked == False
    assert count == 4
    mock_kv.srem.assert_called_once_with("set:likes:test-project", "user-session-123")
    mock_kv.scard.assert_called_once_with("set:likes:test-project")

@pytest.mark.asyncio
async def test_get_like_status(mock_kv):
    """Test getting like status"""
    mock_kv.sismember.return_value = True
    mock_kv.scard.return_value = 10
    
    liked, count = await get_like_status("test-project", "user-session-123")
    
    assert liked == True
    assert count == 10

@pytest.mark.asyncio
async def test_log_resume_download(mock_kv):
    """Test resume download logging"""
    await log_resume_download()
    
    mock_kv.incr.assert_called_once_with("analytics:resume:downloads")

@pytest.mark.asyncio
async def test_get_resume_downloads(mock_kv):
    """Test getting resume download count"""
    mock_kv.get_int.return_value = 15
    
    count = await get_resume_downloads()
    
    assert count == 15
    mock_kv.get_int.assert_called_once_with("analytics:resume:downloads")

@pytest.mark.asyncio
async def test_log_chat_session(mock_kv):
    """Test chat session logging"""
    with patch('app.core.analytics.datetime') as mock_dt:
        mock_dt.now.return_value.strftime.return_value = "2024-01-15"
        
        await log_chat_session()
        
        mock_kv.incr.assert_called_once_with("analytics:chat:sessions:2024-01-15")

@pytest.mark.asyncio
async def test_log_chat_tokens(mock_kv):
    """Test chat token logging"""
    with patch('app.core.analytics.datetime') as mock_dt:
        mock_dt.now.return_value.strftime.return_value = "2024-01-15"
        
        await log_chat_tokens(150)
        
        mock_kv.incr.assert_called_once_with("analytics:chat:tokens:2024-01-15", 150)

@pytest.mark.asyncio
async def test_get_chat_stats(mock_kv):
    """Test getting chat statistics"""
    # Mock different return values for different keys
    def mock_get_int_side_effect(key):
        if "sessions" in key:
            return 5
        elif "tokens" in key:
            return 100
        return 0
    
    mock_kv.get_int.side_effect = mock_get_int_side_effect
    
    with patch('app.core.analytics.datetime') as mock_dt:
        # Mock date calculations
        from datetime import datetime, timedelta
        base_date = datetime(2024, 1, 15)
        mock_dt.now.return_value = base_date
        mock_dt.side_effect = lambda *args, **kwargs: datetime(*args, **kwargs)
        
        stats = await get_chat_stats(3)  # 3 days
    
    assert "sessions_by_day" in stats
    assert "tokens_by_day" in stats
    assert "total_sessions" in stats
    assert "total_tokens" in stats
    
    # Should have data for 3 days
    assert len(stats["sessions_by_day"]) == 3
    assert len(stats["tokens_by_day"]) == 3
    
    # Check totals
    assert stats["total_sessions"] == 15  # 5 * 3 days
    assert stats["total_tokens"] == 300   # 100 * 3 days