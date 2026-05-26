const Database = require('better-sqlite3');
require('dotenv').config();

const db = new Database(process.env.DB_FILE || './quiz_database.db');

// Enable foreign key support in SQLite
db.pragma('foreign_keys = ON');

// Build relational tables for Questions and Student Score History
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    q TEXT NOT NULL,
    o1 TEXT NOT NULL,
    o2 TEXT NOT NULL,
    o3 TEXT NOT NULL,
    o4 TEXT NOT NULL,
    c INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Automatically seed table with sample data if completely empty
const rowCount = db.prepare('SELECT COUNT(*) as count FROM questions').get();
if (rowCount.count === 0) {
    const insertStmt = db.prepare('INSERT INTO questions (q, o1, o2, o3, o4, c) VALUES (?, ?, ?, ?, ?, ?)');
    
    // Sample questions curated to match your array structures
    const defaultQuestions = [
        ["Which HTML5 element is used to embed independent, self-contained content?", "<section>", "<article>", "<aside>", "<div>", 1],
        ["What is the correct way to declare a block-scoped variable in modern JavaScript?", "var", "let", "global", "assign", 1],
        ["Which CSS property controls layout alignment of items along a flex container's main-axis?", "justify-content", "align-items", "flex-direction", "wrap", 0],
        ["What does the 'c' key represent in your script.js question format?", "Choice count", "Correct index", "Category tag", "Console flag", 1]
    ];

    for (const item of defaultQuestions) {
        insertStmt.run(...item);
    }
    console.log("Database initialized and seeded with sample quiz questions.");
}

module.exports = db;