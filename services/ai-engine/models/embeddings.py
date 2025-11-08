"""
Embedding generation service using sentence-transformers.
Provides semantic understanding of profiles and jobs.
"""
import numpy as np
from typing import List, Dict, Optional
from sentence_transformers import SentenceTransformer
from functools import lru_cache
import logging

from config import Config

logger = logging.getLogger(__name__)


class EmbeddingService:
    """
    Singleton service for generating semantic embeddings.
    Uses sentence-transformers for efficient, local embedding generation.
    """

    _instance: Optional['EmbeddingService'] = None
    _model: Optional[SentenceTransformer] = None

    def __new__(cls):
        """Singleton pattern to ensure single model instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize the embedding model (lazy loading)."""
        if self._model is None:
            self._load_model()

    def _load_model(self):
        """Load the sentence transformer model."""
        try:
            logger.info(f"Loading embedding model: {Config.EMBEDDING_MODEL}")
            self._model = SentenceTransformer(Config.EMBEDDING_MODEL)
            logger.info(f"Model loaded successfully. Dimension: {Config.EMBEDDING_DIMENSION}")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise

    @property
    def model(self) -> SentenceTransformer:
        """Get the model instance."""
        if self._model is None:
            self._load_model()
        return self._model

    def embed_text(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single text.

        Args:
            text: Input text to embed

        Returns:
            Embedding vector as numpy array
        """
        if not text or not text.strip():
            return np.zeros(Config.EMBEDDING_DIMENSION)

        try:
            embedding = self.model.encode(
                text,
                convert_to_numpy=True,
                normalize_embeddings=True,  # L2 normalization for cosine similarity
                show_progress_bar=False
            )
            return embedding
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return np.zeros(Config.EMBEDDING_DIMENSION)

    def embed_batch(self, texts: List[str], batch_size: Optional[int] = None) -> np.ndarray:
        """
        Generate embeddings for multiple texts efficiently.

        Args:
            texts: List of texts to embed
            batch_size: Batch size for processing (uses config default if None)

        Returns:
            Array of embedding vectors
        """
        if not texts:
            return np.array([])

        batch_size = batch_size or Config.BATCH_SIZE

        try:
            embeddings = self.model.encode(
                texts,
                batch_size=batch_size,
                convert_to_numpy=True,
                normalize_embeddings=True,
                show_progress_bar=len(texts) > 100
            )
            return embeddings
        except Exception as e:
            logger.error(f"Batch embedding generation failed: {e}")
            return np.zeros((len(texts), Config.EMBEDDING_DIMENSION))

    def embed_profile(self, profile: Dict) -> np.ndarray:
        """
        Generate embedding for a user profile.

        Args:
            profile: User profile dictionary

        Returns:
            Profile embedding vector
        """
        # Construct rich profile text
        parts = []

        # Skills are most important
        if profile.get('skills'):
            parts.append(f"Skills: {', '.join(profile['skills'])}")

        # Roles and career goals
        if profile.get('roles'):
            parts.append(f"Target roles: {', '.join(profile['roles'])}")

        if profile.get('goal'):
            parts.append(f"Career goal: {profile['goal']}")

        # Experience context
        if profile.get('experience_level'):
            parts.append(f"Experience level: {profile['experience_level']}")

        if profile.get('years_of_experience'):
            parts.append(f"{profile['years_of_experience']} years of experience")

        # Industries
        if profile.get('industries'):
            parts.append(f"Industries: {', '.join(profile['industries'])}")

        # Work preferences
        if profile.get('work_style'):
            parts.append(f"Prefers {profile['work_style']} work")

        # CV text for deep semantic understanding
        if profile.get('cv_text'):
            parts.append(f"Background: {profile['cv_text'][:1000]}")  # Limit length

        profile_text = ". ".join(parts)
        return self.embed_text(profile_text)

    def embed_job(self, job: Dict) -> np.ndarray:
        """
        Generate embedding for a job posting.

        Args:
            job: Job posting dictionary

        Returns:
            Job embedding vector
        """
        # Construct rich job text
        parts = [
            f"Job title: {job.get('title', '')}",
            f"Company: {job.get('company', '')}",
        ]

        if job.get('description'):
            parts.append(f"Description: {job['description'][:500]}")  # Limit length

        if job.get('requirements'):
            parts.append(f"Requirements: {', '.join(job['requirements'])}")

        if job.get('tags'):
            parts.append(f"Tags: {', '.join(job['tags'])}")

        if job.get('work_type'):
            parts.append(f"Work type: {job['work_type']}")

        job_text = ". ".join(parts)
        return self.embed_text(job_text)

    @staticmethod
    def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vectors.
        Assumes vectors are already normalized (from embed_* methods).

        Args:
            a: First vector
            b: Second vector

        Returns:
            Cosine similarity score (0-1)
        """
        if a.size == 0 or b.size == 0:
            return 0.0

        # Since vectors are normalized, dot product = cosine similarity
        similarity = np.dot(a, b)
        return float(max(0.0, min(1.0, similarity)))  # Clamp to [0, 1]

    def is_ready(self) -> bool:
        """Check if the embedding service is ready."""
        try:
            return self._model is not None
        except:
            return False


# Global singleton instance
embedding_service = EmbeddingService()
