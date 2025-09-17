from flask import Blueprint, jsonify
import uuid
from datetime import datetime

generate_bp = Blueprint('generate', __name__)

@generate_bp.route('/utils/generate-id', methods=['GET'])
def generate_id():
    return jsonify({'id': str(uuid.uuid4())})

@generate_bp.route('/utils/current-time', methods=['GET'])
def current_time():
    now = datetime.now()
    return jsonify({'timestamp': now.isoformat(), 'unix': now.timestamp()})
