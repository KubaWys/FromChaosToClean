# Python version of date utilities - different patterns!
# TODO: Should be consistent with JavaScript version

from datetime import datetime, timedelta, timezone
from typing import Optional, Union
import time

# Different function naming convention
def get_current_timestamp() -> str:
    """Get current timestamp - different format than JS"""
    return datetime.now(timezone.utc).isoformat()

def get_unix_timestamp() -> int:
    """Get Unix timestamp - missing from JS version"""
    return int(time.time())

def format_date_string(date_input: Union[str, datetime]) -> str:
    """Format date - different format than JS version"""
    if isinstance(date_input, str):
        date_obj = datetime.fromisoformat(date_input.replace('Z', '+00:00'))
    else:
        date_obj = date_input
    
    return date_obj.strftime('%Y-%m-%d')  # Different format!

def format_datetime_string(date_input: Union[str, datetime]) -> str:
    """Format datetime - yet another different format"""
    if isinstance(date_input, str):
        date_obj = datetime.fromisoformat(date_input.replace('Z', '+00:00'))
    else:
        date_obj = date_input
    
    return date_obj.strftime('%Y-%m-%d %H:%M:%S')

# Timezone handling - missing from JS version
def convert_to_timezone(date_input: Union[str, datetime], target_timezone: str = 'UTC') -> datetime:
    """Convert datetime to specific timezone"""
    if isinstance(date_input, str):
        date_obj = datetime.fromisoformat(date_input.replace('Z', '+00:00'))
    else:
        date_obj = date_input
    
    # Basic timezone conversion (should use proper timezone library)
    return date_obj.replace(tzinfo=timezone.utc)

# Date arithmetic - completely different approach
def add_days_to_date(date_input: Union[str, datetime], days: int) -> datetime:
    """Add days to date - missing from other services"""
    if isinstance(date_input, str):
        date_obj = datetime.fromisoformat(date_input.replace('Z', '+00:00'))
    else:
        date_obj = date_input
    
    return date_obj + timedelta(days=days)

def days_between_dates(date1: Union[str, datetime], date2: Union[str, datetime]) -> int:
    """Calculate days between dates"""
    if isinstance(date1, str):
        date1 = datetime.fromisoformat(date1.replace('Z', '+00:00'))
    if isinstance(date2, str):
        date2 = datetime.fromisoformat(date2.replace('Z', '+00:00'))
    
    return abs((date2 - date1).days)

# Validation - different from JS version
def is_valid_date_string(date_string: str) -> bool:
    """Validate date string format"""
    try:
        datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        return True
    except (ValueError, TypeError):
        return False

# Business logic helpers - only in Python version
def is_business_day(date_input: Union[str, datetime]) -> bool:
    """Check if date is a business day (Monday-Friday)"""
    if isinstance(date_input, str):
        date_obj = datetime.fromisoformat(date_input.replace('Z', '+00:00'))
    else:
        date_obj = date_input
    
    return date_obj.weekday() < 5  # 0-4 are Monday-Friday