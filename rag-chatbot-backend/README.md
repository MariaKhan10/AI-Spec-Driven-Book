# RAG Chatbot Backend

## Setup
1. Rename `.env.example` to `.env` and fill your keys.
2. Install dependencies:
   ```
pip install -r requirements.txt
```
3. Run server:
   ```
python main.py
```
4. Chat endpoint: POST `http://localhost:8000/chat` with JSON `{ "message": "your question" }`

This backend handles:
- RAG querying using Qdrant embeddings
- Answer generation using OpenAI GPT-4.1
- FastAPI for HTTP interface
