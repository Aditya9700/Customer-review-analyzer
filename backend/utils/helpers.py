from datetime import datetime
from bson import ObjectId

def serialize_doc(doc):
    """
    Converts a MongoDB document (BSON) into a JSON-serializable Python dictionary.
    - Maps ObjectId to its string representation.
    - Formats datetime values to ISO 8601 strings.
    """
    if doc is None:
        return None
        
    # Create shallow copy of the dict to prevent altering MongoDB local cache
    serialized = dict(doc)
    
    if "_id" in serialized:
        serialized["_id"] = str(serialized["_id"])
        
    for key, val in serialized.items():
        if isinstance(val, datetime):
            serialized[key] = val.isoformat()
            
    return serialized
