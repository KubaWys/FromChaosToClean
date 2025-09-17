from flask import request, jsonify
import os
import jwt
from functools import wraps

SECRET_KEY = os.environ.get('PYTHON_SECRET_KEY')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print("[DEBUG] PYTHON_SECRET_KEY:", SECRET_KEY)
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        print("[DEBUG] Incoming JWT token:", token)
        if not token:
            print("[DEBUG] No token provided")
            return jsonify({'error': 'No token provided'}), 401
        try:
            # Print decoded header and payload without verifying for debug
            import base64, json as _json
            header_b64, payload_b64, *_ = token.split('.')
            print("[DEBUG] JWT header:", _json.loads(base64.urlsafe_b64decode(header_b64 + '==').decode()))
            print("[DEBUG] JWT payload:", _json.loads(base64.urlsafe_b64decode(payload_b64 + '==').decode()))
        except Exception as e:
            print("[DEBUG] Error decoding JWT header/payload:", e)
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            print("[DEBUG] Decoded JWT claims:", data)
            request.user = data
        except Exception as e:
            print("[DEBUG] JWT decode error:", e)
            return jsonify({'error': 'Invalid token'}), 403
        return f(*args, **kwargs)
    return decorated
