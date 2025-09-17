const metricsRouter = require('./metrics');
app.use(metricsRouter);
// Express backend for e-commerce API (modularized)
const express = require("express");
const cors = require("cors");
const logger = require('./logger');
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.EXPRESS_SECRET_KEY || 'replace-this-secret';
const setupSwagger = require('./swagger'); // Import swagger setup

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Modular routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/health", require("./routes/healthRoutes"));

// Catch all - poor error handling
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});
setupSwagger(app); // Setup Swagger UI

// Global error handler - advanced logging
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("🔥 This server has MANY issues - use Copilot to help fix them!");
    console.log("🎯 Focus areas: Security, validation, error handling, code organization");
    // Use SECRET_KEY in JWT or session logic as needed
});
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;
    
    // TODO: Add proper validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const userId = uuidv4();
        
        db.run("INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)", 
            [userId, username, email, hashedPassword], function(err) {
            if (err) {
                // Poor error handling
                console.log(err);
                return res.status(500).json({ error: "User creation failed" });
            }
            
            res.status(201).json({ 
                message: "User created successfully",
                userId: userId 
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login endpoint - security issues
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }
    
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        // Password comparison
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: "24h" }
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
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Get products - no pagination, inconsistent response format
app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// Create product - missing authorization check!
app.post("/api/products", authMiddleware, (req, res) => {
    const { name, price, description, stock } = req.body;
    
    // TODO: Add admin role check
    // TODO: Add input validation
    
    const productId = uuidv4();
    
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)",
        [productId, name, price, description, stock], function(err) {
        if (err) {
            return res.status(500).json({ error: "Failed to create product" });
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
app.get("/api/products/:id", (req, res) => {
    const { id } = req.params;
    
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.json({ product: product }); // Different format than list
    });
});

// Update product - fixed admin check and error handling
app.put("/api/products/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;
    // Only allow admin users to update products
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    db.run("UPDATE products SET name = ?, price = ?, description = ?, stock = ? WHERE id = ?",
        [name, price, description, stock, id], function(err) {
        if (err) {
            return res.status(500).json({ error: "Update failed" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product updated successfully" });
    });
});

// Create order - improved validation and calculation
app.post("/api/orders", authMiddleware, (req, res) => {
    const { productIds, quantities } = req.body;
    const userId = req.user.userId;
    if (!Array.isArray(productIds) || !Array.isArray(quantities) || productIds.length !== quantities.length) {
        return res.status(400).json({ error: "Invalid order format" });
    }
    let total = 0;
    let stockOk = true;
    let checked = 0;
    function finishOrder() {
        if (!stockOk) {
            return res.status(400).json({ error: "Insufficient stock or invalid product" });
        }
        const orderId = uuidv4();
        db.run("INSERT INTO orders (id, user_id, total) VALUES (?, ?, ?)",
            [orderId, userId, total], function(err) {
            if (err) {
                return res.status(500).json({ error: "Order creation failed" });
            }
            res.status(201).json({
                orderId: orderId,
                message: "Order created",
                total: total
            });
        });
    }
    productIds.forEach((pid, idx) => {
        db.get("SELECT * FROM products WHERE id = ?", [pid], (err, product) => {
            if (err || !product) {
                stockOk = false;
            } else if (product.stock < quantities[idx]) {
                stockOk = false;
            } else {
                total += product.price * quantities[idx];
            }
            checked++;
            if (checked === productIds.length) {
                finishOrder();
            }
        });
    });
});

// Get user orders - missing pagination
app.get("/api/orders", authMiddleware, (req, res) => {
    const userId = req.user.userId;
    
    db.all("SELECT * FROM orders WHERE user_id = ?", [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        
        res.json({ orders: orders });
    });
});

// Health check endpoint - basic
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Catch all - poor error handling
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler - minimal
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("🔥 This server has MANY issues - use Copilot to help fix them!");
    console.log("🎯 Focus areas: Security, validation, error handling, code organization");
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