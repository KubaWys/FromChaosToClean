from flask import Blueprint, Response
import threading

metrics_bp = Blueprint('metrics', __name__)

request_count = 0
lock = threading.Lock()

@metrics_bp.before_app_request
def before_request_func():
    global request_count
    with lock:
        request_count += 1

@metrics_bp.route('/metrics')
def metrics():
    return Response(f"flask_request_count {request_count}\n", mimetype='text/plain')
