from flask import Blueprint, request, jsonify
import uuid
import json
from models.db import get_db_connection
from auth import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route("/analytics/track", methods=["POST"])
@token_required
def track_event():
    requestData = request.get_json()
    eventType = requestData.get("event_type")
    userId = requestData.get("user_id")
    eventData = requestData.get("data", {})
    if not eventType:
        return {"error": "event_type is required"}, 400
    analyticsId = str(uuid.uuid4())
    db = get_db_connection()
    db.execute(
        "INSERT INTO analytics (id, event_type, user_id, data) VALUES (?, ?, ?, ?)",
        (analyticsId, eventType, userId, json.dumps(eventData)),
    )
    db.commit()
    db.close()
    return {"success": True, "event_id": analyticsId}, 201

@analytics_bp.route("/analytics/stats/<user_id>", methods=["GET"])
@token_required
def get_user_stats(user_id):
    try:
        connection = get_db_connection()
        events = connection.execute(
            "SELECT event_type, COUNT(*) as count FROM analytics WHERE user_id = ? GROUP BY event_type",
            (user_id,),
        ).fetchall()
        total_events = connection.execute(
            "SELECT COUNT(*) as total FROM analytics WHERE user_id = ?", (user_id,)
        ).fetchone()
        connection.close()
        stats = {
            "user_id": user_id,
            "total_events": (
                total_events["total"] if total_events and "total" in total_events.keys() else 0
            ),
            "events_by_type": {},
        }
        for event in events:
            stats["events_by_type"][event["event_type"]] = event["count"]
        return jsonify(stats), 200
    except Exception as e:
        print(f"Error in get_user_stats: {e}")
        return jsonify({"error": "Failed to fetch stats"}), 500
