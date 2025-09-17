# Express.js Backend - The Chaos Zone 🔥

Welcome to the messiest Express.js backend you've ever seen! This service is functional but has numerous issues that need your attention (and Copilot's help).

## 🚨 Current Issues (Your Mission)

### **Security Problems**
- [ ] Hardcoded JWT secret
- [ ] Missing admin role checks
- [ ] Weak password requirements
- [ ] No rate limiting
- [ ] SQL injection possibilities

### **Code Quality Issues**
- [ ] Everything in one file
- [ ] Inconsistent error handling
- [ ] No input validation
- [ ] Mixed response formats
- [ ] Poor database management

### **Missing Features**
- [ ] No tests whatsoever
- [ ] No API documentation
- [ ] No logging system
- [ ] No configuration management
- [ ] Missing CRUD operations

## 🎯 Goals for Refactoring

### **Architecture**
- Separate routes into different files
- Create proper middleware structure
- Add controller layer
- Implement service layer
- Add proper database models

### **Security**
- Environment-based configuration
- Proper authentication flow
- Role-based authorization
- Input validation and sanitization
- Security headers

### **Testing & Documentation**
- Unit and integration tests
- API documentation (Swagger/OpenAPI)
- Proper error handling
- Logging and monitoring

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development (with auto-restart)
npm run dev
```

## 📋 Current API Endpoints

**Authentication**
- `POST /api/register` - User registration (minimal validation)
- `POST /api/login` - User login (security issues)

**Products**
- `GET /api/products` - List all products (no pagination)
- `GET /api/products/:id` - Get single product (inconsistent format)
- `POST /api/products` - Create product (missing auth check)
- `PUT /api/products/:id` - Update product (no validation)

**Orders**
- `POST /api/orders` - Create order (broken logic)
- `GET /api/orders` - Get user orders (missing pagination)

**Utility**
- `GET /health` - Health check

## 🧪 Test Data

The system comes with some test data:
- **Admin User**: username: `admin`, password: `password123`
- **Sample Products**: Laptop ($999.99), Mouse ($29.99)

## 💡 Copilot Collaboration Tips

1. **Start by asking Copilot to explain the current code structure**
2. **Request architectural suggestions for organizing the code**
3. **Have Copilot help with security improvements**
4. **Generate comprehensive tests with AI assistance**
5. **Create API documentation using Copilot prompts**

## 🎯 Success Metrics

- [ ] All routes properly organized in separate files
- [ ] Comprehensive input validation
- [ ] Proper error handling with consistent formats
- [ ] Security vulnerabilities fixed
- [ ] Test coverage > 80%
- [ ] Complete API documentation
- [ ] Working authentication and authorization

# Express Backend

## Setup
```sh
npm install
```

## Run
```sh
npm start
```

## Test
```sh
npm test
```

## Security
- JWT secret is hardcoded for demo. Use environment variables in production.
- CORS is enabled for all origins for demo. Restrict in production.

Remember: This isn't just about fixing code - it's about learning to collaborate effectively with Copilot!