// SQLite DB setup and initialization for Express backend
const sqlite3 = require("sqlite3");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const db = new sqlite3.Database(":memory:");

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
    const hashedPassword = bcrypt.hashSync("password123", 10);
    db.run("INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), "admin", "admin@test.com", hashedPassword, "admin"]);
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), "Laptop", 999.99, "A great laptop", 10]);
    db.run("INSERT INTO products (id, name, price, description, stock) VALUES (?, ?, ?, ?, ?)", 
        [uuidv4(), "Mouse", 29.99, "Wireless mouse", 50]);
});

module.exports = db;
