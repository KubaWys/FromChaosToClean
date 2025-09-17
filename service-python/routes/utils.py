from flask import Blueprint, jsonify
import datetime

utils_bp = Blueprint('utils', __name__)

@utils_bp.route('/utils/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong', 'timestamp': datetime.datetime.utcnow().isoformat()}), 200

@utils_bp.route('/utils/health', methods=['GET'])
def health():
    # In a real app, check DB, dependencies, etc.
    return jsonify({'status': 'ok', 'service': 'python-backend'}), 200
