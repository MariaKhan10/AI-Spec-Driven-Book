from qdrant_client import QdrantClient
import os

QDRANT_HOST = os.getenv('QDRANT_HOST')
QDRANT_API_KEY = os.getenv('QDRANT_API_KEY')

qdrant = QdrantClient(url=QDRANT_HOST, api_key=QDRANT_API_KEY)
COLLECTION_NAME = "book_embeddings"
