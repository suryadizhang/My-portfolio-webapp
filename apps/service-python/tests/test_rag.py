import json
import tempfile
from pathlib import Path

import pytest

from app.core.rag import RAGSearcher, augment_prompt_with_context


@pytest.fixture
def mock_rag_data():
    """Create mock RAG data for testing"""
    return {
        "documents": [
            {
                "id": "test-project-1",
                "slug": "test-project-1",
                "title": "AI Booking Platform",
                "description": "Smart booking system with AI recommendations",
                "tags": ["ai", "booking", "react"],
                "tech": ["Next.js", "OpenAI", "Stripe"],
                "text": "This is a comprehensive booking platform that uses artificial intelligence to provide personalized recommendations. Built with Next.js and integrated with OpenAI for smart features.",
                "combined_text": "AI Booking Platform. Smart booking system with AI recommendations. This is a comprehensive booking platform that uses artificial intelligence to provide personalized recommendations. Built with Next.js and integrated with OpenAI for smart features. Tags: ai, booking, react. Technologies: Next.js, OpenAI, Stripe."
            },
            {
                "id": "test-project-2",
                "slug": "test-project-2",
                "title": "E-commerce Analytics Dashboard",
                "description": "Real-time analytics dashboard for e-commerce metrics",
                "tags": ["analytics", "dashboard", "ecommerce"],
                "tech": ["React", "Python", "PostgreSQL"],
                "text": "A powerful analytics dashboard that provides real-time insights into e-commerce performance. Features include sales tracking, customer analytics, and predictive modeling.",
                "combined_text": "E-commerce Analytics Dashboard. Real-time analytics dashboard for e-commerce metrics. A powerful analytics dashboard that provides real-time insights into e-commerce performance. Features include sales tracking, customer analytics, and predictive modeling. Tags: analytics, dashboard, ecommerce. Technologies: React, Python, PostgreSQL."
            }
        ],
        "feature_names": ["ai", "analytics", "booking", "dashboard", "ecommerce", "next", "openai", "platform", "react", "real"],
        "vectors_array": [
            [0.5, 0.0, 0.8, 0.0, 0.0, 0.6, 0.7, 0.4, 0.3, 0.0],
            [0.0, 0.9, 0.0, 0.8, 0.7, 0.0, 0.0, 0.0, 0.5, 0.6]
        ]
    }

@pytest.fixture
def temp_rag_index(mock_rag_data):
    """Create temporary RAG index file"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(mock_rag_data, f)
        temp_file = f.name

    yield temp_file

    # Cleanup
    Path(temp_file).unlink(missing_ok=True)

def test_rag_searcher_load_index(temp_rag_index):
    """Test RAG searcher loads index correctly"""
    searcher = RAGSearcher(temp_rag_index)

    assert len(searcher.documents) == 2
    assert searcher.documents[0]['title'] == "AI Booking Platform"
    assert searcher.documents[1]['title'] == "E-commerce Analytics Dashboard"
    assert searcher.doc_vectors is not None
    assert searcher.doc_vectors.shape == (2, 10)

def test_rag_searcher_search_ai_query(temp_rag_index):
    """Test RAG search with AI-related query"""
    searcher = RAGSearcher(temp_rag_index)

    # Mock the vectorizer transform method
    import numpy as np
    searcher.vectorizer = type('MockVectorizer', (), {
        'transform': lambda self, query: np.array([[0.6, 0.0, 0.5, 0.0, 0.0, 0.4, 0.8, 0.3, 0.2, 0.0]])
    })()

    results = searcher.search("AI booking system", k=2)

    assert len(results) >= 1
    # First result should be AI Booking Platform (higher similarity)
    assert results[0]['title'] == "AI Booking Platform"
    assert 'similarity_score' in results[0]
    assert 'snippet' in results[0]
    assert results[0]['similarity_score'] > 0

def test_rag_searcher_empty_index():
    """Test RAG searcher with empty/missing index"""
    searcher = RAGSearcher("/nonexistent/path.json")

    results = searcher.search("test query")
    assert results == []

def test_augment_prompt_with_context():
    """Test prompt augmentation with RAG context"""
    base_prompt = "You are a helpful assistant."

    # Mock the search function to return test results
    import app.core.rag as rag_module
    original_search = rag_module.search

    def mock_search(query, k):
        return [
            {
                'title': 'Test Project',
                'slug': 'test-project',
                'snippet': 'This is a test project description...',
                'tech': ['React', 'Node.js']
            }
        ]

    rag_module.search = mock_search

    try:
        result = augment_prompt_with_context(base_prompt, "test query", 1)

        assert "You are a helpful assistant." in result
        assert "### Project Context" in result
        assert "Test Project" in result
        assert "test-project" in result
        assert "React, Node.js" in result

    finally:
        rag_module.search = original_search

def test_get_document_by_slug(temp_rag_index):
    """Test getting document by slug"""
    searcher = RAGSearcher(temp_rag_index)

    doc = searcher.get_document_by_slug("test-project-1")
    assert doc is not None
    assert doc['title'] == "AI Booking Platform"

    doc = searcher.get_document_by_slug("nonexistent")
    assert doc is None

def test_list_all_documents(temp_rag_index):
    """Test listing all documents"""
    searcher = RAGSearcher(temp_rag_index)

    docs = searcher.list_all_documents()
    assert len(docs) == 2

    # Check structure
    for doc in docs:
        assert 'id' in doc
        assert 'slug' in doc
        assert 'title' in doc
        assert 'description' in doc
        assert 'tags' in doc
        assert 'tech' in doc
