import logging
import math
from flask import Blueprint, request, jsonify
from database.mongodb import db
from utils.helpers import serialize_doc

logger = logging.getLogger(__name__)
reviews_bp = Blueprint("reviews", __name__)

@reviews_bp.route("/reviews", methods=["GET"])
def get_reviews():
    """
    Returns a paginated list of reviews.
    
    Query Params:
        - page: int (default: 1)
        - limit: int (default: 20)
        - sentiment: str (Optional, 'Positive', 'Negative', 'Neutral')
        - category: str (Optional, e.g. 'Battery')
        - search: str (Optional, case-insensitive substring match on 'review')
    """
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
    except ValueError:
        page = 1
        limit = 20
        
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 20
        
    sentiment = request.args.get("sentiment")
    category = request.args.get("category")
    search = request.args.get("search")
    
    # Build filter query
    query = {}
    
    if sentiment:
        query["sentiment"] = sentiment
        
    if category:
        query["category"] = category
        
    if search:
        # Match search term in review text using regex substring match, case-insensitive
        query["review"] = {"$regex": search, "$options": "i"}
        
    try:
        coll = db.get_collection()
        total_reviews = coll.count_documents(query)
        
        skip = (page - 1) * limit
        
        # Retrieve and sort (newest review dates and created_at timestamps first)
        cursor = coll.find(query).sort([("date", -1), ("created_at", -1)]).skip(skip).limit(limit)
        reviews_list = [serialize_doc(r) for r in cursor]
        
        total_pages = math.ceil(total_reviews / limit) if total_reviews > 0 else 0
        
        return jsonify({
            "reviews": reviews_list,
            "total_reviews": total_reviews,
            "page": page,
            "limit": limit,
            "pages": total_pages
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving reviews: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to retrieve reviews: {str(e)}"}), 500
