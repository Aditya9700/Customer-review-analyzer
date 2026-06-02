import logging
from pymongo import MongoClient

logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None
        self.reviews_collection = None

    def init_app(self, app):
        """
        Initializes the MongoDB client using the MONGO_URI in app config.
        """
        mongo_uri = app.config.get("MONGO_URI")
        if not mongo_uri:
            logger.error("MONGO_URI is not set in Flask configuration!")
            raise ValueError("MONGO_URI must be provided.")
        
        try:
            # Connect to MongoDB Atlas
            logger.info("Connecting to MongoDB Atlas...")
            self.client = MongoClient(mongo_uri)
            
            # Retrieve the default database or fallback to 'Review-Sentiment-Analyzer'
            try:
                self.db = self.client.get_default_database()
                if self.db is None:
                    self.db = self.client["Review-Sentiment-Analyzer"]
            except Exception:
                self.db = self.client["Review-Sentiment-Analyzer"]
                
            self.reviews_collection = self.db["reviews"]
            
            # Ping database to confirm connection
            self.client.admin.command('ping')
            logger.info(f"Successfully connected to MongoDB database: {self.db.name}")
        except Exception as e:
            logger.critical(f"Failed to connect to MongoDB: {e}")
            raise e

    def get_collection(self):
        """
        Returns the primary reviews collection.
        """
        if self.reviews_collection is None:
            raise RuntimeError("Database not initialized. Call init_app first.")
        return self.reviews_collection

# Global database client instance
db = MongoDB()
