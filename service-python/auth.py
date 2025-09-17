from flask import request, jsonify
import os
import jwt
from functools import wraps

SECRET_KEY = os.environ.get('PYTHON_SECRET_KEY')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except Exception:
            return jsonify({'error': 'Invalid token'}), 403
        return f(*args, **kwargs)
    return decorated
