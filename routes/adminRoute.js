const express = require('express');
const {
  deletePost,
  deleteUser,
  updateUserProperties,
  editUser,
} = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify token
const isAdmin = require('../middleware/isAdmin'); // Middleware to check admin privileges
const router = express.Router();

router.delete('/posts/:postId', verifyToken, isAdmin, deletePost); // Route to delete a post
router.delete('/users/:userId', verifyToken, isAdmin, deleteUser); // Route to delete a user
router.put('/users/:userId/properties', verifyToken, isAdmin, updateUserProperties); // Route to update user properties
router.put('/users/:userId', verifyToken, isAdmin, editUser); // Route to edit a user

module.exports = router;