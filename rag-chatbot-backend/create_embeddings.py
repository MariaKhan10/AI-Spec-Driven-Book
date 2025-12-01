import os
import glob
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# --------- CONFIG ---------
QDRANT_HOST = os.getenv('QDRANT_HOST')
QDRANT_API_KEY = os.getenv('QDRANT_API_KEY')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

COLLECTION_NAME = "book_embeddings"
DOCS_PATH = "../docs/Introducing_Physical_AI_&_Humanoid_Robotics/*.md"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
# --------------------------

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# Connect to Qdrant
client = QdrantClient(url=QDRANT_HOST, api_key=QDRANT_API_KEY)

# Ensure Qdrant collection exists
try:
    client.get_collection(collection_name=COLLECTION_NAME)
    print(f"Collection '{COLLECTION_NAME}' already exists.")
except Exception:
    print(f"Creating collection '{COLLECTION_NAME}'...")
    client.recreate_collection(
        collection_name=COLLECTION_NAME,
        vectors_config={
            "dense": VectorParams(size=768, distance=Distance.COSINE)
        }
    )
    print(f"Collection '{COLLECTION_NAME}' created.")


# Read markdown files
md_files = sorted(glob.glob(DOCS_PATH))
all_text = ""
for file in md_files:
    with open(file, "r", encoding="utf-8") as f:
        all_text += f.read() + "\n\n"

print(f"Read {len(md_files)} markdown files.")

# Split text into chunks
def split_text(text, chunk_size=500, overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

chunks = split_text(all_text, CHUNK_SIZE, CHUNK_OVERLAP)
print(f"Total chunks: {len(chunks)}")

# Generate embeddings & upload to Qdrant
points = []
for i, chunk in enumerate(chunks):
    emb_response = genai.embed_content(
        model="models/text-embedding-004",
        content=chunk,
        task_type="retrieval_document"
    )
    vector = emb_response["embedding"]

    points.append(
        PointStruct(
            id=i,
            vector={"dense": vector},
            payload={"text": chunk}
        )
    )

# Upsert points
client.upsert(collection_name=COLLECTION_NAME, points=points)
print(f"Inserted {len(points)} points into Qdrant collection '{COLLECTION_NAME}'")
