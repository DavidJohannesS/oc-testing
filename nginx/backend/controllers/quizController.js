const quizModel = require('../models/quizModel');

//----------------------------------------------------------------------------------INSERT QUIZ
exports.insertQuiz= (req, res) => {
  const payload = req.body;
  quizModel.insertQuiz(payload, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to insert quiz.' });
    } else {
      res.status(200).json({ status: 'ok', quizID: result });
    }
  });
};
//----------------------------------------------------------------------------------GET QUIZ
exports.getQuiz = (req, res) => {
  const quizID = req.params.quizID;
  quizModel.getQuiz(quizID, (error, quiz) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get quiz.' });
    } else if (!quiz) {
      res.status(404).json({ status: 'error', message: 'Quiz not found.' });
    } else {
      res.status(200).json(quiz);
    }
  });
};
//----------------------------------------------------------------------------------GET QUIZZES
exports.getQuizzes = (req, res) => {
  quizModel.getQuizzes((error, quizzes) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get quizzes.' });
    } else if (!quizzes) {
      res.status(404).json({ status: 'error', message: 'Quizzes not found.' });
    } else {
      res.status(200).json({ status: 'ok', data: quizzes });
    }
  });
};
//----------------------------------------------------------------------------------UPDATE QUIZ
exports.updateQuiz = (req, res) => {
  req.body.quizID=req.params.quizID;
  const payload = req.body;
  quizModel.updateQuiz(payload, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to update quiz.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'No changes were made to the quiz.' });
    } else {
      res.status(200).json({ status: 'ok', message: 'Quiz updated successfully.' });
    }
  });
};
//----------------------------------------------------------------------------------DELETE QUIZ
exports.deleteQuiz = (req, res) => {
  const quizID = req.params.quizID;
  quizModel.deleteQuiz(quizID, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to delete quiz.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'Quiz not found.' });
    } else {
      res.status(200).json({ status: 'ok', message: 'Quiz deleted successfully.' });
    }
  });
};
//-----------------------------------------------------------------------------------INSERT TAGS
exports.insertTags = (req, res) => {
  const quizID = req.params.quizID;
  const tags = req.body.tags;

  quizModel.insertTags(quizID, tags, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to insert tags.' });
    } else {
      res.status(200).json({ status: 'ok', message: 'Tags inserted successfully' });
    }
  });
};
//-----------------------------------------------------------------------------------GET CATEGORIES
exports.getCategories = (req, res) => {
  quizModel.getCategories((error, categories) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get categories.' });
    } else if (!categories) {
      res.status(404).json({ status: 'error', message: 'Categories not found.' });
    } else {
      res.status(200).json({ status: 'ok', data: categories });
    }
  });
};
//----------------------------------------------------------------------------------GET TAGS
exports.getTags = (req, res) => {
  quizModel.getTags((error, tags) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get tags.' });
    } else if (!tags) {
      res.status(404).json({ status: 'error', message: 'Tags not found.' });
    } else {
      res.status(200).json({ status: 'ok', data: tags });
    }
  });
};
//----------------------------------------------------------------------------------GET QUIZZES BY TAGS
exports.getQuizByTags = (req, res) => {
  const tags = req.body;
  quizModel.getQuizByTags(tags, (error, quizzes) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get quizzes.' });
    } else if (!quizzes) {
      res.status(404).json({ status: 'error', message: 'Quizzes not found.' });
    } else {
      res.status(200).json({ status: 'ok', data: quizzes });
    }
  });
};
//-----------------------------------------------------------------------------------GET FULL QUIZ 
exports.getFullQuiz = (req, res) => {
  const quizID = req.params.quizID;
  quizModel.getFullQuiz(quizID, (error, quiz) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get full quiz.' });
    } else if (!quiz) {
      res.status(404).json({ status: 'error', message: 'Quiz not found.' });
    } else {
      res.status(200).json(quiz);
    }
  });
};


