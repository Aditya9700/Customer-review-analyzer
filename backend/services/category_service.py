import re
import logging

logger = logging.getLogger(__name__)

class CategoryService:
    # Keyword rules defined in specifications
    KEYWORDS = {
        "Battery": ["battery", "charging", "charge", "backup"],
        "Audio": ["audio", "sound", "speaker", "mic"],
        "Connectivity": ["bluetooth", "connection", "pairing", "disconnect"],
        "Display": ["display", "screen", "brightness"],
        "Delivery": ["delivery", "shipping", "courier"],
        "Performance": ["lag", "slow", "performance", "speed"]
    }

    @classmethod
    def categorize(cls, text: str) -> str:
        """
        Categorizes a review based on presence of keywords.
        Returns the category name if matched, else 'Other'.
        
        This uses word-start boundary matching to support variations 
        (e.g., 'disconnects' matches 'disconnect') while preventing 
        false positives (e.g., 'message' matching 'mess' if 'mess' was a keyword).
        """
        if not text or not isinstance(text, str):
            return "Other"

        text_lower = text.lower()
        
        # Check matching score (occurrence count of keywords) for each category
        match_scores = {}
        for category, keywords in cls.KEYWORDS.items():
            score = 0
            for kw in keywords:
                # Use regex with word-start boundary boundary to capture plurals/suffixes
                # e.g., \bdisconnect will match 'disconnect', 'disconnects', 'disconnecting'
                pattern = rf"\b{re.escape(kw)}"
                matches = re.findall(pattern, text_lower)
                score += len(matches)
            
            if score > 0:
                match_scores[category] = score
                
        if not match_scores:
            return "Other"
            
        # Select the category with the highest matching frequency.
        # If there is a tie, return the one defined earliest in the list.
        best_category = max(match_scores, key=match_scores.get)
        return best_category
