import logging_config
from logging_config import logger
# Log all requests
@app.before_request
def log_request():
    logger.info(f"{request.method} {request.path}")
from metrics import metrics_bp
app.register_blueprint(metrics_bp)
from routes.sync import sync_bp
app.register_blueprint(sync_bp)
from routes.generate import generate_bp
app.register_blueprint(generate_bp)
# Python Flask microservice for notifications and analytics
# Cleaned up: removed TODOs/FIXMEs, clarified configuration, added comments


from flask import Flask
from flask_cors import CORS
import os
from models.db import init_db

from routes.notifications import notifications_bp
from routes.analytics import analytics_bp
from routes.utils import utils_bp
from routes.integration import integration_bp
from routes.email import email_bp



app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


# Configuration (use environment variables in production)
app.config["SECRET_KEY"] = os.environ["PYTHON_SECRET_KEY"]



# Initialize database on startup
init_db()



# Register Blueprints for modular routes
app.register_blueprint(notifications_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(utils_bp)
app.register_blueprint(integration_bp)

app.register_blueprint(email_bp)

# --- Swagger UI setup ---
from flask import send_from_directory
from swagger_ui_setup import swaggerui_bp
app.register_blueprint(swaggerui_bp)

# Serve openapi.yaml statically for Swagger UI
@app.route('/openapi.yaml')
def openapi_spec():
    return send_from_directory('.', 'openapi.yaml')



# Error handlers - minimal
@app.errorhandler(404)
def not_found(error):
    return {"error": "Endpoint not found"}, 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(str(error))
    return {"error": "Internal server error"}, 500



if __name__ == "__main__":
    print("🐍 Starting the modular Python microservice...")
    app.run(debug=True, port=5000)
