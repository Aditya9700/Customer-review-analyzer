import logging
from datetime import datetime, timedelta
import pandas as pd
from flask import Blueprint, request, jsonify
from database.mongodb import db
from services.sentiment_service import SentimentService
from services.category_service import CategoryService

logger = logging.getLogger(__name__)
upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_csv():
    """
    Accepts and validates a CSV file, performs sentiment analysis and 
    categorization on each review, and inserts records into MongoDB.
    
    Required CSV Headers: review, date, product
    """
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file parameter in request. Use key 'file'."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected."}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({"success": False, "error": "Invalid file format. Only CSV files are supported."}), 400
        
    try:
        # Read CSV into a pandas DataFrame
        df = pd.read_csv(file)
        
        # Validate column headers
        required_headers = {"review", "date", "product"}
        if not required_headers.issubset(df.columns):
            return jsonify({
                "success": False,
                "error": f"CSV must contain headers: review, date, product. Found: {list(df.columns)}"
            }), 400
            
        # Filter out rows where review is null
        df = df.dropna(subset=["review"])
        
        sentiment_service = SentimentService()
        reviews_to_insert = []
        
        for _, row in df.iterrows():
            review_text = str(row["review"]).strip()
            if not review_text:
                continue
                
            # Date validation and normalization to YYYY-MM-DD
            raw_date = str(row["date"]).strip()
            try:
                parsed_date = pd.to_datetime(raw_date)
                if pd.isna(parsed_date):
                    formatted_date = datetime.utcnow().strftime("%Y-%m-%d")
                else:
                    formatted_date = parsed_date.strftime("%Y-%m-%d")
            except Exception:
                formatted_date = datetime.utcnow().strftime("%Y-%m-%d")
                
            product_name = str(row["product"]).strip() if pd.notna(row["product"]) else "Generic Product"
            
            # Run local NLP services
            sentiment_res = sentiment_service.analyze(review_text)
            category_res = CategoryService.categorize(review_text)
            
            reviews_to_insert.append({
                "review": review_text,
                "date": formatted_date,
                "product": product_name,
                "sentiment": sentiment_res["sentiment"],
                "sentiment_score": sentiment_res["sentiment_score"],
                "category": category_res,
                "created_at": datetime.utcnow()
            })
            
        if not reviews_to_insert:
            return jsonify({"success": False, "error": "No valid review records found in the uploaded file."}), 400
            
        coll = db.get_collection()
        result = coll.insert_many(reviews_to_insert)
        
        logger.info(f"Successfully uploaded and processed {len(result.inserted_ids)} reviews.")
        return jsonify({
            "success": True,
            "total_reviews": len(result.inserted_ids)
        }), 201
        
    except Exception as e:
        logger.error(f"Error uploading/processing reviews: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to process CSV file: {str(e)}"}), 500


@upload_bp.route("/demo-load", methods=["POST"])
def demo_load():
    """
    Clears the database reviews and populates it with a rich demo dataset
    spanning various categories, sentiments, dates, and products.
    """
    # 25 mock reviews covering all requested categories:
    # Battery, Audio, Connectivity, Display, Delivery, Performance, Other
    demo_reviews = [
        # Battery (Positive & Negative)
        ("The battery backup on Noise ColorFit is incredible! Lasts a solid 7 days on a single charge.", -5, "Noise ColorFit"),
        ("Extremely disappointed. The battery dies within 4 hours of charging, which makes it useless.", -2, "Noise ColorFit"),
        ("Charging speed is very fast. Goes from 10% to 100% in under 45 minutes, backup is decent.", -8, "Noise Buds X"),
        ("The charging case doesn't hold charge at all. Needs constant backup power.", -10, "Noise Buds X"),
        
        # Audio (Positive & Negative)
        ("Sound quality is clear and the bass is punchy. These speakers are excellent for music lovers.", -1, "Noise Buds X"),
        ("The microphone is horrible. People keep telling me they hear static audio or muffled sound during calls.", -3, "Noise Buds X"),
        ("Decent mic quality, sound is crisp, and the volume gets very loud without distortion.", -12, "Noise ColorFit"),
        
        # Connectivity (Positive & Negative)
        ("Bluetooth disconnects every 10 minutes. Extremely frustrating connectivity pairing process.", -4, "Noise Buds X"),
        ("Pairing was instant! The connection remains stable even when my phone is in another room.", -6, "Noise ColorFit"),
        ("Had pairing issues with my Android phone, but connects perfectly to my tablet. Bluetooth is okay.", -15, "Noise Buds X"),
        
        # Display (Positive & Negative)
        ("The display screen is bright and vivid. Easy to read even in direct bright sunlight.", -2, "Noise ColorFit"),
        ("The screen got scratched on day one, and the display brightness setting keeps resetting to low.", -11, "Noise ColorFit"),
        ("Stunning AMOLED display panel. Colors are deep and auto brightness functions perfectly.", -14, "Noise ColorFit"),
        
        # Delivery (Positive & Negative)
        ("Delivery was lightning fast! Received the product within 24 hours of ordering. Excellent courier service.", -3, "Noise ColorFit"),
        ("Terrible shipping experience. The package courier delayed it by a week and the retail box was crushed.", -13, "Noise Buds X"),
        ("The delivery arrived on time, but the courier left the package outside in the rain.", -20, "Noise ColorFit"),
        
        # Performance (Positive & Negative)
        ("This watch has terrible lag. Navigating the UI is slow and apps crash regularly.", -7, "Noise ColorFit"),
        ("Superb speed and lag-free UI performance. The software animations run at a smooth 60fps.", -9, "Noise ColorFit"),
        ("The watch lags when receiving multiple notifications. It feels slow under heavy load.", -18, "Noise ColorFit"),
        
        # Other (Positive, Negative, Neutral)
        ("Great watch band, very comfortable material. Build quality feels premium.", -1, "Noise ColorFit"),
        ("The strap broke within two weeks. Very cheap plastic build.", -16, "Noise ColorFit"),
        ("The watch color is slightly different from the website pictures, but it performs fine.", -17, "Noise ColorFit"),
        ("It's a standard smartwatch. Not great, not bad. Just average for the price.", -22, "Noise Buds X"),
        ("Overall decent product. Customer service was helpful when I asked questions.", -25, "Noise Buds X"),
        ("Exactly what I expected. No issues so far.", -30, "Noise Buds X")
    ]
    
    try:
        coll = db.get_collection()
        
        # Clear existing reviews
        coll.delete_many({})
        
        # Parse and process reviews using the local services
        sentiment_service = SentimentService()
        reviews_to_insert = []
        
        base_date = datetime.utcnow()
        
        for idx, (review_text, days_offset, product) in enumerate(demo_reviews):
            # Generate different dates spread out in time
            review_date = (base_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")
            
            sentiment_res = sentiment_service.analyze(review_text)
            category_res = CategoryService.categorize(review_text)
            
            reviews_to_insert.append({
                "review": review_text,
                "date": review_date,
                "product": product,
                "sentiment": sentiment_res["sentiment"],
                "sentiment_score": sentiment_res["sentiment_score"],
                "category": category_res,
                "created_at": datetime.utcnow()
            })
            
        result = coll.insert_many(reviews_to_insert)
        logger.info(f"Loaded {len(result.inserted_ids)} demo reviews into the database.")
        
        return jsonify({
            "success": True,
            "message": "Demo database successfully seeded.",
            "total_reviews": len(result.inserted_ids)
        }), 201
        
    except Exception as e:
        logger.error(f"Error seeding demo reviews: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to seed demo data: {str(e)}"}), 500
