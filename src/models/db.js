const Database = require('better-sqlite3');
require('dotenv').config();

const db = new Database(process.env.DB_FILE || './quiz_database.db');

db.pragma('foreign_keys = ON');

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

const rowCount = db.prepare('SELECT COUNT(*) as count FROM questions').get();
if (rowCount.count === 0) {
    const insertStmt = db.prepare('INSERT INTO questions (q, o1, o2, o3, o4, c) VALUES (?, ?, ?, ?, ?, ?)');
    
    // 20 Complete Questions matching your exact array architecture
    const defaultQuestions = [
        ["Which HTML5 element is used to embed independent, self-contained content?", "<section>", "<article>", "<aside>", "<div>", 1],
        ["What is the correct way to declare a block-scoped variable in modern JavaScript?", "var", "let", "global", "assign", 1],
        ["Which CSS property controls layout alignment along a flex container's main-axis?", "justify-content", "align-items", "flex-direction", "wrap", 0],
        ["What does the 'c' key represent in your script.js question format?", "Choice count", "Correct index", "Category tag", "Console flag", 1],
        ["Which HTML element is used to define important text?", "<i>", "<important>", "<strong>", "<b>", 2],
        ["What does CSS stand for?", "Computer Style Sheets", "Cascading Style Sheets", "Creative Style Systems", "Colorful Style Sheets", 1],
        ["Which character is used to indicate an ID selector in CSS?", ".", "#", "*", "$", 1],
        ["How do you write 'Hello World' in an alert box in JavaScript?", "msg('Hello World');", "alertBox('Hello World');", "msgBox('Hello World');", "alert('Hello World');", 3],
        ["How do you create a function in JavaScript?", "function myFunction()", "function:myFunction()", "function = myFunction()", "new function()", 0],
        ["How do you write an IF statement in JavaScript?", "if i = 5 then", "if (i == 5)", "if i == 5 then", "if i = 5", 1],
        ["Which array method removes the last element from an array and returns it?", "shift()", "join()", "pop()", "push()", 2],
        ["What is the correct HTML for creating a hyperlink?", "<a>http://cst.edu</a>", "<a href='http://cst.edu'>CST</a>", "<a url='http://cst.edu'>CST</a>", "<a>CST</a>", 1],
        ["Which CSS property controls the text size?", "text-style", "font-style", "text-size", "font-size", 3],
        ["How do you add a background color for all <h1> elements in CSS?", "h1.all {background-color: blue;}", "h1 {background-color: blue;}", "all.h1 {background-color: blue;}", "h1 {bg-color: blue;}", 1],
        ["What is the default value of the position property in CSS?", "relative", "absolute", "static", "fixed", 2],
        ["Which operator is used to assign a value to a variable in JavaScript?", "*", "-", "=", "==", 2],
        ["What will typeof [] return in JavaScript?", "\"array\"", "\"object\"", "\"list\"", "\"undefined\"", 1],
        ["Which HTML element is used to display a scalar measurement within a known range?", "<meter>", "<progress>", "<range>", "<measure>", 0],
        ["Which property is used in CSS to change the left margin of an element?", "margin-left", "padding-left", "indent-left", "left-margin", 0]
    ];

    for (const item of defaultQuestions) {
        insertStmt.run(...item);
    }
    console.log("Database initialized and seeded with 19 questions successfully.");
}

module.exports = db;