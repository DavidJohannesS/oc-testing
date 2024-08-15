const userModel = require('../models/userModel');
const bcrypt=require('bcrypt');
//---------------------------------------------------------------------REGISTER
exports.handleRegister = (req, res) => {
      // Get the user data from the request body
      const user = req.body;

      // Call the createUser function from the userModel
      userModel.createUser(user, (error, userId) => {
	    if (error) {
		  console.error('Database Error: ' + error.message);
		  res.status(500).json({ status: 'error', message: 'Failed to register user.' });
	    } else {
		  res.status(200).json({ status: 'ok', userId: userId });
	    }
      });
};
//---------------------------------------------------------------------LOGIN
exports.handleLogin = (req, res) => {
  userModel.getUserByUsername(req.body.username, (error, user) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to login.' });
    } else if (!user) {
      res.status(418).json({ status: 'user not found' });
    } else if (bcrypt.compareSync(req.body.password, user.password)) {
      delete user.password; // remove password from the response
      res.status(200).json({ status: 'ok', ...user });
    } else {
      res.status(418).json({ status: 'invalid password' });
    }
  });
};
//----------------------------------------------------------------FETCH USER
exports.getUsers = (req, res) => {
  userModel.getUsers((error, users) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get users.' });
    } else if (!users) {
      res.status(404).json({ status: 'error', message: 'Users not found.' });
    } else {
      res.status(200).json(users);
    }
  });
};
//----------------------------------------------------------------FETCH USER BY ID
exports.getUserByID = (req, res) => {
  userModel.getUserByID(req.params.userID, (error, user) => {
   if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to get user.' });
    } else if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
    } else {
      res.status(200).json(user);
    }
  });
};
//--------------------------------------------------------UPDATE USER
exports.updateUser = (req, res) => {
  userModel.updateUser(req.body, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to update user.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ status: 'error', message: 'No changes were made to the user.' });
    } else {
      res.status(200).json({ status: 'ok', message: 'User updated successfully.' });
    }
  });
};
//------------------------------------------------------DELETE USER
exports.deleteUser = (req, res) => {
  userModel.deleteUser(req.params.userID, (error, result) => {
    if (error) {
      console.error('Database Error: ' + error.message);
      res.status(500).json({ status: 'error', message: 'Failed to delete user.' });
    } else if (result === 0) {
      res.status(404).json({ status: 'error', message: 'User not found.' });
    } else {
      res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
    }
  });
};
