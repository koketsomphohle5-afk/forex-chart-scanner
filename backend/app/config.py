import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    CLAUDE_API_KEY = os.getenv("CLAUDE_API_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./forex_scanner.db")
    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    
    @staticmethod
    def validate():
        if not Config.CLAUDE_API_KEY:
            raise ValueError("CLAUDE_API_KEY not set in environment variables")

Config.validate()
