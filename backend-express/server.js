// Express backend for e-commerce API (modularized)
const express = require("express");
const cors = require("cors");
const logger = require('./logger');
const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.EXPRESS_SECRET_KEY || 'replace-this-secret';
const setupSwagger = require('./swagger'); // Import swagger setup
const metricsRouter = require('./metrics');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(metricsRouter);

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

setupSwagger(app); // Setup Swagger UI

// Catch all - poor error handling
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

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
// ...existing code...

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