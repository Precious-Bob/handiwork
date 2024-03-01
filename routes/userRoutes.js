const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const userController = require('../controllers/userController');

// router.post('/signup', authController.signup);
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// when it's more than one route with the same parameter abi endpoint:
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

router.route('/').get(authController.protect, userController.getAllUsers);
router.route('/:id').get(userController.getSingleUser);
module.exports = router;
