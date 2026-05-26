const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Map HTTP requests to the correct Controller functions (Full CRUD enabled)

// READ
router.get('/questions', quizController.getQuestions);

// CREATE
router.post('/attempts', quizController.saveAttempt);

// UPDATE
router.put('/questions/:id', quizController.updateQuestion);

// DELETE
router.delete('/attempts/:id', quizController.deleteAttempt);

module.exports = router;