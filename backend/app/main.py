from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from app.routes import analysis
from app.services.chart_analyzer import ChartAnalyzer

load_dotenv()

app = FastAPI(
    title="Forex Chart Scanner",
    description="AI-powered Smart Money Concepts analysis for Forex charts",
    version="1.0.0"
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(analysis.router, prefix="/api", tags=["analysis"])

@app.get("/")
async def root():
    return {"message": "Forex Chart Scanner API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
