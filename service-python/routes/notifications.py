
from flask import Blueprint, request, jsonify
import uuid
from models.db import get_db_connection
from auth import token_required

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route("/notifications", methods=["POST"])
@token_required
def create_notification():
    data = request.get_json()
    user_id = data.get("user_id")
    message = data.get("message")
    notification_type = data.get("type", "info")
    if not user_id or not isinstance(user_id, str) or not user_id.strip():
        return jsonify({"error": "user_id is required and must be a non-empty string"}), 400
    if not message or not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message is required and must be a non-empty string"}), 400
    notification_id = str(uuid.uuid4())
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)",
        (notification_id, user_id, message, notification_type),
    )
    conn.commit()
    conn.close()
    return jsonify({"id": notification_id, "message": "Notification created successfully"}), 201

@notifications_bp.route("/notifications/<user_id>", methods=["GET"])
@token_required
def get_notifications(user_id):
    try:
        conn = get_db_connection()
        notifications = conn.execute(
            "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
        conn.close()
        result = [dict(notif) for notif in notifications]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error in get_notifications: {e}")
        return jsonify({"error": "Failed to fetch notifications"}), 500

@notifications_bp.route("/notifications/<notification_id>/read", methods=["PUT"])
@token_required
def mark_as_read(notification_id):
    conn = get_db_connection()
    result = conn.execute(
        "UPDATE notifications SET read = 1 WHERE id = ?", (notification_id,)
    )
    conn.commit()
    if result.rowcount == 0:
        conn.close()
        return jsonify({"error": "Notification not found"}), 404
    conn.close()
    return jsonify({"message": "Marked as read"}), 200
