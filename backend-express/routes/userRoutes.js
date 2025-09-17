
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../models/db");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

// User registration
router.post(
    "/register",
    [
        body('username').isString().notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;
        try {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const userId = uuidv4();
            db.run(
                "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
                [userId, username, email, hashedPassword],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: "User creation failed" });
                    }
                    res.status(201).json({ message: "User created successfully", userId });
                }
            );
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }
);

// Login
router.post("/login", (req, res) => {
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
        if (bcrypt.compareSync(password, user.password)) {
            // Use user_id (snake_case) for JWT compatibility with Flask backend
            const token = jwt.sign(
                { user_id: user.id, username: user.username, role: user.role },
                JWT_SECRET,
                { expiresIn: "24h" }
            );
            res.json({
                token,
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

module.exports = router;
