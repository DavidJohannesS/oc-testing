const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quizController');
router.get('/categories', quizController.getCategories);
router.get('/tags', quizController.getTags);
router.post('/tags', quizController.getQuizByTags);
router.post('/', quizController.insertQuiz);
router.get('/:quizID', quizController.getQuiz);
router.get('/', quizController.getQuizzes);
router.put('/:quizID', quizController.updateQuiz);
router.delete('/:quizID', quizController.deleteQuiz);
router.post('/:quizID/tags', quizController.insertTags);
router.get('/1/:quizID', quizController.getFullQuiz);
module.exports = router;

