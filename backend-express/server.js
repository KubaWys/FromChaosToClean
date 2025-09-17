// TODO: This server is a mess! Please help clean it up with Copilot
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// FIXME: Secret should not be hardcoded!
const JWT_SECRET = "super_secret_key_123";

// Middleware setup - could be cleaner
app.use(cors());
app.use(express.json());

// Database setup - inline and messy
const db = new sqlite3.Database(':memory:');

// Initialize tables - should be in separate file
db.serialize(() => {
    db.run(`CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT,
        stock INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        total REAL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);

    // Add some test data
    const hashedPassword = bcrypt.hashSync('password123', 10);
    db.run("INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), 'admin', 'admin@test.com', hashedPassword, 'admin']);
    
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), 'Laptop', 999.99, 'A great laptop', 10]);
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), 'Mouse', 29.99, 'Wireless mouse', 50]);
});

// Auth middleware - inconsistent and has issues
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }
    
    try {
        // FIXME: Token format handling is inconsistent
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// Routes - everything in one file, no organization
// User registration - minimal validation
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // TODO: Add proper validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();
        
        db.run("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", 
            [userId, username, email, hashedPassword], function(err) {
            if (err) {
                // Poor error handling
                console.log(err);
                return res.status(500).json({ error: 'User creation failed' });
            }
            
            res.status(201).json({ 
                message: 'User created successfully',
                userId: userId 
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint - security issues
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Password comparison
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

// Get products - no pagination, inconsistent response format
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Create product - missing authorization check!
app.post('/api/products', authMiddleware, (req, res) => {
    const { name, price, description, stock } = req.body;
    
    // TODO: Add admin role check
    // TODO: Add input validation
    
    const productId = uuidv4();
    
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)",
        [productId, name, price, description, stock], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to create product' });
        }
        
        res.status(201).json({
            id: productId,
            name,
            price,
            description,
            stock
        });
    });
});

// Get single product - inconsistent with list endpoint
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ product: product }); // Different format than list
    });
});

// Update product - missing validation and proper error handling
app.put('/api/products/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;
    
    // FIXME: No admin check again!
    
    db.run("UPDATE products SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?",
        [name, price, description, stock, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Update failed' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json({ message: 'Product updated successfully' });
    });
});

// Create order - oversimplified
app.post('/api/orders', authMiddleware, (req, res) => {
    const { productIds, quantities } = req.body;
    const userId = req.user.userId;
    
    // TODO: Calculate total properly
    // TODO: Check stock availability
    // TODO: Handle transaction properly
    
    const orderId = uuidv4();
    const total = 99.99; // FIXME: This is obviously wrong!
    
    db.run("INSERT INTO orders (id, user_id, total) VALUES (?, ?, ?)",
        [orderId, userId, total], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Order creation failed' });
        }
        
        res.status(201).json({
            orderId: orderId,
            message: 'Order created',
            total: total
        });
    });
});

// Get user orders - missing pagination
app.get('/api/orders', authMiddleware, (req, res) => {
    const userId = req.user.userId;
    
    db.all("SELECT * FROM orders WHERE user_id = ?", [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ orders: orders });
    });
});

// Health check endpoint - basic
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all - poor error handling
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler - minimal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('🔥 This server has MANY issues - use Copilot to help fix them!');
    console.log('🎯 Focus areas: Security, validation, error handling, code organization');
});

// TODO List for participants:
// 1. Move routes to separate files/controllers
// 2. Add proper input validation and sanitization
// 3. Fix authentication and authorization issues
// 4. Add comprehensive error handling
// 5. Create proper database models/schemas
// 6. Add API documentation (OpenAPI/Swagger)
// 7. Write comprehensive tests
// 8. Add logging and monitoring
// 9. Fix security vulnerabilities
// 10. Implement proper configuration management