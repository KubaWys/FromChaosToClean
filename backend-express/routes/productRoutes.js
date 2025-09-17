const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../models/db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Get all products
router.get("/", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
});

// Get single product
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM products WHERE id = ?", [id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ product });
    });
});

// Create product (admin only)
router.post("/", authMiddleware, (req, res) => {
    const { name, price, description, stock } = req.body;
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    if (!name || !price || !description || !stock) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const productId = uuidv4();
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)",
        [productId, name, price, description, stock], function(err) {
        if (err) {
            return res.status(500).json({ error: "Failed to create product" });
        }
        res.status(201).json({ id: productId, name, price, description, stock });
    });
});

// Update product (admin only)
router.put("/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock } = req.body;
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

module.exports = router;
