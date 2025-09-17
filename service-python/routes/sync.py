from flask import Blueprint, jsonify
import requests
import os

sync_bp = Blueprint('sync', __name__)

EXPRESS_API_URL = os.environ.get("EXPRESS_API_URL", "http://localhost:3001/api")

@sync_bp.route("/sync-with-express", methods=["POST"])
def sync_with_express():
    try:
        response = requests.get(f"{EXPRESS_API_URL}/products")
        if response.status_code == 200:
            products = response.json()
            # Track sync event (optional: call analytics service)
            # ...
            return {"message": "Sync completed", "products_synced": len(products)}
        else:
            return {"error": "Failed to sync with Express API"}, 500
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return {"error": "Connection failed"}, 500
