# Python Microservice - Notification & Analytics Chaos 🐍

This Python Flask microservice handles notifications and analytics, but it's written in a completely different style from the Express backend and has numerous issues.

## 🚨 Current Problems

### **Code Style Issues**
- [ ] Inconsistent naming conventions (camelCase vs snake_case)
- [ ] Mixed response formats across endpoints
- [ ] Inconsistent error handling patterns
- [ ] Poor code organization (everything in one file)

### **Functionality Problems**
- [ ] Fake email service that doesn't work
- [ ] Broken integration with Express API
- [ ] Missing authentication on most endpoints
- [ ] No input validation
- [ ] Poor database connection management

### **Architecture Issues**
- [ ] No separation of concerns
- [ ] Hardcoded configuration values
- [ ] No proper logging system
- [ ] Missing tests entirely
- [ ] No API documentation

## 🎯 Service Overview

This microservice provides:

**Notifications**
- Create user notifications
- Retrieve user notifications  
- Mark notifications as read

**Analytics**
- Track user events
- Get user statistics
- Basic event aggregation

**Utilities**
- ID generation
- Time utilities
- Email simulation (broken)

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

The service will run on `http://localhost:5000`

## 📋 Current API Endpoints

**Health & Utilities**
- `GET /health` - Health check
- `GET /utils/generate-id` - Generate UUID
- `GET /utils/current-time` - Get current timestamp

**Notifications**
- `POST /notifications` - Create notification
- `GET /notifications/<user_id>` - Get user notifications
- `PUT /notifications/<notification_id>/read` - Mark as read

**Analytics**
- `POST /analytics/track` - Track event
- `GET /analytics/stats/<user_id>` - Get user stats

**Integration**
- `POST /send-email` - Send email (fake!)
- `POST /sync-with-express` - Sync with Express API (broken!)

## 🗄️ Database Structure

Uses SQLite with tables:
- `notifications` - User notifications
- `analytics` - Event tracking data

## 💡 Key Refactoring Opportunities

### **1. Code Organization**
- Separate routes into blueprints
- Create service/repository layers
- Add proper configuration management
- Implement dependency injection

### **2. API Consistency**
- Standardize response formats
- Consistent error handling
- Proper HTTP status codes
- Input validation schemas

### **3. Integration**
- Fix Express API authentication
- Implement proper email service
- Add retry logic and error handling
- Create shared authentication middleware

## 🎯 Copilot Collaboration Ideas

1. **Ask Copilot to identify all coding style inconsistencies**
2. **Generate proper Flask application factory pattern**
3. **Create comprehensive input validation schemas**
4. **Build integration tests for all endpoints**
5. **Generate OpenAPI documentation**

## 🏆 Success Criteria

- [ ] Consistent Python coding conventions throughout
- [ ] Proper Flask application structure with blueprints
- [ ] Working authentication integration with Express API
- [ ] Comprehensive input validation
- [ ] Real email service integration
- [ ] Complete test coverage
- [ ] API documentation

# Flask Python Service

## Setup
```sh
pip install -r requirements.txt
```

## Run
```sh
python app.py
```

## Test
```sh
pytest
```

## Security
- Secret key is hardcoded for demo. Use environment variables in production.
- CORS is enabled for all origins for demo. Restrict in production.

Remember: The goal is to make this service work seamlessly with the Express backend while maintaining Python best practices!