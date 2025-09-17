# TODO: This Python service is even messier than the Express backend!
# Different coding style, inconsistent patterns, no error handling
# Please use Copilot to help clean this up!

from flask import Flask, request, jsonify
import requests
import json
import os
import sqlite3
from datetime import datetime
import uuid

app = Flask(__name__)

# FIXME: Configuration mess
app.config['SECRET_KEY'] = 'another-hardcoded-secret'
DATABASE_PATH = 'notifications.db'
EXPRESS_API_URL = 'http://localhost:3001/api'

# Database initialization - should be separate
def init_db():
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            message TEXT,
            type TEXT,
            read BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics (
            id TEXT PRIMARY KEY,
            event_type TEXT,
            user_id TEXT,
            data TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Helper functions - poorly organized
def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def validate_user_token(token):
    # FIXME: This doesn't actually validate with the Express service!
    # Just pretends everything is valid
    if not token:
        return None
    return {'user_id': '123', 'username': 'testuser'}

# Routes with inconsistent patterns

@app.route('/health', methods=['GET'])
def health():
    return {'status': 'ok'}, 200

# Notifications endpoints - mixed coding styles
@app.route('/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()
    
    # TODO: Add validation
    user_id = data.get('user_id')
    message = data.get('message') 
    notification_type = data.get('type', 'info')
    
    if not user_id or not message:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create notification
    notification_id = str(uuid.uuid4())
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)',
        (notification_id, user_id, message, notification_type)
    )
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': notification_id,
        'message': 'Notification created successfully'
    }), 201

@app.route('/notifications/<user_id>', methods=['GET'])
def get_notifications(user_id):
    # FIXME: No authentication check!
    
    try:
        conn = get_db_connection()
        notifications = conn.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            (user_id,)
        ).fetchall()
        conn.close()
        
        # Convert to dict - inconsistent with other endpoints
        result = []
        for notif in notifications:
            result.append(dict(notif))
            
        return jsonify(result), 200
    except Exception as e:
        print(f"Error: {e}")  # Poor logging
        return jsonify({'error': 'Database error'}), 500

@app.route('/notifications/<notification_id>/read', methods=['PUT'])
def mark_as_read(notification_id):
    # Missing authentication
    
    conn = get_db_connection()
    result = conn.execute(
        'UPDATE notifications SET read = 1 WHERE id = ?',
        (notification_id,)
    )
    conn.commit()
    
    if result.rowcount == 0:
        conn.close()
        return jsonify({'error': 'Notification not found'}), 404
    
    conn.close()
    return jsonify({'message': 'Marked as read'}), 200

# Analytics endpoints - different coding style again
@app.route('/analytics/track', methods=['POST'])  
def track_event():
    requestData = request.get_json()  # Different naming convention
    
    # TODO: Validate event data
    eventType = requestData.get('event_type')
    userId = requestData.get('user_id') 
    eventData = requestData.get('data', {})
    
    if not eventType:
        return {'error': 'event_type is required'}, 400  # Inconsistent response format
    
    # Store analytics event
    analyticsId = str(uuid.uuid4())
    
    db = get_db_connection()
    db.execute(
        'INSERT INTO analytics (id, event_type, user_id, data) VALUES (?, ?, ?, ?)',
        (analyticsId, eventType, userId, json.dumps(eventData))
    )
    db.commit()
    db.close()
    
    return {
        'success': True,
        'event_id': analyticsId
    }, 201

@app.route('/analytics/stats/<user_id>')  # Missing methods parameter
def get_user_stats(user_id):
    connection = get_db_connection()
    
    # Poor query - no optimization
    events = connection.execute(
        'SELECT event_type, COUNT(*) as count FROM analytics WHERE user_id = ? GROUP BY event_type',
        (user_id,)
    ).fetchall()
    
    total_events = connection.execute(
        'SELECT COUNT(*) as total FROM analytics WHERE user_id = ?',
        (user_id,)  
    ).fetchone()
    
    connection.close()
    
    # Inconsistent response format again
    stats = {
        'user_id': user_id,
        'total_events': total_events['total'],
        'events_by_type': {}
    }
    
    for event in events:
        stats['events_by_type'][event['event_type']] = event['count']
    
    return jsonify(stats)

# Email service simulation - hardcoded and broken
@app.route('/send-email', methods=['POST'])
def send_email():
    email_data = request.json
    
    # FIXME: This doesn't actually send emails!
    # TODO: Integrate with real email service
    
    to_email = email_data.get('to')
    subject = email_data.get('subject')
    body = email_data.get('body')
    
    print(f"FAKE EMAIL SENT:")  # Not real logging
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(f"Body: {body}")
    
    return {
        'status': 'sent',
        'message': 'Email sent successfully'  # Lying!
    }

# Integration with Express API - broken
@app.route('/sync-with-express', methods=['POST'])
def sync_with_express():
    try:
        # FIXME: This doesn't work because of authentication issues
        response = requests.get(f'{EXPRESS_API_URL}/products')
        
        if response.status_code == 200:
            products = response.json()
            
            # Track sync event
            track_data = {
                'event_type': 'api_sync',
                'user_id': 'system',
                'data': {'products_count': len(products)}
            }
            
            # Call our own endpoint - inefficient!
            requests.post('http://localhost:5000/analytics/track', json=track_data)
            
            return {
                'message': 'Sync completed',
                'products_synced': len(products)
            }
        else:
            return {'error': 'Failed to sync with Express API'}, 500
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {'error': 'Connection failed'}, 500

# Utility endpoints with more inconsistencies  
@app.route('/utils/generate-id')
def generate_id():
    return {'id': str(uuid.uuid4())}

@app.route('/utils/current-time')
def current_time():
    return {
        'timestamp': datetime.now().isoformat(),
        'unix': datetime.now().timestamp()
    }

# Error handlers - minimal
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Endpoint not found'}, 404

@app.errorhandler(500)  
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    print("🐍 Starting the chaotic Python microservice...")
    print("🔥 This service has MANY problems:")
    print("   - Inconsistent coding styles")
    print("   - No proper error handling") 
    print("   - Missing authentication")
    print("   - No input validation")
    print("   - Poor database management")
    print("   - No tests or documentation")
    print("🎯 Use Copilot to help fix these issues!")
    
    app.run(debug=True, port=5000)

# TODO List for participants:
# 1. Standardize coding style and naming conventions
# 2. Add proper error handling and logging
# 3. Implement authentication middleware
# 4. Add input validation for all endpoints
# 5. Create proper database models/classes
# 6. Add comprehensive tests
# 7. Create API documentation
# 8. Fix the Express API integration
# 9. Add proper configuration management
# 10. Implement proper email service integration