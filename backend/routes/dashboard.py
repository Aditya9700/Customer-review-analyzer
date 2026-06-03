import logging
from flask import Blueprint, jsonify
from database.mongodb import db

logger = logging.getLogger(__name__)
dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    """
    Computes dashboard analytics from MongoDB:
    - total_reviews
    - positive_reviews, negative_reviews, neutral_reviews
    - positive_percentage, negative_percentage, neutral_percentage
    - average_sentiment_score
    - top_issue_category
    - category_distribution
    """
    coll = db.get_collection()
    
    # 1. Base counts & sentiment aggregation
    pipeline_base = [
        {
            "$group": {
                "_id": None,
                "total_reviews": {"$sum": 1},
                "positive_reviews": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Positive"]}, 1, 0]}},
                "negative_reviews": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Negative"]}, 1, 0]}},
                "neutral_reviews": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Neutral"]}, 1, 0]}},
                "total_score": {"$sum": "$sentiment_score"}
            }
        }
    ]
    
    try:
        base_results = list(coll.aggregate(pipeline_base))
    except Exception as e:
        logger.error(f"Error calculating dashboard aggregates: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Database aggregation error: {str(e)}"}), 500
        
    # If the collection is empty, return default empty statistics
    if not base_results:
        return jsonify({
            "total_reviews": 0,
            "positive_reviews": 0,
            "negative_reviews": 0,
            "neutral_reviews": 0,
            "positive_percentage": 0.0,
            "negative_percentage": 0.0,
            "neutral_percentage": 0.0,
            "average_sentiment_score": 0.0,
            "top_issue_category": "None",
            "category_distribution": {
                "Battery": 0,
                "Audio": 0,
                "Connectivity": 0,
                "Display": 0,
                "Delivery": 0,
                "Performance": 0,
                "Other": 0
            }
        }), 200
        
    metrics = base_results[0]
    total = metrics["total_reviews"]
    pos = metrics["positive_reviews"]
    neg = metrics["negative_reviews"]
    neu = metrics["neutral_reviews"]
    total_score = metrics["total_score"]
    
    # Percentages
    pos_p = round((pos / total) * 100, 2) if total > 0 else 0.0
    neg_p = round((neg / total) * 100, 2) if total > 0 else 0.0
    neu_p = round((neu / total) * 100, 2) if total > 0 else 0.0
    avg_score = round(total_score / total, 4) if total > 0 else 0.0
    
    # 2. Category Distribution Aggregation
    pipeline_cat = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    
    expected_categories = ["Battery", "Audio", "Connectivity", "Display", "Delivery", "Performance", "Other"]
    category_distribution = {cat: 0 for cat in expected_categories}
    
    try:
        cat_results = list(coll.aggregate(pipeline_cat))
        for item in cat_results:
            cat_name = item["_id"]
            if cat_name in category_distribution:
                category_distribution[cat_name] = item["count"]
            else:
                category_distribution["Other"] = category_distribution.get("Other", 0) + item["count"]
    except Exception as e:
        logger.warning(f"Failed to fetch category distribution: {e}")
        
    # 3. Determine top issue category
    # Filter out 'Other' and sort by count of negative reviews descending,
    # then by average sentiment score ascending (lowest score is worse).
    pipeline_issues = [
        {"$match": {"category": {"$ne": "Other"}}},
        {
            "$group": {
                "_id": "$category",
                "negative_count": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Negative"]}, 1, 0]}},
                "average_score": {"$avg": "$sentiment_score"}
            }
        },
        # Sort by negative count descending, and average sentiment score ascending (worst first)
        {"$sort": {"negative_count": -1, "average_score": 1}}
    ]
    
    top_issue = "None"
    try:
        issue_results = list(coll.aggregate(pipeline_issues))
        if issue_results:
            # We pick the category with the most negative reviews,
            # or if negative count is tied/zero, the one with lowest average sentiment.
            top_issue = issue_results[0]["_id"]
    except Exception as e:
        logger.warning(f"Failed to calculate top issue category: {e}")
        
    return jsonify({
        "total_reviews": total,
        "positive_reviews": pos,
        "negative_reviews": neg,
        "neutral_reviews": neu,
        "positive_percentage": pos_p,
        "negative_percentage": neg_p,
        "neutral_percentage": neu_p,
        "average_sentiment_score": avg_score,
        "top_issue_category": top_issue,
        "category_distribution": category_distribution
    }), 200
