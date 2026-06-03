import logging
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

class SentimentService:
    def __init__(self):
        """
        Initializes the VADER SentimentIntensityAnalyzer.
        """
        self.analyzer = SentimentIntensityAnalyzer()

    def analyze(self, text: str) -> dict:
        """
        Analyzes the sentiment of the text.
        
        Rules:
        - compound >= 0.05 => Positive
        - compound <= -0.05 => Negative
        - otherwise => Neutral
        
        Returns:
            dict: {
                "sentiment": str,          # 'Positive', 'Negative', or 'Neutral'
                "sentiment_score": float   # VADER compound score
            }
        """
        if not text or not isinstance(text, str):
            return {
                "sentiment": "Neutral",
                "sentiment_score": 0.0
            }
            
        try:
            scores = self.analyzer.polarity_scores(text)
            compound = scores.get("compound", 0.0)
            
            if compound >= 0.05:
                sentiment = "Positive"
            elif compound <= -0.05:
                sentiment = "Negative"
            else:
                sentiment = "Neutral"
                
            return {
                "sentiment": sentiment,
                "sentiment_score": compound
            }
        except Exception as e:
            logger.error(f"Error executing sentiment analysis: {e}")
            return {
                "sentiment": "Neutral",
                "sentiment_score": 0.0
            }
