from flask import Blueprint, request, jsonify
import requests

integration_bp = Blueprint('integration', __name__)

@integration_bp.route('/integration/external-api', methods=['GET'])
def call_external_api():
    url = request.args.get('url')
    if not url:
        return jsonify({'error': 'Missing url parameter'}), 400
    try:
        resp = requests.get(url, timeout=5)
        return jsonify({'status': resp.status_code, 'data': resp.json()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
