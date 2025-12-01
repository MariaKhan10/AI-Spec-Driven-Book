from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

from vector_store import qdrant, COLLECTION_NAME

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


async def rag_query(user_question: str):
    print("User question:", user_question)

    # 1️⃣ Get embedding for question
    try:
        emb_response = genai.embed_content(
            model="models/gemini-embedding-001",
            content=user_question,
            task_type="RETRIEVAL_QUERY"  # Free tier friendly
        )
        print("Embedding response:", emb_response)
        user_vector = emb_response["embedding"]
        print("User vector length:", len(user_vector))
    except Exception as e:
        print("Error generating embedding:", e)
        return "Sorry, embedding generation failed."

    # 2️⃣ Search Qdrant (old client compatible)
    try:
        hits = qdrant.search_points(
        collection_name=COLLECTION_NAME,
        query_vector=user_vector,
        limit=3,
        vector_name="dense"
    )

        print("Raw Qdrant hits:", hits)

        # Extract context texts safely
        context_texts = []
        for hit in hits:
            # Some clients return dict, some return object
            payload = getattr(hit, "payload", None) or hit.get("payload", None)
            if payload and "text" in payload:
                context_texts.append(payload["text"])

        if not context_texts:
            return "Sorry, I couldn't find relevant context to answer that."

    except Exception as e:
        print("Error searching Qdrant:", e)
        return "Sorry, failed to search the knowledge base."

    # 3️⃣ Prepare prompt
    prompt = (
        f"Answer the question based ONLY on the following context:\n\n"
        f"{context_texts}\n\n"
        f"Question: {user_question}\nAnswer:"
    )
    print("Prompt sent to Gemini:", prompt)

    # 4️⃣ Generate answer
    try:
        response = await model.generate_content(prompt)
        print("Gemini response object:", response)
        return response.text if hasattr(response, "text") else "No answer generated."
    except Exception as e:
        print("Error generating response:", e)
        return "Sorry, failed to generate an answer."


@app.post("/chat")
async def chat_endpoint(req: Request):
    try:
        data = await req.json()
        question = data.get("message")
        if not question:
            return {"error": "No message provided"}

        answer = await rag_query(question)
        return {"reply": answer}

    except Exception as e:
        print("Error in /chat endpoint:", e)
        return {"error": str(e)}


@app.get("/")
async def root():
    return {"message": "Server is running!"}
