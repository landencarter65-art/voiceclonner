from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HUGGING_FACE_SPACE_URL = os.getenv("HUGGING_FACE_SPACE_URL", "http://localhost:7860")

class TTSRequest(BaseModel):
    text: str
    speaker: str = "Vivian"
    language: str = "English"
    instruct: str = "A warm, gentle tone."

@app.get("/")
async def root():
    return {"message": "Voice Cloning SaaS Backend"}

@app.post("/generate")
async def generate_voice(request: TTSRequest):
    try:
        # Forward request to Hugging Face Space
        response = requests.post(
            f"{HUGGING_FACE_SPACE_URL}/generate",
            json=request.dict(),
            timeout=120
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"AI Service Error: {response.text}")
            
        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clone")
async def clone_voice(
    text: str = Form(...),
    reference_text: str = Form(...),
    language: str = Form("English"),
    audio_file: UploadFile = File(...)
):
    try:
        # Read file content
        file_content = await audio_file.read()
        
        # Prepare multipart data
        files = {
            'audio_file': (audio_file.filename, file_content, audio_file.content_type)
        }
        data = {
            'text': text,
            'reference_text': reference_text,
            'language': language
        }
        
        # Forward to Hugging Face
        response = requests.post(
            f"{HUGGING_FACE_SPACE_URL}/clone",
            data=data,
            files=files,
            timeout=120 # Increased timeout for cloning
        )
        
        if response.status_code != 200:
             raise HTTPException(status_code=response.status_code, detail=f"AI Service Cloning Error: {response.text}")

        return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
