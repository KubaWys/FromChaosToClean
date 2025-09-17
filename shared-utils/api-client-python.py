# Python version of API client - completely different approach!
# TODO: This should be consistent with the JavaScript version

import requests
from typing import Dict, Any, Optional
import json

# Different configuration structure
PYTHON_API_CONFIG = {
    'base_url': 'http://localhost:5000',  # Different port!
    'timeout': 10,  # Different timeout!
    'headers': {
        'Content-Type': 'application/json',
        'User-Agent': 'Python-Microservice/1.0'
    }
}

# Different function naming convention
def make_http_request(endpoint: str, method: str = 'GET', data: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
    """Make HTTP request - different signature than JS version"""
    url = f"{PYTHON_API_CONFIG['base_url']}{endpoint}"
    
    request_headers = PYTHON_API_CONFIG['headers'].copy()
    if headers:
        request_headers.update(headers)
    
    try:
        response = requests.request(
            method=method,
            url=url,
            json=data,
            headers=request_headers,
            timeout=PYTHON_API_CONFIG['timeout']
        )
        
        response.raise_for_status()
        return response.json()
        
    except requests.exceptions.Timeout:
        return {'error': 'Request timeout'}
    except requests.exceptions.ConnectionError:
        return {'error': 'Connection failed'}
    except requests.exceptions.HTTPError as e:
        return {'error': f'HTTP error: {e.response.status_code}'}
    except Exception as e:
        return {'error': f'Request failed: {str(e)}'}

# Express API client - different from JS version
class ExpressAPIClient:
    """Client for Express API - different pattern than JS version"""
    
    def __init__(self, base_url: str = 'http://localhost:3001/api'):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
    
    def authenticate(self, token: str) -> None:
        """Set authentication token - different from JS approach"""
        self.session.headers['Authorization'] = f'Bearer {token}'
    
    def get_products(self) -> Dict[str, Any]:
        """Get products from Express API"""
        try:
            response = self.session.get(f'{self.base_url}/products', timeout=5)
            response.raise_for_status()
            return {'success': True, 'data': response.json()}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create order via Express API"""
        try:
            response = self.session.post(f'{self.base_url}/orders', json=order_data, timeout=5)
            response.raise_for_status()
            return {'success': True, 'data': response.json()}
        except Exception as e:
            return {'success': False, 'error': str(e)}