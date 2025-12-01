import uvicorn
from chatkit_server import app
import os

PORT = int(os.getenv('PORT', 8000))

if __name__ == "__main__":
    # Bind to 127.0.0.1 for local development
    uvicorn.run(app, host="127.0.0.1", port=PORT)

