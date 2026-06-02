import os
from dotenv import load_dotenv

# Load environmental variables from .env
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "A0AVbKvDSotyoqGT")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://adi_db_user:d31pKRPvqkP5dymV@cluster0.jrdi1qp.mongodb.net/Review-Sentiment-Analyzer?retryWrites=true&w=majority")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    
    # Model for Gemini reports
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
