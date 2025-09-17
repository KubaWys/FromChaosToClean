from flask import Blueprint
from flask_swagger_ui import get_swaggerui_blueprint

SWAGGER_URL = '/api-docs'
API_URL = '/openapi.yaml'

swaggerui_bp = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Flask Backend API"
    }
)
