const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// when it's more than one route with the same parameter abi endpoint:
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getSingleUser);

module.exports = router;
