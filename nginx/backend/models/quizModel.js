// quizModel.js
const pool = require('../util/db_conn');


//--------------------------------------------------------------------------------INSERT QUIZ
exports.insertQuiz = (payload, callback) => {
  const quiz = payload.data;
  const questions = quiz.questions;
  const tags = quiz.tags;

  const quizQuery = `INSERT INTO quizzes 
      (fk_categoryID, description, timer, title, difficulty) VALUES (?, ?, ?, ?, ?)`;

  const questionQuery = `INSERT INTO questions 
      (fk_quizID, question, points, type) VALUES (?, ?, ?, ?)`;

  const answerQuery = `INSERT INTO answers 
      (fk_questionID, answer, correct) VALUES (?, ?, ?)`;

  const tagQuery = `INSERT INTO tags (tag) VALUES (?)`;

  const tagCheckQuery = `SELECT tagID FROM tags WHERE tag = ?`;

  const quizTagQuery = `INSERT INTO quiz_tags (fk_quizID, fk_tagID) VALUES (?, ?)`;

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
    } else {
      connection.beginTransaction(err => {
        if (err) {
          callback(err);
        } else {
          connection.query(quizQuery, [quiz.fk_categoryID, quiz.description, quiz.timer, quiz.title, quiz.difficulty], (err, quizResults) => {
            if (err) {
              return connection.rollback(() => {
                callback(err);
              });
            }

            const quizID = quizResults.insertId;

            questions.forEach(question => {
              connection.query(questionQuery, [quizID, question.question, quiz.difficulty, question.type], (err, questionResults) => {
                if (err) {
                  return connection.rollback(() => {
                    callback(err);
                  });
                }

                const questionID = questionResults.insertId;

                question.options.forEach(option => {
                  connection.query(answerQuery, [questionID, option.answer, option.correct], err => {
                    if (err) {
                      return connection.rollback(() => {
                        callback(err);
                      });
                    }
                  });
                });
              });
            });

            tags.forEach(tag => {
              connection.query(tagCheckQuery, [tag], (err, tagCheckResults) => {
                if (err) {
                  return connection.rollback(() => {
                    callback(err);
                  });
                }

                let tagID;

                if (tagCheckResults.length > 0) {
                  // Tag already exists, get its ID
                  tagID = tagCheckResults[0].tagID;
                  connection.query(quizTagQuery, [quizID, tagID], err => {
                    if (err) {
                      return connection.rollback(() => {
                        callback(err);
                      });
                    }
                  });

                } else {
                  // Tag does not exist, insert it and get its ID
                  connection.query(tagQuery, [tag], (err, tagResults) => {
                    if (err) {
                      return connection.rollback(() => {
                        console.log("Error");
                        callback(err);
                      });
                    }
                    tagID = tagResults.insertId;
                    connection.query(quizTagQuery, [quizID, tagID], err => {
                      if (err) {
                        return connection.rollback(() => {
                          callback(err);
                        });
                      }
                    });
                  });
                }
              });
            });

            connection.commit(err => {
              if (err) {
                return connection.rollback(() => {
                  callback(err);
                });
              }
              callback(null, { message: 'Quiz inserted successfully', quizID: quizID });
            });
          });
        }
      });
      connection.release();
    }
  });
};
//--------------------------------------------------------------QUIZ BY ID
exports.getQuiz = (quizID, callback) => {
  const query = "SELECT * FROM quizzes WHERE quizID = ?";

  pool.query(query, [quizID], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results[0]); // return the first quiz found
    }
  });
};
//----------------------------------------------------ALL QUIZZES
exports.getQuizzes = (callback) => {
  const query = "SELECT q.quizID, q.description, q.timer, q.title, q.difficulty, q.addedOn, c.name, GROUP_CONCAT(DISTINCT t.tag SEPARATOR ',') AS tags FROM quizzes q LEFT JOIN categories c ON q.fk_categoryID = c.categoryID LEFT JOIN quiz_tags qt ON q.quizID = qt.fk_quizID LEFT JOIN tags t ON qt.fk_tagID = t.tagID GROUP BY q.quizID, q.description, q.timer, q.title, q.difficulty, q.addedOn, c.name";

  pool.query(query, (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//----------------------------------------------------------UPDATE QUIZ
exports.updateQuiz = (payload, callback) => {
  const quizID = payload.quizID;
  const { title, description, timer, difficulty, fk_categoryID } = payload;
  const query = `UPDATE quizzes 
      SET title = ?, 
	    description = ?, 
	    timer = ?, 
	    difficulty = ?, 
	    fk_categoryID = ? 
	    WHERE quizID = ?`;

  pool.query(query, [title, description, timer, difficulty, fk_categoryID, quizID], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//----------------------------------------------------------DELETE QUIZ
exports.deleteQuiz = (quizID, callback) => {
  const query = "DELETE FROM quizzes WHERE quizID = ?";

  pool.query(query, [quizID], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//-----------------------------------------------------------------INSERT TAGS
exports.insertTags = (quizID, tags, callback) => {
  const selectTagQuery = "SELECT tagID FROM tags WHERE tag = ?";
  const insertTagQuery = "INSERT INTO tags (tag) VALUES (?)";
  const insertQuizTagQuery = "INSERT INTO quiz_tags (fk_quizID, fk_tagID) VALUES (?, ?)";

  pool.getConnection((err, connection) => {
    if (err) {
      callback(err);
    } else {
      connection.beginTransaction(err => {
        if (err) {
          callback(err);
        } else {
          tags.forEach(tag => {
            connection.query(selectTagQuery, [tag], (err, tagResults) => {
              if (err) {
                return connection.rollback(() => {
                  callback(err);
                });
              }

              let tagID;
              if (tagResults.length > 0) {
                tagID = tagResults[0].tagID;
              } else {
                connection.query(insertTagQuery, [tag], (err, insertResults) => {
                  if (err) {
                    return connection.rollback(() => {
                      callback(err);
                    });
                  }
                  tagID = insertResults.insertId;
                });
              }

              connection.query(insertQuizTagQuery, [quizID, tagID], err => {
                if (err) {
                  return connection.rollback(() => {
                    callback(err);
                  });
                }
              });
            });
          });

          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                callback(err);
              });
            }

            callback(null, { message: 'Tags inserted successfully' });
          });
        }
      });

      connection.release();
    }
  });
};
//--------------------------------------------------GET CATEGORIES
exports.getCategories = (callback) => {
  const query = "SELECT * FROM categories";

  pool.query(query, (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//-------------------------------------------------GET TAGS
exports.getTags = (callback) => {
  const query = "SELECT * FROM tags";

  pool.query(query, (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//------------------------------------------------GET QUIZZES BY TAGS
exports.getQuizByTags = (tags, callback) => {
  const query = "SELECT q.*, GROUP_CONCAT(DISTINCT t.tag SEPARATOR ', ') AS tags FROM quizzes q JOIN quiz_tags qt ON q.quizID = qt.fk_quizID JOIN tags t ON qt.fk_tagID = t.tagID WHERE q.quizID IN (SELECT q.quizID FROM quizzes q JOIN quiz_tags qt ON q.quizID = qt.fk_quizID JOIN tags t ON qt.fk_tagID = t.tagID WHERE t.tag IN (?)) GROUP BY q.quizID";

  if (tags.length === 0) {
    return callback(null, []);
  }
  
  pool.query(query, [tags], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//----------------------------------------------GET FULL QUIZ 

exports.getFullQuiz = (quizID, callback) => {
  const quizQuery = "SELECT * FROM quizzes WHERE quizID = ?";
  const questionsQuery = "SELECT * FROM questions WHERE fk_quizID = ?";
  const answersQuery = "SELECT * FROM answers WHERE fk_questionID = ?";
  const tagsQuery = "SELECT t.* FROM tags t JOIN quiz_tags qt ON t.tagID = qt.fk_tagID WHERE qt.fk_quizID = ?";

  pool.query(quizQuery, [quizID], (error, quizResults) => {
    if (error) {
      callback(error);
    } else {
      const quiz = quizResults[0];
      pool.query(questionsQuery, [quizID], (error, questionResults) => {
        if (error) {
          callback(error);
        } else {
          const questions = questionResults;
          questions.forEach(question => {
            pool.query(answersQuery, [question.questionID], (error, answerResults) => {
              if (error) {
                callback(error);
              } else {
                question.answers = answerResults;
              }
            });
          });
          quiz.questions = questions;
          pool.query(tagsQuery, [quizID], (error, tagResults) => {
            if (error) {
              callback(error);
            } else {
              quiz.tags = tagResults;
              callback(null, quiz);
            }
          });
        }
      });
    }
  });
};
