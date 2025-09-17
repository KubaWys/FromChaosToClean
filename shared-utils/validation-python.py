# Python version of validation utilities
# TODO: This duplicates the JavaScript validation logic but with different patterns!

import re
from typing import Dict, List, Optional, Union

# Email validation - similar to JS version but different implementation
def validate_email(email: Optional[str]) -> bool:
    """Validate email format - different regex pattern than JS version"""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Password validation - different rules from JS version
def validate_password(password: Optional[str]) -> Dict[str, Union[bool, str]]:
    """Validate password strength - inconsistent with JS version"""
    if not password:
        return {'valid': False, 'message': 'Password cannot be empty'}
    
    if len(password) < 6:  # Different minimum length!
        return {'valid': False, 'message': 'Password must be at least 6 characters'}
    
    # Missing complexity requirements that JS version doesn't have
    if not re.search(r'[A-Z]', password):
        return {'valid': False, 'message': 'Password must contain uppercase letter'}
    
    return {'valid': True}

# User validation - different structure from JS version
def validate_user_data(user_data: Dict) -> Dict[str, Union[bool, List[str]]]:
    """Validate user data - different format than JS version"""
    validation_errors = []
    
    username = user_data.get('username', '').strip()
    if len(username) < 2:  # Different minimum length!
        validation_errors.append('Username must be at least 2 characters long')
    
    email = user_data.get('email', '')
    if not validate_email(email):
        validation_errors.append('Please provide a valid email address')
    
    password = user_data.get('password', '')
    pwd_check = validate_password(password)
    if not pwd_check['valid']:
        validation_errors.append(pwd_check['message'])
    
    return {
        'is_valid': len(validation_errors) == 0,  # Different key name!
        'errors': validation_errors
    }

# Notification validation - only exists in Python version
def validate_notification_data(notification_data: Dict) -> Dict[str, Union[bool, List[str]]]:
    """Validate notification data - missing from other services"""
    errors = []
    
    if not notification_data.get('user_id'):
        errors.append('User ID is required')
    
    message = notification_data.get('message', '').strip()
    if not message:
        errors.append('Message cannot be empty')
    elif len(message) > 500:
        errors.append('Message cannot exceed 500 characters')
    
    notification_type = notification_data.get('type', 'info')
    valid_types = ['info', 'warning', 'error', 'success']
    if notification_type not in valid_types:
        errors.append(f'Type must be one of: {", ".join(valid_types)}')
    
    return {
        'is_valid': len(errors) == 0,
        'errors': errors
    }

# Analytics validation - completely different from other services
def validate_analytics_event(event_data: Dict) -> Dict[str, Union[bool, str]]:
    """Validate analytics event - unique to Python service"""
    if not event_data.get('event_type'):
        return {'valid': False, 'error': 'Event type is required'}
    
    event_type = event_data['event_type']
    if not isinstance(event_type, str) or len(event_type.strip()) == 0:
        return {'valid': False, 'error': 'Event type must be a non-empty string'}
    
    # Optional user_id validation
    user_id = event_data.get('user_id')
    if user_id is not None and not isinstance(user_id, str):
        return {'valid': False, 'error': 'User ID must be a string'}
    
    return {'valid': True}