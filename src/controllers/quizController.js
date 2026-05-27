const db = require('../models/db');

// READ: GET /api/questions -> Fetch all questions from the database
exports.getQuestions = (req, res, next) => {
    try {
        const rows = db.prepare('SELECT * FROM questions').all();
        
        // Maps flat database column strings back into the layout script.js uses
        const formattedQuestions = rows.map(row => ({
            id: row.id, // Included so you can reference it for updates later
            q: row.q,
            o: [row.o1, row.o2, row.o3, row.o4],
            c: row.c
        }));
        
        res.json(formattedQuestions);
    } catch (error) {
        next(error); 
    }
};

// CREATE: POST /api/attempts -> Save a student's quiz attempt
exports.saveAttempt = (req, res, next) => {
    try {
        const { username, score, percentage } = req.body;

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

// UPDATE: PUT /api/questions/:id -> Update an existing question (Admin Feature)
exports.updateQuestion = (req, res, next) => {
    try {
        const { id } = req.params;
        const { q, o1, o2, o3, o4, c } = req.body;

        const stmt = db.prepare(`
            UPDATE questions 
            SET q = ?, o1 = ?, o2 = ?, o3 = ?, o4 = ?, c = ? 
            WHERE id = ?
        `);
        const result = stmt.run(q, o1, o2, o3, o4, c, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Question not found in database' });
        }
        res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
        next(error);
    }
};

// DELETE: DELETE /api/attempts/:id -> Delete a specific student attempt record
exports.deleteAttempt = (req, res, next) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM attempts WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Attempt record not found' });
        }
        res.status(200).json({ message: 'Attempt record deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// DELETE QUESTION: DELETE /api/questions/:id -> Remove a question from the bank
exports.deleteQuestion = (req, res, next) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM questions WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Question not found in database.' });
        }
        res.status(200).json({ message: 'Question deleted successfully.' });
    } catch (error) {
        next(error);
    }
};