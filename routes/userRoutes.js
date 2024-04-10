const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/updateMyPassword').patch(userController.updatePassword);

router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

// when it's more than one route with the same parameter abi endpoint:
// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

module.exports = router;
