const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../models/db");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Create order
router.post("/", authMiddleware, (req, res) => {
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
            res.status(201).json({ orderId, message: "Order created", total });
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

// Get user orders
router.get("/", authMiddleware, (req, res) => {
    const userId = req.user.userId;
    db.all("SELECT * FROM orders WHERE user_id = ?", [userId], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ orders });
    });
});

module.exports = router;
