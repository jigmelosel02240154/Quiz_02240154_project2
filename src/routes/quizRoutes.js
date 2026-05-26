const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Define RESTful mappings for fetching resources and storing updates
router.get('/questions', quizController.getQuestions);
router.post('/attempts', quizController.saveAttempt);

module.exports = router;