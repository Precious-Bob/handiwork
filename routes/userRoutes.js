const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/').get(authController.protect, userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/updateMyPassword')
  .patch(authController.protect, userController.updatePassword);

router
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);
router
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

// when it's more than one route with the same parameter abi endpoint:
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

module.exports = router;
