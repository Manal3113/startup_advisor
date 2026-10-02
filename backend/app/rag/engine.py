import json
import re
from typing import List, Dict, Any, Optional
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.config import settings

class RAGEngine:
    def __init__(self, knowledge_file: Optional[Path] = None):
        self.knowledge_file = knowledge_file or (settings.KNOWLEDGE_DIR / "documents.json")
        self.documents: List[Dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix = None
        self.load_corpus()

    def load_corpus(self):
        try:
            if self.knowledge_file.exists():
                with open(self.knowledge_file, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
            else:
                self.documents = []
        except Exception as e:
            print(f"Error loading RAG documents: {e}")
            self.documents = []

        if self.documents:
            # Prepare searchable text combining title, category, keywords, and content
            corpus_texts = []
            for doc in self.documents:
                keywords_str = " ".join(doc.get("keywords", []))
                search_text = f"{doc.get('title', '')} {doc.get('category', '')} {keywords_str} {doc.get('content', '')}"
                corpus_texts.append(search_text)

            self.vectorizer = TfidfVectorizer(
                stop_words="english",
                ngram_range=(1, 2),
                max_features=5000,
                sublinear_tf=True
            )
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus_texts)
        else:
            self.vectorizer = None
            self.tfidf_matrix = None

    def search(self, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        if not self.documents or not self.vectorizer or self.tfidf_matrix is None:
            return []

        # Vectorize query
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        # Sort indices by descending similarity
        ranked_indices = np.argsort(similarities)[::-1]

        results = []
        for idx in ranked_indices[:top_k]:
            score = float(similarities[idx])
            # Include documents with some minimum score or top relevant docs
            if score > 0.05 or len(results) < 2:
                doc = self.documents[idx]
                excerpt = self._extract_relevant_excerpt(query, doc.get("content", ""))
                results.append({
                    "id": doc.get("id"),
                    "title": doc.get("title"),
                    "category": doc.get("category"),
                    "excerpt": excerpt,
                    "relevance_score": round(max(score * 100, 35.0), 1),
                    "scheme_code": doc.get("id", "").replace("doc_", "").upper()
                })

        return results

    def _extract_relevant_excerpt(self, query: str, content: str, max_chars: int = 260) -> str:
        # Split content into sentences
        sentences = re.split(r'(?<=[.!?])\s+', content.strip())
        if not sentences:
            return content[:max_chars]

        # Extract words from query
        query_words = set(re.findall(r'\b\w{4,}\b', query.lower()))
        
        best_sentence = sentences[0]
        max_overlap = -1
        
        for s in sentences:
            s_words = set(re.findall(r'\b\w{4,}\b', s.lower()))
            overlap = len(query_words.intersection(s_words))
            if overlap > max_overlap:
                max_overlap = overlap
                best_sentence = s

        # Build an excerpt around the best sentence
        excerpt = best_sentence
        if len(excerpt) < max_chars and len(sentences) > 1:
            idx = sentences.index(best_sentence)
            if idx + 1 < len(sentences):
                excerpt += " " + sentences[idx + 1]
            elif idx - 1 >= 0:
                excerpt = sentences[idx - 1] + " " + excerpt

        if len(excerpt) > max_chars:
            excerpt = excerpt[:max_chars - 3].rstrip() + "..."

        return excerpt

    def get_all_documents(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": doc.get("id"),
                "title": doc.get("title"),
                "category": doc.get("category"),
                "keywords": doc.get("keywords", []),
                "content": doc.get("content"),
                "char_count": len(doc.get("content", ""))
            }
            for doc in self.documents
        ]

rag_engine = RAGEngine()
