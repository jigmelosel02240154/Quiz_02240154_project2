const db = require('../models/db');

// Handles reading the quiz bank from SQLite
exports.getQuestions = (req, res, next) => {
    try {
        const rows = db.prepare('SELECT * FROM questions').all();
        
        // Maps flat database column strings back into the precise layout script.js uses
        const formattedQuestions = rows.map(row => ({
            q: row.q,
            o: [row.o1, row.o2, row.o3, row.o4],
            c: row.c
        }));
        
        res.json(formattedQuestions);
    } catch (error) {
        next(error); // Passes execution down to your centralized errorHandler
    }
};

// Handles recording completed student assessments
exports.saveAttempt = (req, res, next) => {
    try {
        const { username, score, percentage } = req.body;

        // Structured Input Validation matching submission standard rules
        if (!username || username.trim() === "") {
            return res.status(400).json({ error: 'Student username cannot be blank.' });
        }
        if (score === undefined || percentage === undefined) {
            return res.status(400).json({ error: 'Score parameters are missing.' });
        }

        const stmt = db.prepare('INSERT INTO attempts (username, score, percentage) VALUES (?, ?, ?)');
        const result = stmt.run(username.trim(), score, percentage);

        res.status(201).json({
            message: 'Quiz record saved to database successfully',
            attemptId: result.lastInsertRowid
        });
    } catch (error) {
        next(error);
    }
};