#!/usr/bin/env python3
"""Build RAG index from MDX content files"""

import json
import pickle
import re
from pathlib import Path
from typing import Any, Dict, List

import frontmatter
from sklearn.feature_extraction.text import TfidfVectorizer


def strip_markdown_to_text(content: str) -> str:
    """Convert markdown to plain text"""
    # Remove headers
    content = re.sub(r'^#{1,6}\s+(.+)$', r'\1', content, flags=re.MULTILINE)

    # Remove bold/italic
    content = re.sub(r'\*\*(.+?)\*\*', r'\1', content)
    content = re.sub(r'\*(.+?)\*', r'\1', content)
    content = re.sub(r'_(.+?)_', r'\1', content)

    # Remove links but keep text
    content = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', content)

    # Remove code blocks
    content = re.sub(r'```[\s\S]*?```', '', content)
    content = re.sub(r'`([^`]+)`', r'\1', content)

    # Remove list markers
    content = re.sub(r'^[\s]*[-\*\+]\s+', '', content, flags=re.MULTILINE)
    content = re.sub(r'^[\s]*\d+\.\s+', '', content, flags=re.MULTILINE)

    # Clean up whitespace
    content = re.sub(r'\n\s*\n', '\n\n', content)
    content = content.strip()

    return content

def process_mdx_files(content_dir: str) -> List[Dict[str, Any]]:
    """Process all MDX files in the content directory"""
    content_path = Path(content_dir)
    projects_path = content_path / "projects"

    if not projects_path.exists():
        print(f"Warning: Projects directory not found at {projects_path}")
        return []

    documents = []

    for mdx_file in projects_path.glob("*.mdx"):
        print(f"Processing {mdx_file.name}...")

        try:
            # Parse frontmatter and content
            with open(mdx_file, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)

            # Extract metadata
            title = post.metadata.get('title', mdx_file.stem)
            description = post.metadata.get('description', '')
            tags = post.metadata.get('tags', [])
            tech = post.metadata.get('tech', [])

            # Convert content to plain text
            plain_text = strip_markdown_to_text(post.content)

            # Combine all text for indexing
            combined_text = f"{title}. {description}. {plain_text}"
            if tags:
                combined_text += f" Tags: {', '.join(tags)}."
            if tech:
                combined_text += f" Technologies: {', '.join(tech)}."

            doc = {
                'id': mdx_file.stem,
                'slug': mdx_file.stem,
                'title': title,
                'description': description,
                'tags': tags,
                'tech': tech,
                'content': post.content,
                'text': plain_text,
                'combined_text': combined_text
            }

            documents.append(doc)

        except Exception as e:
            print(f"Error processing {mdx_file}: {e}")

    return documents

def build_tfidf_index(documents: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Build TF-IDF index from documents"""
    if not documents:
        return {
            'documents': [],
            'vectorizer': None,
            'vectors': None
        }

    # Extract text for vectorization
    texts = [doc['combined_text'] for doc in documents]

    # Create TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words='english',
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.8
    )

    # Fit and transform texts
    tfidf_matrix = vectorizer.fit_transform(texts)

    return {
        'documents': documents,
        'vectorizer': vectorizer,
        'vectors': tfidf_matrix
    }

def save_rag_index(index_data: Dict[str, Any], output_file: str):
    """Save RAG index to file"""
    # Prepare serializable data
    serializable_data = {
        'documents': index_data['documents'],
        'feature_names': index_data['vectorizer'].get_feature_names_out().tolist() if index_data['vectorizer'] else [],
        'vectors_array': index_data['vectors'].toarray().tolist() if index_data['vectors'] is not None else []
    }

    # Save to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(serializable_data, f, indent=2, ensure_ascii=False)

    # Also save vectorizer separately for runtime use
    vectorizer_file = output_file.replace('.json', '_vectorizer.pkl')
    if index_data['vectorizer']:
        with open(vectorizer_file, 'wb') as f:
            pickle.dump(index_data['vectorizer'], f)

    print(f"RAG index saved to {output_file}")
    print(f"Vectorizer saved to {vectorizer_file}")

def main():
    """Main function to build RAG index"""
    # Determine paths
    script_dir = Path(__file__).parent
    service_root = script_dir.parent
    web_content_dir = service_root.parent.parent / "apps" / "web" / "content"
    output_file = service_root / "data" / "rag.json"

    print(f"Looking for content in: {web_content_dir}")
    print(f"Output file: {output_file}")

    # Ensure output directory exists
    output_file.parent.mkdir(exist_ok=True)

    # Process MDX files
    documents = process_mdx_files(str(web_content_dir))
    print(f"Processed {len(documents)} documents")

    if not documents:
        print("No documents found. Creating empty index.")
        empty_index = {
            'documents': [],
            'vectorizer': None,
            'vectors': None
        }
        save_rag_index(empty_index, str(output_file))
        return

    # Build TF-IDF index
    print("Building TF-IDF index...")
    index_data = build_tfidf_index(documents)

    # Save index
    save_rag_index(index_data, str(output_file))

    print("RAG index build complete!")
    for doc in documents:
        print(f"  - {doc['title']} ({doc['slug']})")

if __name__ == "__main__":
    main()
