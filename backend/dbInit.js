const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Create or open the database file
const db = new Database('policy_system.db');

console.log('Initializing Database...');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// 1. Users Table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'POLICYHOLDER' 
        -- Roles: POLICYHOLDER, ADMIN, UNDERWRITER, ADJUSTER
    )
`);

// 2. Products Table
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        base_price REAL NOT NULL
    )
`);

// 3. Policies Table
db.exec(`
    CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        policy_number TEXT UNIQUE,
        status TEXT DEFAULT 'PENDING_PAYMENT', -- PENDING_PAYMENT, ACTIVE, EXPIRED
        start_date TEXT,
        end_date TEXT,
        premium_amount REAL,
        pdf_path TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )
`);

// 4. Claims Table
db.exec(`
    CREATE TABLE IF NOT EXISTS claims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        status TEXT DEFAULT 'SUBMITTED', -- SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED
        description TEXT,
        evidence_path TEXT,
        amount_requested REAL,
        FOREIGN KEY (policy_id) REFERENCES policies(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

// 5. Audit Log Table
db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT,
        user_id INTEGER,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// SEED DATA
const seedData = async () => {
    // Check if data exists
    const userCount = db.prepare('SELECT count(*) as count FROM users').get();
    if (userCount.count > 0) {
        console.log('Database already seeded.');
        return;
    }

    console.log('Seeding data...');

    // Hash passwords
    const salt = bcrypt.genSaltSync(10);
    const passwordUser = bcrypt.hashSync('password123', salt);
    const passwordAdmin = bcrypt.hashSync('admin123', salt);

    // Insert Users
    const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    insertUser.run('john', passwordUser, 'POLICYHOLDER');
    insertUser.run('admin', passwordAdmin, 'ADMIN');
    insertUser.run('adjuster', passwordUser, 'ADJUSTER');

    // Insert Products
    const insertProduct = db.prepare('INSERT INTO products (name, type, base_price) VALUES (?, ?, ?)');
    insertProduct.run('Gold Auto Plan', 'AUTO', 500);
    insertProduct.run('Basic Health', 'HEALTH', 200);
    insertProduct.run('Home Shield', 'HOME', 350);

    console.log('Database initialized successfully!');
};

seedData();
