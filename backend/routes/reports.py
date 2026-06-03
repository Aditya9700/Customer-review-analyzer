import logging
from flask import Blueprint, jsonify, current_app, send_file
from database.mongodb import db
from services.gemini_service import GeminiService
from services.export_service import ExportService

logger = logging.getLogger(__name__)
reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/trends", methods=["GET"])
def get_trends():
    """
    Returns monthly sentiment trends suitable for graphing.
    Groups reviews by 'YYYY-MM' from the review dates.
    """
    coll = db.get_collection()
    
    pipeline = [
        # Project month segment from date string (format YYYY-MM-DD or YYYY-MM)
        {
            "$project": {
                "month": {"$substr": ["$date", 0, 7]},
                "sentiment": 1,
                "sentiment_score": 1
            }
        },
        # Group by month and count sentiments
        {
            "$group": {
                "_id": "$month",
                "positive": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Positive"]}, 1, 0]}},
                "negative": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Negative"]}, 1, 0]}},
                "neutral": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Neutral"]}, 1, 0]}},
                "average_score": {"$avg": "$sentiment_score"},
                "total_reviews": {"$sum": 1}
            }
        },
        # Sort by month ascending
        {"$sort": {"_id": 1}}
    ]
    
    try:
        results = list(coll.aggregate(pipeline))
        trends = []
        for r in results:
            month_val = r["_id"] if r["_id"] else "Unknown"
            trends.append({
                "month": month_val,
                "positive": r["positive"],
                "negative": r["negative"],
                "neutral": r["neutral"],
                "total_reviews": r["total_reviews"],
                "average_sentiment_score": round(r["average_score"], 4) if r["average_score"] is not None else 0.0
            })
            
        return jsonify(trends), 200
    except Exception as e:
        logger.error(f"Error fetching monthly trends: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to compute monthly trends: {str(e)}"}), 500


@reports_bp.route("/product-performance", methods=["GET"])
def get_product_performance():
    """
    Returns performance metrics grouped by product, including review counts 
    and sentiment percentages.
    """
    coll = db.get_collection()
    
    pipeline = [
        {
            "$group": {
                "_id": "$product",
                "total": {"$sum": 1},
                "positive": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Positive"]}, 1, 0]}},
                "negative": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Negative"]}, 1, 0]}},
                "neutral": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Neutral"]}, 1, 0]}},
                "average_score": {"$avg": "$sentiment_score"}
            }
        },
        {"$sort": {"total": -1}}
    ]
    
    try:
        results = list(coll.aggregate(pipeline))
        product_performance = []
        for r in results:
            total = r["total"]
            product_performance.append({
                "product": r["_id"] if r["_id"] else "Unknown Product",
                "total_reviews": total,
                "positive_percentage": round((r["positive"] / total) * 100, 2) if total > 0 else 0.0,
                "negative_percentage": round((r["negative"] / total) * 100, 2) if total > 0 else 0.0,
                "neutral_percentage": round((r["neutral"] / total) * 100, 2) if total > 0 else 0.0,
                "average_sentiment_score": round(r["average_score"], 4) if r["average_score"] is not None else 0.0
            })
            
        return jsonify(product_performance), 200
    except Exception as e:
        logger.error(f"Error fetching product performance: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to compute product performance: {str(e)}"}), 500


@reports_bp.route("/executive-summary", methods=["GET"])
def get_executive_summary():
    """
    Aggregates overall metrics and builds a structured AI narrative 
    using Google Gemini API based on actual data.
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
        if not base_results or base_results[0]["total_reviews"] == 0:
            # Return empty structure immediately if no data exists
            return jsonify(GeminiService.generate_summary(None, {}))
            
        metrics = base_results[0]
        total = metrics["total_reviews"]
        pos = metrics["positive_reviews"]
        neg = metrics["negative_reviews"]
        neu = metrics["neutral_reviews"]
        total_score = metrics["total_score"]
        
        pos_p = round((pos / total) * 100, 2)
        neg_p = round((neg / total) * 100, 2)
        neu_p = round((neu / total) * 100, 2)
        avg_score = round(total_score / total, 4)
        
        # 2. Get top issue category
        pipeline_issues = [
            {"$match": {"category": {"$ne": "Other"}}},
            {
                "$group": {
                    "_id": "$category",
                    "negative_count": {"$sum": {"$cond": [{"$eq": ["$sentiment", "Negative"]}, 1, 0]}},
                    "average_score": {"$avg": "$sentiment_score"}
                }
            },
            {"$sort": {"negative_count": -1, "average_score": 1}}
        ]
        issue_results = list(coll.aggregate(pipeline_issues))
        top_issue = issue_results[0]["_id"] if issue_results else "None"
        
        # 3. Get category distribution
        pipeline_cat = [
            {"$group": {"_id": "$category", "count": {"$sum": 1}}}
        ]
        cat_results = list(coll.aggregate(pipeline_cat))
        category_distribution = {item["_id"]: item["count"] for item in cat_results}
        
        # Structure the payload
        metrics_payload = {
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
        }
        
        # Retrieve credentials and call Gemini
        api_key = current_app.config.get("GEMINI_API_KEY")
        model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")
        
        logger.info("Triggering Gemini Executive Summary Report...")
        report = GeminiService.generate_summary(api_key, metrics_payload, model_name)
        return jsonify(report), 200
        
    except Exception as e:
        logger.error(f"Error generating executive summary: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to generate summary: {str(e)}"}), 500


@reports_bp.route("/export/csv", methods=["GET"])
def export_csv():
    """
    Queries all reviews in the system and exports them in the CSV format
    expected by Power BI.
    """
    try:
        coll = db.get_collection()
        
        # Retrieve reviews projection (exclude MongoDB internal id)
        reviews = list(coll.find({}, {
            "_id": 0,
            "review": 1,
            "date": 1,
            "product": 1,
            "sentiment": 1,
            "sentiment_score": 1,
            "category": 1
        }))
        
        # Generate CSV payload stream
        csv_buffer = ExportService.generate_csv(reviews)
        
        return send_file(
            csv_buffer,
            mimetype="text/csv",
            as_attachment=True,
            download_name="processed_reviews.csv"
        )
        
    except Exception as e:
        logger.error(f"Error exporting reviews to CSV: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to export data: {str(e)}"}), 500
