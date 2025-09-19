import json
import pickle
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class RAGSearcher:
    def __init__(self, index_path: Optional[str] = None):
        self.documents = []
        self.vectorizer = None
        self.doc_vectors = None
        
        if index_path is None:
            # Default path relative to this file
            index_path = Path(__file__).parent.parent.parent / "data" / "rag.json"
        
        self.load_index(str(index_path))
    
    def load_index(self, index_path: str):
        """Load RAG index from file"""
        try:
            index_file = Path(index_path)
            vectorizer_file = index_file.with_name(index_file.stem + '_vectorizer.pkl')
            
            # Load JSON data
            if index_file.exists():
                with open(index_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                self.documents = data.get('documents', [])
                vectors_array = data.get('vectors_array', [])
                
                if vectors_array:
                    self.doc_vectors = np.array(vectors_array)
                
                print(f"Loaded {len(self.documents)} documents from RAG index")
            
            # Load vectorizer
            if vectorizer_file.exists():
                with open(vectorizer_file, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                print("Loaded TF-IDF vectorizer")
            
        except Exception as e:
            print(f"Warning: Could not load RAG index from {index_path}: {e}")
            print("RAG search will not be available")
    
    def search(self, query: str, k: int = 4) -> List[Dict[str, Any]]:
        """Search for relevant documents
        
        Args:
            query: Search query string
            k: Number of results to return
        
        Returns:
            List of relevant documents with scores
        """
        if not self.documents or self.vectorizer is None or self.doc_vectors is None:
            print("RAG index not available, returning empty results")
            return []
        
        try:
            # Vectorize the query
            query_vector = self.vectorizer.transform([query])
            
            # Calculate cosine similarities
            similarities = cosine_similarity(query_vector, self.doc_vectors)[0]
            
            # Get top-k results
            top_indices = np.argsort(similarities)[::-1][:k]
            
            results = []
            for idx in top_indices:
                if similarities[idx] > 0:  # Only include results with positive similarity
                    doc = self.documents[idx].copy()
                    doc['similarity_score'] = float(similarities[idx])
                    
                    # Create snippet from text (first 200 chars)
                    text = doc.get('text', '')
                    snippet = text[:200] + '...' if len(text) > 200 else text
                    doc['snippet'] = snippet
                    
                    results.append(doc)
            
            return results
            
        except Exception as e:
            print(f"Error during RAG search: {e}")
            return []
    
    def get_document_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """Get a specific document by slug"""
        for doc in self.documents:
            if doc.get('slug') == slug:
                return doc
        return None
    
    def list_all_documents(self) -> List[Dict[str, Any]]:
        """Get all available documents"""
        return [{
            'id': doc['id'],
            'slug': doc['slug'],
            'title': doc['title'],
            'description': doc.get('description', ''),
            'tags': doc.get('tags', []),
            'tech': doc.get('tech', [])
        } for doc in self.documents]

# Global searcher instance
rag_searcher = RAGSearcher()

def search(query: str, k: int = 4) -> List[Dict[str, Any]]:
    """Convenience function for searching"""
    return rag_searcher.search(query, k)

def augment_prompt_with_context(base_prompt: str, query: str, k: int = 4) -> str:
    """Augment a prompt with RAG context
    
    Args:
        base_prompt: Base system prompt
        query: User query to search for
        k: Number of documents to include
    
    Returns:
        Augmented prompt with project context
    """
    results = search(query, k)
    
    if not results:
        return base_prompt
    
    # Build context section
    context_lines = ["\n### Project Context"]
    context_lines.append("Here are relevant details from Surya's projects:")
    context_lines.append("")
    
    for i, doc in enumerate(results, 1):
        title = doc['title']
        snippet = doc['snippet']
        slug = doc['slug']
        tech = doc.get('tech', [])
        
        context_lines.append(f"{i}. **{title}** ({slug})")
        if tech:
            context_lines.append(f"   Technologies: {', '.join(tech)}")
        context_lines.append(f"   {snippet}")
        context_lines.append("")
    
    context_lines.append("Use this context to provide specific, accurate information about the projects. Always cite the project titles when referencing them.")
    
    context = "\n".join(context_lines)
    
    return f"{base_prompt}\n\n{context}"