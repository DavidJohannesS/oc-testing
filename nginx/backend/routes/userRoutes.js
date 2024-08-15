const express=require('express');
const router =express.Router();

const userController = require('../controllers/userController');

router.post('/register', userController.handleRegister);
router.post('/login',userController.handleLogin);
router.get('/', userController.getUsers);
router.get('/:userID', userController.getUserByID);
router.put('/:userID', userController.updateUser);
router.delete('/:userID', userController.deleteUser);
module.exports=router;
