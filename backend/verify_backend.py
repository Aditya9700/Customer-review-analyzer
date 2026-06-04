import sys
import os
import json

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from services.sentiment_service import SentimentService
from services.category_service import CategoryService
from services.gemini_service import GeminiService
from database.mongodb import db

def run_tests():
    print("==================================================")
    print("      BACKEND LOCAL VERIFICATION SUITE")
    print("==================================================")

    # 1. Test Sentiment Analysis (VADER)
    print("\n[1/5] Testing VADER Sentiment Analyzer...")
    sentiment_service = SentimentService()
    
    test_pos = sentiment_service.analyze("The battery is excellent, very long lasting!")
    assert test_pos["sentiment"] == "Positive", f"Expected Positive, got {test_pos['sentiment']}"
    assert test_pos["sentiment_score"] >= 0.05
    print("  [OK] Positive Sentiment Test Passed.")

    test_neg = sentiment_service.analyze("Horrible quality, absolute garbage.")
    assert test_neg["sentiment"] == "Negative", f"Expected Negative, got {test_neg['sentiment']}"
    assert test_neg["sentiment_score"] <= -0.05
    print("  [OK] Negative Sentiment Test Passed.")

    test_neu = sentiment_service.analyze("It is a watch.")
    assert test_neu["sentiment"] == "Neutral", f"Expected Neutral, got {test_neu['sentiment']}"
    assert -0.05 < test_neu["sentiment_score"] < 0.05
    print("  [OK] Neutral Sentiment Test Passed.")

    # 2. Test Keyword Categorizer
    print("\n[2/5] Testing Keyword Categorization Service...")
    assert CategoryService.categorize("battery is charging fine") == "Battery"
    assert CategoryService.categorize("excellent sound quality from speakers") == "Audio"
    assert CategoryService.categorize("bluetooth connection fails pairing") == "Connectivity"
    assert CategoryService.categorize("AMOLED screen panel and bright display") == "Display"
    assert CategoryService.categorize("delivered by courier in perfect shape") == "Delivery"
    assert CategoryService.categorize("extreme lag and slow ui response speed") == "Performance"
    assert CategoryService.categorize("random words without keywords") == "Other"
    print("  [OK] Keyword Categorizer Tests Passed.")

    # 3. Test MongoDB connection and write capabilities
    print("\n[3/5] Testing MongoDB Connection...")
    class MockApp:
        config = {"MONGO_URI": Config.MONGO_URI}
        
    app = MockApp()
    try:
        db.init_app(app)
        coll = db.get_collection()
        print(f"  [OK] Connected to MongoDB. Database: '{db.db.name}', Collection: '{coll.name}'")
    except Exception as e:
        print(f"  [FAIL] MongoDB Connection Failed: {e}")
        print("  Please check that your MONGO_URI in .env is valid and cluster is running.")
        sys.exit(1)

    # 4. Test Demo Seeding and Metrics Calculations
    print("\n[4/5] Testing Database Seeding & Aggregations...")
    # Clear collections first to simulate seeding flow
    coll.delete_many({})
    print("  [OK] Database cleared.")
    
    # Run a simplified seeding
    demo_reviews = [
        {"review": "battery charging is slow", "product": "Noise ColorFit", "date": "2026-06-01"},
        {"review": "great sound system speakers", "product": "Noise Buds X", "date": "2026-06-02"},
        {"review": "laggy performance and slow speed", "product": "Noise ColorFit", "date": "2026-06-03"},
        {"review": "good screen display brightness", "product": "Noise ColorFit", "date": "2026-06-04"},
        {"review": "bluetooth disconnects frequently", "product": "Noise Buds X", "date": "2026-06-05"},
        {"review": "it is fine", "product": "Noise ColorFit", "date": "2026-06-06"}
    ]
    
    inserted_docs = []
    for item in demo_reviews:
        s_res = sentiment_service.analyze(item["review"])
        c_res = CategoryService.categorize(item["review"])
        inserted_docs.append({
            "review": item["review"],
            "date": item["date"],
            "product": item["product"],
            "sentiment": s_res["sentiment"],
            "sentiment_score": s_res["sentiment_score"],
            "category": c_res
        })
        
    result = coll.insert_many(inserted_docs)
    print(f"  [OK] Seeded {len(result.inserted_ids)} verification reviews.")
    
    # Verify counts
    total = coll.count_documents({})
    assert total == 6, f"Expected 6 documents, found {total}"
    print("  [OK] Document insert counts verified.")

    # 5. Test Gemini Fallback Summary Generation
    print("\n[5/5] Testing Gemini Summary Fallback...")
    metrics = {
        "total_reviews": 6,
        "positive_reviews": 2,
        "negative_reviews": 2,
        "neutral_reviews": 2,
        "positive_percentage": 33.33,
        "negative_percentage": 33.33,
        "neutral_percentage": 33.33,
        "average_sentiment_score": 0.02,
        "top_issue_category": "Connectivity",
        "category_distribution": {"Battery": 1, "Audio": 1, "Connectivity": 1, "Display": 1, "Performance": 1, "Other": 1}
    }
    
    report = GeminiService.generate_summary(None, metrics)
    print(json.dumps(report, indent=2))
    assert "executive_summary" in report
    assert "key_findings" in report
    assert len(report["key_findings"]) >= 1
    print("  [OK] Gemini fallback summary generated correctly.")

    print("\n==================================================")
    print("          ALL TEST SUITES PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
