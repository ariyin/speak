from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()  
PORT = int(os.getenv("PORT"))  

if __name__ == "__main__":
    uvicorn.run("server.app:app", host="0.0.0.0", port=PORT, reload=True)