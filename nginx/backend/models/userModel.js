const bcrypt = require('bcrypt');
const pool = require('../util/db_conn');

//----------------------------------------------------------------------------CREATE USER
exports.createUser = (user, callback) => {
      const { username, password, role, email,
	    firstName, lastName, gender, 
	    birthday, showAge, creationDate, 
	    lastLogin } = user;
      const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the saltRounds
      const query = `INSERT INTO users 
  (username, password, role, email, 
  firstName, lastName, gender, birthday, 
  showAge, creationDate, lastLogin) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      pool.query(query, [username, hashedPassword,
	    role, email, firstName, lastName,
	    gender, birthday, showAge, 
	    creationDate, lastLogin], (error, results) => {
		  if (error) {
			callback(error);
		  } else {
			callback(null, results.insertId);
		  }
	    });
};
//-----------------------------------------------------------------USER BY NAME
exports.getUserByUsername = (username, callback) => {
      const query = "SELECT * FROM users WHERE username = ?";

      pool.query(query, [username], (error, results) => {
	    if (error) {
		  callback(error);
	    } else {
		  callback(null, results[0]); 
	    }
      });
};
//---------------------------------------------ALL USERS
exports.getUsers = (callback) => {
      const query = "SELECT * FROM users";

      pool.query(query, (error, results) => {
	    if (error) {
		  callback(error);
	    } else {
		  callback(null, results);
	    }
      });
};
//---------------------------------------------------------------USER BY ID
exports.getUserByID = (userID, callback) => {
      const query = "SELECT * FROM users WHERE userID = ?";

      pool.query(query, [userID], (error, results) => {
	    if (error) {
		  callback(error);
	    } else {
		  callback(null, results[0]); // return the first user found
	    }
      });
};
//------------------------------------------------------------------------------------UPDATE USER

exports.updateUser = (user, callback) => {
  const { userID, username, role, email, firstName, lastName, gender, birthday } = user;

  // Convert the birthday to the 'YYYY-MM-DD HH:MM:SS' format
  let date = new Date(birthday);
  let formattedBirthday = date.toISOString().slice(0, 19).replace('T', ' ');

  const query = `
    UPDATE users 
    SET username = ?, 
    role = ?, 
    email = ?, 
    firstName = ?, 
    lastName = ?, 
    gender = ?, 
    birthday = ? 
    WHERE userID = ?
  `;

  pool.query(query, [username, role, email, firstName, lastName, gender, formattedBirthday, userID], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
};
//--------------------------------------------------------DELETE USER
exports.deleteUser = (userID, callback) => {
  const query = 'DELETE FROM users WHERE userID = ?';

  pool.query(query, [userID], (error, results) => {
    if (error) {
      callback(error);
    } else {
      callback(null, results.affectedRows);
    }
  });
};
